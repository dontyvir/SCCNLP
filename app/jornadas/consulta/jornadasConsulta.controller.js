'use strict';

angular.module('sccnlp.jornadas')

.controller('jornadasConsultarCtrl', ['$scope', '$state', '$filter', 'jornadasMessages', '$uibModal', '$rootScope', 'RestClient', 'sessionService', 'RestClientJornadaConsulta', 'validateRut', function($scope, $state, $filter, jornadasMessages, $uibModal, $rootScope, RestClient, sessionService, RestClientJornadaConsulta, validateRut) {

    $scope.messages = jornadasMessages;
    var session_data = sessionService.getUserData();

    $rootScope.registroModificar = [];
    $rootScope.tableDatosRegistroJornada = [];
    // --------- inicio de fecha ----------------
    $scope.today = function() {
        $scope.date = new Date();
    };
    $scope.today();

    $scope.popup1 = {
        opened1: false,
        opened2: false
    };

    $scope.rutTrabajador = null;
    $scope.fechaInicioJornada = null;
    $scope.horaInicioJornada = null;
    $scope.naveSelect = null;
    $scope.LugarSelected = null;
    $scope.fechaTerminoJornada = null;
    $scope.horaTerminoJornada = null;
    $scope.sitioJornada = null;

    $scope.formats = ['dd-MM-yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.open1 = function() {
        $scope.popup1.opened1 = true;
    };
    $scope.open2 = function() {
        $scope.popup1.opened2 = true;
    };

    // Disable weekend selection

    var dateFormat = 'yyyy-MM-dd';
    var timeFormat = 'HH:mm';
    $scope.format = 'dd/MM/yyyy';

    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // ---------------fin de fecha ------------------------

    //---- paginacion
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 5;
    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    // --- fin paginacion
    //-------------- LLAMADA DE SERVICIOS ----------------------
    $scope.init = function() {
        $scope.naves = RestClient.getNave();
        $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa);
    };

    // se llaman las funciones de inicialización dinámicas
    $scope.init();
    //-------------- FIN LLAMADA DE SERVICIOS ----------------------



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


    //---- FIN VALIDADOR DE RUT ----

    $scope.validateRut = function(documentoIdentificador) {
            var response = validateRut.validate(documentoIdentificador);
            if (response) {
                $scope.messagerut = ""
                $scope.validadoRut = true;
                $scope.messagevalidateRut = false;

            } else {
                $scope.messagerut = "El Rut no es válido :'( "
                $scope.messagevalidateRut = true;
                $scope.validadoRut = false;
            }
        }
        //---- FIN VALIDADOR DE RUT ----

    $scope.buscarJornada = function(documentoIdentificador) {

        $scope.activarBuscar = true;
        $rootScope.tableDatosRegistroJornada = [];

        if (($scope.rutTrabajador == "" || $scope.rutTrabajador == undefined) &&
            ($scope.fechaInicioJornada == "" || $scope.fechaInicioJornada == undefined) &&
            ($scope.horaInicioJornada == "" || $scope.horaInicioJornad == undefined) &&
            ($scope.naveSelect == "" || $scope.naveSelect == undefined) &&
            ($scope.LugarSelected == "" || $scope.LugarSelected == undefined) &&
            ($scope.fechaTerminoJornada == "" || $scope.fechaTerminoJornada == undefined) &&
            ($scope.horaTerminoJornada == "" || $scope.horaTerminoJornada == undefined) &&
            ($scope.sitioJornada == "" || $scope.sitioJornada == undefined)) {
            $scope.animationsEnabled == true;
            var message = "No ha ingresado ningún criterio de búsqueda. Vuelva a intentarlo";
            $scope.messageModal(message);
            $scope.activarBuscar = false;
        } else {

            if (documentoIdentificador == 'rut' && $scope.rutTrabajador != undefined) {
                var rut = $scope.rutTrabajador.split("-")[0];
                var dv = $scope.rutTrabajador.split("-")[1];
            } else {
                var pasaporte = $scope.rutTrabajador;
            }

            var fechaInicioJornada = $filter('date')($scope.fechaInicioJornada, dateFormat);
            var horaInicioJornada = $filter('date')($scope.horaInicioJornada, timeFormat);
            var nave = $scope.naveSelect;
            var lugar = $scope.LugarSelected;
            var fechaTerminoJornada = $filter('date')($scope.fechaTerminoJornada, dateFormat);
            var horaTerminoJornada = $filter('date')($scope.horaTerminoJornada, timeFormat);
            var sitio = $scope.sitioJornada;
            var idEmpresa = session_data.idEmpresa;


            RestClientJornadaConsulta.consultarJornada(idEmpresa, fechaInicioJornada, horaInicioJornada, rut, dv, pasaporte, nave, lugar, fechaTerminoJornada, horaTerminoJornada, sitio, function(data) {

                    angular.forEach(data, function(item, index) {

                        if (item.rut != null) {
                            $scope.rutTrabajadorJornada = item.rut + "-" + item.dv
                        } else {
                            $scope.rutTrabajadorJornada = item.pasaporte;
                        }

                        if (item.fechaInicioJornada.split("-")[0] == '0001') {
                            item.fechaInicioJornada = "";
                        }

                        if (item.fechaFinJornada.split("-")[0] == '0001') {
                            item.fechaFinJornada = "";
                        }

                        if (item.horaInicioJornada != "") {
                            var horaInicioJornada = new Date(1970, 0, 1, item.horaInicioJornada.split(":")[0], item.horaInicioJornada.split(":")[1], item.horaInicioJornada.split(":")[2]);
                        }
                        if (item.horaInicioDescanso != "") {
                            var horaInicioDescanso = new Date(1970, 0, 1, item.horaInicioDescanso.split(":")[0], item.horaInicioDescanso.split(":")[1], item.horaInicioDescanso.split(":")[2]);
                        }
                        if (item.horaTerminoDescanso != "") {
                            var horaTerminoDescanso = new Date(1970, 0, 1, item.horaTerminoDescanso.split(":")[0], item.horaTerminoDescanso.split(":")[1], item.horaTerminoDescanso.split(":")[2]);
                        }
                        if (item.horaTerminoJornada != "") {
                            var horaTerminoJornada = new Date(1970, 0, 1, item.horaTerminoJornada.split(":")[0], item.horaTerminoJornada.split(":")[1], item.horaTerminoJornada.split(":")[2]);
                        }

                        $rootScope.tableDatosRegistroJornada.push({
                            rutPasaporteTrabajador: $scope.rutTrabajadorJornada,
                            rut: item.rut,
                            dv: item.dv,
                            pasaporte: item.pasaporte,
                            nombresTrabajador: item.nombre,
                            apellidosTrabajador: item.apellidos,
                            idNave: item.idNave,
                            nave: item.nave,
                            idLugar: item.idEmprLocacion,
                            lugar: item.lugar,
                            FechaInicioJornadaTrabajador: $filter('date')(item.fechaInicioJornada, $scope.format),
                            HoraInicioJornadaTrabajador: $filter('date')(horaInicioJornada, timeFormat),
                            HoraInicioDescansoTrabajador: $filter('date')(horaInicioDescanso, timeFormat),
                            HoraTerminoDescansoTrabajador: $filter('date')(horaTerminoDescanso, timeFormat),
                            FechaTerminoJornadaTrabajador: $filter('date')(item.fechaFinJornada, $scope.format),
                            HoraTerminoJornadaTrabajador: $filter('date')(horaTerminoJornada, timeFormat),
                            extencionJornada: item.extensionJornada,
                            idJornada: item.idJornada,
                            tipoDocumento: item.tipoDocumento,
                            idIngresoJornada: item.idIngresoJornada,
                            idPersona: item.idPersona,
                            idDomicilio: item.idDomicilio

                        });

                    })

                    if (data.length == 0) {
                        /*$scope.animationsEnabled = true;
                        var message = "Los criterios de búsqueda ingresados, no tienen resultados asociados. Vuelva a intentarlo.";
                        $scope.messageModal(message);*/
                        alert("Los criterios de búsqueda ingresados, no tienen resultados asociados. Vuelva a intentarlo.");
                    } else {
                        $scope.mostrarTabla = true;
                    }

                    $scope.totalItems = $rootScope.tableDatosRegistroJornada.length;
                    $scope.activarBuscar = false;

                    $scope.rutTrabajador = null;
                    $scope.fechaInicioJornada = null;
                    $scope.horaInicioJornada = null;
                    $scope.naveSelect = null;
                    $scope.LugarSelected = null;
                    $scope.fechaTerminoJornada = null;
                    $scope.horaTerminoJornada = null;
                    $scope.sitioJornada = null;
                },
                function(error) {
                    /*$scope.animationsEnabled = true;
                    var message = error.statusText;
                    $scope.messageModal(message);*/
                    alert("En estos momentos no se puede conectar a los servicios, intente mas tarde");
                    $scope.activarBuscar = false;
                })
        }

    }

    $scope.limpiar = function() {

        $scope.rutTrabajador = "";
        $scope.fechaInicioJornada = "";
        $scope.horaInicioJornada = "";
        $scope.naveSelect = "";
        $scope.LugarSelected = "";
        $scope.fechaTerminoJornada = "";
        $scope.horaTerminoJornada = "";
        $scope.sitioJornada = "";

        $rootScope.tableDatosRegistroJornada = [];
        $scope.mostrarTabla = false;

    }

    $scope.getExcel = function() {

        var mystyle = {
            sheetid: 'Consulta Jornadas',
            headers: true,
            style: 'font-size:12px;font-weight:bold;background:white',

            caption: {
                title: 'Consulta Jornadas'
            },

            columns: [{
                    columnid: 'rutPasaporteTrabajador',
                    title: 'Rut o Pasaporte',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold'
                }, {
                    columnid: 'nombresTrabajador',
                    title: 'Nombres',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'apellidosTrabajador',
                    title: 'Apellidos',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold;',
                    width: 200
                }, {
                    columnid: 'nave',
                    title: 'Nave',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'lugar',
                    title: 'Lugar',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'FechaInicioJornadaTrabajador',
                    title: 'Fecha Inicio de Jornada',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'HoraInicioJornadaTrabajador',
                    title: 'Hora Inicio de Jornada',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'HoraInicioDescansoTrabajador',
                    title: 'Hora Inicio de Descanso',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'HoraTerminoDescansoTrabajador',
                    title: 'Hora Término de Descanso',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'FechaTerminoJornadaTrabajador',
                    title: 'Fecha Término de Jornada',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }, {
                    columnid: 'HoraTerminoJornadaTrabajador',
                    title: 'Hora Término de Jornada',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }

            ],

            row: {
                style: function(sheet, row, rowidx) {
                    return 'background:' + (rowidx % 2 ? '#F1F1F1' : 'white') + ';text-align:center;border-style:groove;vertical-align:middle';
                }
            }

        };

        angular.forEach($rootScope.tableDatosRegistroJornada, function(data, i) {

            if (data.FechaTerminoJornadaTrabajador == null)
                data.FechaTerminoJornadaTrabajador = "";
            if (data.lugar == null)
                data.lugar = "";
            if (data.nave == null)
                data.nave = "";
            if (data.HoraInicioDescansoTrabajador == null)
                data.HoraInicioDescansoTrabajador = "";
            if (data.HoraTerminoDescansoTrabajador == null)
                data.HoraTerminoDescansoTrabajador = "";
            if (data.HoraTerminoJornadaTrabajador == null)
                data.HoraTerminoJornadaTrabajador = "";
        })

        alasql('SELECT * INTO XLS("Consulta de Jornadas - ' + new Date() + '.xls",?) FROM ?', [mystyle, $rootScope.tableDatosRegistroJornada]);

    };

    $scope.modificarJornada = function(data, index) {

        $rootScope.registroModificar = data;
        $rootScope.index = index;
        $scope.animationsEnabled = true;

        var modalInstance = $uibModal.open({
            templateUrl: 'jornadas/consulta/jornadas_consultarModal.view.html',
            controller: 'ModalModificarCtrl',
            size: 'lg',
            windowClass: 'modalModifcar'
        });

    }

}])

.filter('startFromGrid', function() {

    return function(input, start) {
        start = +start;
        return input.slice(start);
    }

})

.controller('ModalModificarCtrl', function($scope, $filter, $uibModalInstance, $rootScope, $uibModal, RestClient, sessionService, RestClientJornadaConsulta) {

    var session_data = sessionService.getUserData();
    $scope.naves = RestClient.getNave();
    $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa);

    var dateFormat = 'yyyy-MM-dd';
    var timeFormat = 'HH:mm';

    $scope.popup1 = {
        opened: false
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.naveSelected = $scope.registroModificar.idNave;
    $scope.lugarSelected = $scope.registroModificar.idLugar;

    $scope.fechaInicioJornadaTrabajador = new Date($scope.registroModificar.FechaInicioJornadaTrabajador);
    $scope.fechaTerminoJornadaTrabajador = new Date($scope.registroModificar.FechaTerminoJornadaTrabajador);

    if ($scope.registroModificar.HoraInicioJornadaTrabajador != undefined) {
        //$scope.registroModificar.HoraInicioJornadaTrabajador = $scope.registroModificar.HoraInicioJornadaTrabajador + ":00";
        var horaInicioJornada = $scope.registroModificar.HoraInicioJornadaTrabajador.split(':');
        $scope.horaInicioJornadaTrabajador = new Date(1970, 0, 1, horaInicioJornada[0], horaInicioJornada[1]);
    }
    if ($scope.registroModificar.HoraInicioDescansoTrabajador != undefined) {
        // $scope.registroModificar.HoraInicioDescansoTrabajador = $scope.registroModificar.HoraInicioDescansoTrabajador + ":00";
        var horaInicioDescanso = $scope.registroModificar.HoraInicioDescansoTrabajador.split(':');
        $scope.horaInicioDescansoTrabajador = new Date(1970, 0, 1, horaInicioDescanso[0], horaInicioDescanso[1]);
    }
    if ($scope.registroModificar.HoraTerminoDescansoTrabajador != undefined) {
        // $scope.registroModificar.HoraTerminoDescansoTrabajador = $scope.registroModificar.HoraTerminoDescansoTrabajador + ":00";
        var horaTerminoDescanso = $scope.registroModificar.HoraTerminoDescansoTrabajador.split(':');
        $scope.horaTerminoDescansoTrabajador = new Date(1970, 0, 1, horaTerminoDescanso[0], horaTerminoDescanso[1]);
    }
    if ($scope.registroModificar.HoraTerminoJornadaTrabajador != undefined) {
        // $scope.registroModificar.HoraTerminoJornadaTrabajador = $scope.registroModificar.HoraTerminoJornadaTrabajador + ":00";
        var horaTerminoJornada = $scope.registroModificar.HoraTerminoJornadaTrabajador.split(':');
        $scope.horaTerminoJornadaTrabajador = new Date(1970, 0, 1, horaTerminoJornada[0], horaTerminoJornada[1]);
    }
    $scope.guardar = function() {

        var registroModificado = {

            idJornada: $scope.registroModificar.idJornada,
            idIngresoJornada: $scope.registroModificar.idIngresoJornada,
            idEmpresa: parseInt(session_data.idEmpresa),
            nombre: $scope.registroModificar.nombresTrabajador,
            apellidos: $scope.registroModificar.apellidosTrabajador,
            rut: $scope.registroModificar.rut,
            dv: $scope.registroModificar.dv,
            pasaporte: $scope.registroModificar.pasaporte,
            tipoDocumento: $scope.registroModificar.tipoDocumento,
            idPersona: $scope.registroModificar.idPersona,
            idNave: $scope.naveSelected,
            idEmprLocacion: $scope.lugarSelected,
            fechaInicioJornada: $scope.fechaInicioJornadaTrabajador,
            fechaFinJornada: $scope.fechaTerminoJornadaTrabajador,
            horaInicioJornada: $filter('date')($scope.horaInicioJornadaTrabajador, timeFormat),
            horaTerminoJornada: $filter('date')($scope.horaTerminoJornadaTrabajador, timeFormat),
            horaInicioDescanso: $filter('date')($scope.horaInicioDescansoTrabajador, timeFormat),
            horaTerminoDescanso: $filter('date')($scope.horaTerminoDescansoTrabajador, timeFormat),
            extensionJornada: $scope.registroModificar.extensionJornada
        }


        RestClientJornadaConsulta.modificarJornada(registroModificado, function(response) {

            if (response.horaInicioJornada != undefined) {
                var horaInicioJornada = new Date(1970, 0, 1, response.horaInicioJornada.split(":")[0], response.horaInicioJornada.split(":")[1], response.horaInicioJornada.split(":")[2]);
            }
            if (response.horaInicioDescanso != undefined) {
                var horaInicioDescanso = new Date(1970, 0, 1, response.horaInicioDescanso.split(":")[0], response.horaInicioDescanso.split(":")[1], response.horaInicioDescanso.split(":")[2]);
            }
            if (response.horaTerminoDescanso != undefined) {
                var horaTerminoDescanso = new Date(1970, 0, 1, response.horaTerminoDescanso.split(":")[0], response.horaTerminoDescanso.split(":")[1], response.horaTerminoDescanso.split(":")[2]);
            }
            if (response.horaTerminoJornada != undefined) {
                var horaTerminoJornada = new Date(1970, 0, 1, response.horaTerminoJornada.split(":")[0], response.horaTerminoJornada.split(":")[1], response.horaTerminoJornada.split(":")[2]);
            }
            $rootScope.tableDatosRegistroJornada[$scope.index].idNave = response.idNave;
            $rootScope.tableDatosRegistroJornada[$scope.index].idLugar = response.idEmprLocacion;
            $rootScope.tableDatosRegistroJornada[$scope.index].HoraInicioDescansoTrabajador = $filter('date')(horaInicioDescanso, timeFormat);
            $rootScope.tableDatosRegistroJornada[$scope.index].HoraTerminoDescansoTrabajador = $filter('date')(horaTerminoDescanso, timeFormat);
            $rootScope.tableDatosRegistroJornada[$scope.index].FechaTerminoJornadaTrabajador = $filter('date')(response.fechaFinJornada, dateFormat);
            $rootScope.tableDatosRegistroJornada[$scope.index].HoraTerminoJornadaTrabajador = $filter('date')(horaTerminoJornada, timeFormat);

            if (response.error == null) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'jornadas/jornadas.modal.view.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg'
                });
            } else {
                $scope.animationsEnabled = true;
                var message = response.error;
                $scope.messageModal(message);
            }
            $uibModalInstance.close();

        }, function(error) {
            $scope.animationsEnabled = true;
            var message = "No se pudo modificar el registro, intente nuevamente";
            $scope.messageModal(message);
        })

    }

    $scope.cancelar = function() {
        $uibModalInstance.dismiss('cancel');
    };
})

.controller('ModalInstanceCtrl', function($scope, $uibModal, $uibModalInstance, $rootScope) {

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

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.ok = function() {

        $scope.animationsEnabled = true;
        var message = "Se ha modificado correctamente la Jornada";
        $scope.messageModal(message);

        $uibModalInstance.close();

    };
})