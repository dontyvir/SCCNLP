'use strict';

// definición de módulo menu
angular.module('sccnlp.jornadas')

.controller('jornadasIndividualCtrl', ['$scope', '$state', '$filter', 'jornadasMessages', '$uibModal', '$rootScope', 'RestClient', 'sessionService', 'RestClientJornada', 'validateRut',

    function($scope, $state, $filter, jornadasMessages, $uibModal, $rootScope, RestClient, sessionService, RestClientJornada, validateRut) {

        //--------------------------- Controller for NombradanIndividualTab.html ------------------------------------
        $scope.messages = jornadasMessages;
        var session_data = sessionService.getUserData();
        $scope.blockButton = true;
        var vm = this;
        $scope.ingreso = {
            rutTrabajador: null
        };

        $scope.tableDatosRegistro = [];
        //tabs
        $rootScope.tabsActive = 0;
        $rootScope.tabs = [{
                disable: false
            }, //tab ingreso de nombrada
            {
                disable: true
            }, // tab resolucion
        ]

        //variables
        $scope.tableDatosTrabajadores = [];

        // ------------- datepicker --------------------

        // popup del datepicker
        $scope.popupInicio = [{
            opened: false
        }];
        $scope.popupTermino = [{
            opened: false
        }];
        $scope.openDataPickerInicio = function(i) {
            $scope.popupInicio[i].opened = true;
        };
        $scope.openDataPickerTermino = function(i) {
            $scope.popupTermino[i].opened = true;
        };

        // Disable weekend selection
        var dateFormat = 'yyyy-MM-dd';
        var timeFormat = 'HH:mm';
        $scope.format = 'dd/MM/yyyy'

       /* function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }*/

        $scope.dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            //maxDate: new Date(2020, 5, 22),
            //minDate: new Date(),
            startingDay: 1
        };


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
                controller: 'ModalIndividualCtrl',
                size: 'sm'
            });
        }

        //--- SERVICIOS ---------------
        $scope.init = function() {

            $scope.naves = RestClient.getNave();
            $scope.locacion = RestClient.getLocacion(session_data.rutEmpresa);
        };

        $scope.loadTrabajador = function(dato, documentoIdentificador) {

            if (dato == "" || dato == undefined) {
                $scope.validadoRut = false;
                return;
            }

            if (documentoIdentificador == 'rut') {
                var rutTrabajador = dato.split("-")[0];
                var dvTrabajador = dato.split("-")[1];
                var pasaporte = null;
            } else {
                var rutTrabajador = 0;
                var dvTrabajador = null;
                var pasaporte = dato;
            }
            RestClient.getDatosPersona(rutTrabajador, dvTrabajador, pasaporte, function(data) {
                if (data.id == 0) {
                    $scope.animationsEnabled = true;
                    var message = "Persona no encontrada";
                    $scope.messageModal(message);
                    $scope.validadoRut = false;
                } else {
                    $scope.tableDatosTrabajadores.push({
                        id: $scope.tableDatosTrabajadores.length + 1,
                        idPersona: data.id,
                        rutTrabajador: data.rut,
                        dv: data.dv,
                        pasaporteTrabajador: data.pasaporte,
                        nombresTrabajador: data.nombres,
                        apellidosTrabajador: data.apellidoPaterno + " " + data.apellidoMaterno,
                    });
                    $scope.showTableTrabajadores = true;
                    $scope.validadoRut = false;
                    $scope.totalItems = $scope.tableDatosTrabajadores.length;
                    $scope.blockButton = false;

                }
            }, function(error) {
                $scope.animationsEnabled = true;
                var message = "Problemas en la conexión, intente mas tarde";
                $scope.messageModal(message);
                $scope.validadoRut = false;
            });
        }

        // se llaman las funciones de inicialización dinámicas
        $scope.init();

        // FUNCION QUE AÑADE UN TRABAJADOR AL LISTADO
        $scope.agregarTrabajador = function(rutTrabajador, documentoIdentificador) {

            var encontro = false;
            $scope.validadoRut = true;

            $scope.popupInicio.push({
                opened: false
            })
            $scope.popupTermino.push({
                opened: false
            })

            var response = validateRut.validate(documentoIdentificador);
            if (response) {
                $scope.messagerut = ""
                $scope.messagevalidateRut = false;
                angular.forEach($scope.tableDatosTrabajadores, function(item, index) {

                    if (documentoIdentificador == 'rut') {
                        var rutTrabajadorIngresado = item.rutTrabajador + "-" + item.dv;
                        if (rutTrabajadorIngresado == rutTrabajador) {
                            encontro = true;
                        }
                    } else {
                        if (item.pasaporteTrabajador == rutTrabajador) {
                            encontro = true;
                        }
                    }

                });

                if (encontro) {
                    $scope.animationsEnabled = true;
                    var message = "Se encontro un rut o pasaporte existente, por favor ingrese un nuevo rut";
                    $scope.messageModal(message);
                    $scope.validadoRut = false;
                } else {

                    $scope.loadTrabajador(rutTrabajador, documentoIdentificador);
                    $scope.ingreso.rutTrabajador = "";
                    $scope.verTablaTrabajador = false;
                    $scope.messagevalidateRut = false;
                    $scope.totalItems = $scope.tableDatosTrabajadores.length;

                }

            } else {
                $scope.messagerut = "El Rut no es válido"
                $scope.messagevalidateRut = true;
                $scope.validadoRut = false;
            }

        }

        // FUNCION QUE ELIMINA UN TRABAJADOR DE LA LISTADO
        $scope.eliminarTrabajador = function(id) {
            var itemEliminar = id;
            var itemMover = id++;
            $scope.tableDatosTrabajadores.splice(itemEliminar, 1);
            $scope.totalItems = $scope.tableDatosTrabajadores.length;
            //$scope.configPages();
        };

        $scope.continuar = function(tab) {
            $scope.animationsEnabled = true;
            $rootScope.tab = tab;
            $scope.DatosTrabajadores = [];
            $scope.validateCampos = true;
            $scope.validateHora = true;
            $scope.validateHoraDescanso = true;
            $scope.validateFecha = true;


            angular.forEach($scope.tableDatosTrabajadores, function(item, index) {
                $scope.tableDatosTrabajadores[index].validateRow = false;

                if ($scope.tableDatosTrabajadores[index].fechaInicioJornada == undefined ||
                    $scope.tableDatosTrabajadores[index].horaInicioJornada == undefined ||
                    ($scope.tableDatosTrabajadores[index].naveSelect == null && $scope.tableDatosTrabajadores[index].locacionSelect == null)) {

                    $scope.tableDatosTrabajadores[index].validateRow = true;
                    $scope.validateCampos = false;
                } else {

                    if (($scope.tableDatosTrabajadores[index].horaInicioJornada >= $scope.tableDatosTrabajadores[index].horaTerminoJornada) && ($scope.tableDatosTrabajadores[index].fechaInicioJornada >= $scope.tableDatosTrabajadores[index].fechaTerminoJornada)) {
                        $scope.validateHora = false;
                        $scope.tableDatosTrabajadores[index].validateRow = true;
                    }

                    if ($scope.tableDatosTrabajadores[index].horaInicioDescanso >= $scope.tableDatosTrabajadores[index].horaTerminoDescanso) {
                        $scope.validateHoraDescanso = false;
                        $scope.tableDatosTrabajadores[index].validateRow = true;
                    }

                    if ($scope.tableDatosTrabajadores[index].fechaInicioJornada > $scope.tableDatosTrabajadores[index].fechaTerminoJornada) {
                        $scope.validateFecha = false;
                        $scope.tableDatosTrabajadores[index].validateRow = true;
                    }

                }

                if ($scope.validateCampos && $scope.validateHora && $scope.validateFecha) {
                    $scope.DatosTrabajadores.push({
                        idEmpresa: session_data.idEmpresa,
                        nombre: $scope.tableDatosTrabajadores[index].nombresTrabajador,
                        apellidos: $scope.tableDatosTrabajadores[index].apellidosTrabajador,
                        rut: $scope.tableDatosTrabajadores[index].rutTrabajador,
                        dv: $scope.tableDatosTrabajadores[index].dv,
                        pasaporte: $scope.tableDatosTrabajadores[index].pasaporteTrabajador,
                        idPersona: $scope.tableDatosTrabajadores[index].idPersona,
                        nave: null,
                        idNave: $scope.tableDatosTrabajadores[index].naveSelect,
                        domicilio: null,
                        idDomicilio: null,
                        lugar: null,
                        idEmprLocacion: $scope.tableDatosTrabajadores[index].locacionSelect,
                        fechainiciojornada: $filter('date')($scope.tableDatosTrabajadores[index].fechaInicioJornada, dateFormat),
                        fechafinjornada: $filter('date')($scope.tableDatosTrabajadores[index].fechaTerminoJornada, dateFormat),
                        horainiciojornada: $filter('date')($scope.tableDatosTrabajadores[index].horaInicioJornada, timeFormat),
                        horaterminojornada: $filter('date')($scope.tableDatosTrabajadores[index].horaTerminoJornada, timeFormat),
                        horainiciodescanso: $filter('date')($scope.tableDatosTrabajadores[index].horaInicioDescanso, timeFormat),
                        horaterminodescanso: $filter('date')($scope.tableDatosTrabajadores[index].horaTerminoDescanso, timeFormat),
                        extensionJornada: false,
                        error: null
                    })
                }

            });

            if ($scope.validateCampos && $scope.validateHora && $scope.validateFecha && $scope.validateHoraDescanso) {

                $scope.registrarJornada($scope.DatosTrabajadores);

            } else {
                if (!$scope.validateCampos) {
                    $scope.animationsEnabled = true;
                    var message = "Debe ingresar los campos obligatorios de la tabla";
                    $scope.messageModal(message);
                }
                if (!$scope.validateHora) {
                    $scope.animationsEnabled = true;
                    var message = "La hora de inicio de jornada debe ser menor a la de término de jornada";
                    $scope.messageModal(message);
                }
                if (!$scope.validateHoraDescanso) {
                    $scope.animationsEnabled = true;
                    var message = "La hora de inicio de descanso debe ser menor a la de término de descanso";
                    $scope.messageModal(message);
                }
                if (!$scope.validateFecha) {
                    $scope.animationsEnabled = true;
                    var message = "El dia de inicio de jornada debe ser menor a la de término de jornada";
                    $scope.messageModal(message);
                }
            }

        }


        $scope.registrarJornada = function(data) {

            $scope.blockButton = true;
            $scope.validadoRut = true;

            RestClientJornada.registrarJornada(data, function(response) {

                angular.forEach(response, function(item, index) {
                    if (item.rut != null) {
                        $scope.rutPasaporte = item.rut + "-" + item.dv;
                    } else {
                        $scope.rutPasaporte = item.pasaporte;
                    }

                    $scope.tableDatosRegistro.push({
                        idTrabajador: item.id,
                        rutPasaporteTrabajador: $scope.rutPasaporte,
                        nombresTrabajador: item.nombre,
                        apellidosTrabajador: item.apellidos,
                        nave: item.nave,
                        lugar: item.lugar,
                        FechaInicioJornadaTrabajador: $filter('date')(item.fechaInicioJornada, $scope.format),
                        HoraInicioJornadaTrabajador: $filter('date')(item.horaInicioJornada, timeFormat),
                        HoraInicioDescansoTrabajador: $filter('date')(item.horaInicioDescanso, timeFormat),
                        HoraTerminoDescansoTrabajador: $filter('date')(item.horaTerminoDescanso, timeFormat),
                        FechaTerminoJornadaTrabajador: $filter('date')(item.fechaFinJornada, $scope.format),
                        HoraTerminoJornadaTrabajador: $filter('date')(item.horaTerminoJornada, timeFormat),
                    });

                })
                var modalInstance = $uibModal.open({
                    templateUrl: 'jornadas/jornadas.modal.view.html',
                    controller: 'ModalIndividualCtrl',
                    size: 'lg',
                    backdrop: 'static'
                });
                $scope.totalItems = $scope.tableDatosRegistro.length;
                $scope.blockButton = false;
                $scope.validadoRut = false;

            }, function(error) {
                $scope.animationsEnabled = true;
                var message = error.statusText;
                $scope.blockButton = false;
                $scope.validadoRut = false;
            });
        }

        //--------------- TAB 2 ------------------------------

        $scope.getExcel = function() {

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
                        columnid: 'nave',
                        title: 'Nave',
                        style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                        width: 200
                    }, {
                        columnid: 'lugar',
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

            alasql('SELECT * INTO XLS("Reporte Copia Registro de Jornada - ' + new Date() + '.xls",?) FROM ?', [mystyle, $scope.tableDatosRegistro]);

        };

        $scope.cleanForm = function() {

            $scope.tableDatosTrabajadores = [];
            $scope.showTableTrabajadores = false;
        }
    }

])

.controller('ModalIndividualCtrl', function($scope, $uibModalInstance, $rootScope) {

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.ok = function() {

        $uibModalInstance.close();
        if (!$rootScope.tab || $rootScope.tab < 1 || $rootScope.tab > 2)
            return;

        $rootScope.tabs[$rootScope.tab].disable = false;
        $rootScope.tabs[0].disable = true;
        $rootScope.tabsActive = $rootScope.tab;

    };
})