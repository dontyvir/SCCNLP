'use strict';

// definición de módulo menu
angular.module('sccnlp.nombradas')

.controller('jornadasIndividualCtrl', ['$scope', '$state', '$filter', 'jornadasMessages', '$uibModal', '$rootScope', 'RestClient', 'sessionService', 'RestClientJornada', 'validateRut',

    function($scope, $state, $filter, nombradasMessages, $uibModal, $rootScope, RestClient, sessionService, RestClientJornada, validateRut) {

        //--------------------------- Controller for NombradanIndividualTab.html ------------------------------------
        $scope.messages = nombradasMessages;
        var session_data = sessionService.getUserData();
        var vm = this;

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
        var timeFormat = 'HH:MM';

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
        // ------------- fin datepicker --------------------

        // PAGINACION DE LA TABLA 
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];

        $scope.configPages = function() {
            $scope.pages.length = 0;
            var ini = $scope.currentPage - 4;
            var fin = $scope.currentPage + 5;
            if (ini < 1) {
                ini = 1;
                if (Math.ceil($scope.tableDatosTrabajadores.length / $scope.pageSize) > 5)
                    fin = 5;
                else
                    fin = Math.ceil($scope.tableDatosTrabajadores.length / $scope.pageSize);
            } else {
                if (ini >= Math.ceil($scope.tableDatosTrabajadores.length / $scope.pageSize) - 5) {
                    ini = Math.ceil($scope.tableDatosTrabajadores.length / $scope.pageSize) - 5;
                    fin = Math.ceil($scope.tableDatosTrabajadores.length / $scope.pageSize);
                }
            }
            if (ini < 1) ini = 1;
            for (var i = ini; i <= fin; i++) {
                $scope.pages.push({
                    no: i
                });
            }

            if ($scope.currentPage >= $scope.pages.length)
                $scope.currentPage = $scope.pages.length - 1;
        };

        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };

        // ---FIN DE PAGINACION DE TABLA----

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

        //--- SERVICIOS ---------------
        $scope.init = function() {

            $scope.naves = RestClient.getNave();
            $scope.locacion = RestClient.getLocacion(session_data.rutEmpresa);
        };

        $scope.loadTrabajador = function(dato, documentoIdentificador) {

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
                    $scope.configPages();
                }
            }, function(error) {
                $scope.animationsEnabled = true;
                var message = "Problemas en la conexión, intente mas tarde";
                $scope.messageModal(message);
            });
        }

        // se llaman las funciones de inicialización dinámicas
        $scope.init();

        //---FIN DE  SERVICIOS ---------------

        // FUNCION QUE AÑADE UN TRABAJADOR AL LISTADO
        $scope.agregarTrabajador = function(rutTrabajador, documentoIdentificador) {

            var encontro = false;

            $scope.popupInicio.push({
                opened: false
            })
            $scope.popupTermino.push({
                opened: false
            })

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
            } else {

                $scope.loadTrabajador(rutTrabajador, documentoIdentificador);

                $scope.rutTrabajador = "";
                $scope.validadoRut = false;
                $scope.verTablaTrabajador = false;
                $scope.messagevalidateRut = false;
                document.getElementById('txt_rut').value = "";
                $scope.configPages();

            }

        }

        // FUNCION QUE ELIMINA UN TRABAJADOR DE LA LISTADO
        $scope.eliminarTrabajador = function(id) {
            var itemEliminar = id - 1;
            var itemMover = id++;
            $scope.tableDatosTrabajadores.splice(itemEliminar, 1);
            $scope.configPages();
        };

        $scope.continuar = function(tab) {
            $scope.animationsEnabled = true;
            $rootScope.tab = tab;
            $scope.DatosTrabajadores = [];
            $scope.validateCampos = true;
            $scope.validateHora = true;
            $scope.validateFecha = true;


            angular.forEach($scope.tableDatosTrabajadores, function(item, index) {
                $scope.tableDatosTrabajadores[index].validateRow = false;

                if ($scope.tableDatosTrabajadores[index].fechaInicioJornada == undefined ||
                    $scope.tableDatosTrabajadores[index].horaInicioJornada == undefined) {

                    $scope.tableDatosTrabajadores[index].validateRow = true;
                    $scope.validateCampos = false;
                } else {

                    if ($scope.tableDatosTrabajadores[index].horaInicioJornada >= $scope.tableDatosTrabajadores[index].horaTerminoJornada) {

                        $scope.validateHora = false;
                        $scope.tableDatosTrabajadores[index].validateRow = true;
                    }
                    if ($scope.tableDatosTrabajadores[index].fechaInicioJornada >= $scope.tableDatosTrabajadores[index].fechaTerminoJornada) {

                        $scope.validateFecha = false;
                        $scope.tableDatosTrabajadores[index].validateRow = true;
                    }
                }

                if ($scope.validateCampos && $scope.validateHora && $scope.validateFecha) {
                    $scope.DatosTrabajadores.push({
                        IdEmpresa: 2,
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

            if ($scope.validateCampos && $scope.validateHora && $scope.validateFecha) {

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
                if (!$scope.validateFecha) {
                    $scope.animationsEnabled = true;
                    var message = "El dia de inicio de jornada debe ser menor a la de término de jornada";
                    $scope.messageModal(message);
                }
            }

        }


        $scope.registrarJornada = function(data) {

            RestClientJornada.registrarJornada(data, function(response) {

                angular.forEach(response, function(item, index) {
                    if (item.pasaporte == null) {
                        $scope.rutPasaporte = item.rut + "-" + item.dv;
                    } else {
                        $scope.rutPasaporte = item.pasaporte;
                    }

                    $scope.tableDatosRegistro.push({
                        id: '1',
                        idTrabajador: item.id,
                        rutPasaporteTrabajador: $scope.rutPasaporte,
                        nombresTrabajador: item.nombre,
                        apellidosTrabajador: item.apellidos,
                        nave: item.nave,
                        lugar: item.lugar,
                        FechaInicioJornadaTrabajador: $filter('date')(item.fechaInicioJornada, dateFormat),
                        HoraInicioJornadaTrabajador: $filter('date')(item.horaInicioJornada, timeFormat),
                        HoraInicioDescansoTrabajador: $filter('date')(item.horaInicioDescanso, timeFormat),
                        HoraTerminoDescansoTrabajador: $filter('date')(item.horaTerminoDescanso, timeFormat),
                        FechaTerminoJornadaTrabajador: $filter('date')(item.fechaFinJornada, dateFormat),
                        HoraTerminoJornadaTrabajador: $filter('date')(item.horaTerminoJornada, timeFormat),
                    });

                    var modalInstance = $uibModal.open({
                        templateUrl: 'jornadas/jornadas.modal.view.html',
                        controller: 'ModalIndividualCtrl',
                        size: 'lg'
                    });
                })

            }, function(error) {
                $scope.animationsEnabled = true;
                var message = error.statusText;
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


            alasql('SELECT * INTO XLS("Reporte Copia Registro de Jornada - ' + new Date() + '.xls",?) FROM ?', [mystyle, $scope.tableDatosRegistro]);

        };

        $scope.cleanForm = function() {

            $scope.tableDatosTrabajadores = [];
            $scope.showTableTrabajadores = false;
        }
    }

])

.filter('startFromGrid', function() {
        return function(input, start) {
            console.log(input);
            console.log(start);
            start = +start;
            return input.slice(start);
        }

    })
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