'use strict';

// definición de módulo menu
angular.module('sccnlp.jornadas')

.controller('JornadasMasivaCtrl', ['$scope', '$state', '$location', '$filter', 'jornadasMessages',
    '$uibModal', '$rootScope', 'RestClient', 'sessionService', 'RestClientJornadaMasiva', 'IPSERVER',
    function($scope, $state, $location, $filter, jornadasMessages,
        $uibModal, $rootScope, RestClient, sessionService, RestClientJornadaMasiva, IPSERVER) {

        //--------------------------- Controller for NombradanIndividualTab.html ------------------------------------
        $scope.messages = jornadasMessages;
        var session_data = sessionService.getUserData();
        $rootScope.ListadoErrores = [];
        $scope.tableDatosRegistro = [];
        $scope.fileUpload = null;
        var dateFormat = 'yyyy-MM-dd';
        $scope.format = 'dd/MM/yyyy';

        //tabs
        $rootScope.tabsActive = 0;
        $rootScope.tabs = [{
                disable: false
            }, //tab ingreso de nombrada
            {
                disable: true
            }, // tab resolucion
        ]

        //---- paginacion
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        // --- fin paginacion

        //funcion para mostrar un alert
        $scope.messageModal = function(message) {
            var template = '<div class="modal-body" id="modal-body">' +
                '<p>' + message + '</p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-primary" type="button" ng-click="cancel()">Cerrar</button>' +
                '</div>';

            var modalInstance = $uibModal.open({
                template: template,
                controller: 'ModalInstanceCtrl',
                size: 'sm'
            });
        }

        //--- SERVICIOS ---------------

        $scope.fileUpload = null;

        $scope.continuar = function(tab) {

            $rootScope.vdalidadorError = true;
            $rootScope.listadoErrores = [];
            $scope.activarBotones = true;

            $scope.data = 'none';

            $scope.fileUpload = document.getElementById('file').files[0];

            if ($scope.fileUpload != null) {

                if ($scope.fileUpload.name.substr(-3) != 'csv') {
                    alert("El archivo debe ser en formato csv")
                    $scope.activarBotones = false;
                } else {

                    $scope.urlCompleta = "";
                    RestClientJornadaMasiva.postFile($scope.fileUpload, function(data) {

                        angular.forEach(data, function(url, i) {
                            $scope.urlCompleta = $scope.urlCompleta + url
                        })

                        $scope.url = $scope.urlCompleta.split("[")[0];
                        $scope.url = $scope.url.split("\\");
                        var index = $scope.url.length;
                        $scope.nombreArchivo = $scope.url[index - 1];

                        $scope.validateCarga = true;

                        RestClientJornadaMasiva.registrarJornadasMasiva($scope.nombreArchivo, session_data.idEmpresa, function(data) {
                            angular.forEach(data, function(item, index) {
                                if (item.rut != null) {
                                    $scope.rutPasaporte = item.rut + "-" + item.dv;
                                } else {
                                    $scope.rutPasaporte = item.pasaporte;
                                }

                                if (item.error != null) {
                                    $rootScope.validadorError = true;
                                    $rootScope.listadoErrores.push({
                                        rutPasaporteTrabajador: $scope.rutPasaporte,
                                        nombresTrabajador: item.nombre + " " + item.apellidos,
                                        error: item.error
                                    });
                                } else {
                                    $scope.tableDatosRegistro.push({
                                        rutPasaporteTrabajador: $scope.rutPasaporte,
                                        nombresTrabajador: item.nombre,
                                        apellidosTrabajador: item.apellidos,
                                        nave: item.idNave,
                                        naveName: item.nave,
                                        lugar: item.idEmprLocacion,
                                        lugarName: item.lugar,
                                        FechaInicioJornadaTrabajador: $filter('date')(item.fechaInicioJornada, $scope.format),
                                        HoraInicioJornadaTrabajador: item.horaInicioJornada,
                                        HoraInicioDescansoTrabajador: item.horaInicioDescanso,
                                        HoraTerminoDescansoTrabajador: item.horaTerminoDescanso,
                                        FechaTerminoJornadaTrabajador: $filter('date')(item.fechaFinJornada, $scope.format),
                                        HoraTerminoJornadaTrabajador: item.horaTerminoJornada
                                    });

                                }
                            })

                            if (!$rootScope.validadorError) {
                                $rootScope.tab = tab;
                                $scope.animationsEnabled = true;
                                var modalInstance = $uibModal.open({
                                    templateUrl: 'jornadas/jornadas.modal.view.html',
                                    controller: 'ModalMasivoCtrl',
                                    size: 'lg',
                                    backdrop: 'static'
                                });
                            }

                            if ($rootScope.validadorError && $rootScope.listadoErrores.length > 1) {
                                $scope.isArray = true;
                                $scope.animationsEnabled = true;
                                var modalInstance = $uibModal.open({
                                    templateUrl: 'jornadas/ingreso_masivo/jornadas_masivaModal.view.html',
                                    controller: 'ModalMasivoCtrl',
                                    size: 'lg',
                                    backdrop: 'static'
                                });
                            }

                            if ($rootScope.listadoErrores.length == 1) {
                                $scope.animationsEnabled == true;
                                var message = $rootScope.listadoErrores[0].error;
                                $scope.messageModal(message);
                            }
                            $scope.totalItems = $scope.tableDatosRegistro.length;
                            $scope.activarBotones = false;

                        }, function(error) {
                            /*$scope.animationsEnabled == true;
                            var message = "El archivo no se pudo procesar, intente nuevamente";
                            $scope.messageModal(message);*/
                            alert("El archivo no se pudo procesar, intente nuevamente");
                            $scope.activarBotones = false;
                        })
                        
                    }, function(error) {
                        /*$scope.animationsEnabled == true;
                        var message = "El archivo no se pudo subir al servidor, intente nuevamente";
                        $scope.messageModal(message);*/
                        alert("El archivo no se pudo subir al servidor, intente nuevamente");
                        $scope.activarBotones = false;
                    })


                }
            } else {
                /*$scope.animationsEnabled == true;
                var message = "No ha cargado ningún archivo, por lo que no puede continuar el proceso. Vuelva a intentarlo.";
                $scope.messageModal(message);*/
                alert("No ha cargado ningún archivo, por lo que no puede continuar el proceso. Vuelva a intentarlo.");
                $scope.activarBotones = false;
            }

        };

        $scope.url = function() {
            window.location = IPSERVER.DESARROLLO + 'SCCNLP_Files/Jornadas/ArchivosEjemplo/PruebaJornadas.csv';

        }

        //--------------- TAB 2 ------------------------------

        $scope.getExcel = function() {

             console.log($scope.tableDatosRegistro);

            var mystyle = {
                sheetid: 'Copia de Registro de Jornada',
                headers: true,
                style: 'font-size:12px;font-weight:bold;background:white',

                caption: {
                    title: 'Copia de Registro de Jornada'
                },

                columns: [{
                        columnid: 'rutPasaporteTrabajador',
                        title: 'Rut o Pasaporte',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold'
                    }, {
                        columnid: 'nombresTrabajador',
                        title: 'Nombres',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'apellidosTrabajador',
                        title: 'Apellidos',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold;',
                        width: 200
                    }, {
                        columnid: 'naveName',
                        title: 'Nave',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'lugarName',
                        title: 'Lugar',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 100
                    }, {
                        columnid: 'FechaInicioJornadaTrabajador',
                        title: 'Fecha Inicio de Jornada',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'HoraInicioJornadaTrabajador',
                        title: 'Hora Inicio de Jornada',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'HoraInicioDescansoTrabajador',
                        title: 'Hora Inicio de Descanso',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'HoraTerminoDescansoTrabajador',
                        title: 'Hora Término de Descanso',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'FechaTerminoJornadaTrabajador',
                        title: 'Fecha Término de Jornada',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'HoraTerminoJornadaTrabajador',
                        title: 'Hora Término de Jornada',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    },

                ],

                row: {
                    style: function(sheet, row, rowidx) {
                        return 'background:' + (rowidx % 2 ? '#F1F1F1' : 'white') + ';text-align:center;border-style:groove;vertical-align:middle';
                    }
                }

            };

            angular.forEach($scope.tableDatosRegistro, function(data, i){

                if (data.FechaTerminoJornadaTrabajador == null)
                    data.FechaTerminoJornadaTrabajador = "";
                if (data.lugarName == null)
                    data.lugarName = "";
                if (data.naveName == null)
                    data.naveName = "";
                if (data.HoraInicioDescansoTrabajador == null)
                    data.HoraInicioDescansoTrabajador = "";
                if (data.HoraTerminoDescansoTrabajador == null)
                    data.HoraTerminoDescansoTrabajador = "";
                if (data.HoraTerminoJornadaTrabajador == null)
                    data.HoraTerminoJornadaTrabajador = "";
            }) 

            console.log($scope.tableDatosRegistro);
            alasql('SELECT * INTO XLS("Reporte Copia Registro Jornada - ' + new Date() + '.xls",?) FROM ?', [mystyle, $scope.tableDatosRegistro]);

        };

    }
])

.controller('ModalMasivoCtrl', function($scope, $uibModalInstance, $rootScope, jornadasMessages) {

    $scope.messages = jornadasMessages;
    $scope.listadoErrores = $rootScope.listadoErrores;

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.aceptar = function() {
        $uibModalInstance.close();
    };

    $scope.ok = function() {

        $uibModalInstance.close();

        if (!$rootScope.tab || $rootScope.tab < 1 || $rootScope.tab > 2)
            return;

        $rootScope.tabs[$rootScope.tab].disable = false;
        $rootScope.tabs[0].disable = true;
        $rootScope.tabsActive = $rootScope.tab;
        $uibModalInstance.close();

    };
});