'use strict';

// definición de módulo menu
angular.module('sccnlp.nombradas')

.controller('NombradasIndividualCtrl', ['$scope', '$state', 'nombradasMessages', '$uibModal', '$rootScope', 'RestClient', 'sessionService', 'RestClientNombrada', 'validateRut', function($scope, $state, nombradasMessages, $uibModal, $rootScope, RestClient, sessionService, RestClientNombrada, validateRut) {

    //--------------------------- Controller for NombradanIndividualTab.html ------------------------------------
    $scope.messages = nombradasMessages;
    $scope.messagevalidateRut = false;
    $scope.mostrarmensaje = false;
    $scope.datosNombrada = [];
    $scope.tableDatosTrabajadores = [];

    var session_data = sessionService.getUserData();

    console.log(session_data);

    var vm = this;

    //tabs
    $scope.tabsActive = 0;
    $scope.tabs = [{
            disable: false
        }, //tab ingreso de nombrada
        {
            disable: true
        }, // tab resolucion
    ]


    //---------------- inicio de fecha --------------------

    $scope.date = {
        value: new Date()
    };


    $scope.popup1 = {
        opened: false
    };

    $scope.formats = ['dd-MM-yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.openDataPicker = function() {
        $scope.popup1.opened = true;
    };

    // Disable weekend selection
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

    //-------------- fin de fecha---------------------

    var date_now = new Date();
    //Variables
    $scope.isVisible = true;
    $scope.verTablaTrabajador = false;

    //-------------- LLAMADA DE SERVICIOS ----------------------
    $scope.init = function() {

        $scope.naves = RestClient.getNave();
        $scope.tipoContrato = RestClient.getTipoContrato();
        $scope.labores = RestClient.getLabor();
        $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa, session_data.dvEmpresa);
        $scope.funciones = RestClient.getFuncion();
        $scope.jornadas = RestClient.getTipoJornada();
        $scope.tiposTurno = RestClient.getTurno();
    };

    $scope.loadTrabajador = function(dato, documentoIdentificador) {

        if (!dato)
            return;

        var idEmpresa = 1; //session_data.id;

        if (documentoIdentificador == 'rut') {
            var rutTrabajador = dato.split("-")[0];
            var dvTrabajador = dato.split("-")[1];
            /* var rutTrabajador = '1';
             var dvTrabajador = 'k';*/
            var pasaporte = "";
        } else {
            var rutTrabajador = "";
            var dvTrabajador = "";
            var pasaporte = dato;
        }

        rutTrabajador = '1';
        dvTrabajador = 'k';

        RestClientNombrada.getDatosTrabajador(idEmpresa, rutTrabajador, dvTrabajador, pasaporte, function(data) {
            if (data.activo) {
                var activo = 1;
            } else {
                var activo = 0;
            }
            $scope.tableDatosTrabajadores.push({
                idTrabajador: $scope.tableDatosTrabajadores.length + 1,
                id: 0,
                idNombrada: 0, // dato en duro no lo trae el servicio,
                activo: activo,
                idContrato: 14, // dato en duro, no lo trae el servicio
                idContratoNuevo: 0,
                idEstado: data.idEstado,
                fechaCreacion: $scope.date.value, //dato que no es
                rutPasaporteTrabajador: data.rut,
                dv: data.dv,
                nombresTrabajador: data.nombres,
                apellidosTrabajador: data.apellidoPaterno + " " + data.apellidoMaterno,
                tipoContratoTrabajador: data.nombreTipoContrato,
                totalHorasSemanales: data.totalHorasSemanales,
                remuneracionBrutaTrabajador: data.remuneracionBruta
            });
            $scope.showTableTrabajadores = true;
        }, function(error) {
            console.log(error);
            $scope.animationsEnabled = true;
            var message = error.statusText;
            $scope.messageModal(message);
        });

    }

    // se llaman las funciones de inicialización dinámicas
    $scope.init();
    //-------------- FIN LLAMADA DE SERVICIOS ----------------------


    // PAGINACION DE LA TABLA 
   /* $scope.currentPage = 0;
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
    };*/

    // FIN DE PAGINACION DE TABLA
    // ------------------------- TAB 1 ---------------------------

    $scope.showModal = function(param) {
        var _puerto = "valparaiso";
        var _coordenadas = param;

        console.log(_coordenadas);

        $scope.modal = $uibModal.open({
            templateUrl: 'nombradas/ingreso_individual/googleMaps.html',
            controller: 'ModalShowMap',
            resolve: {
                store: function() {
                    return {
                        "coordenadas": _coordenadas,
                        "puerto": _puerto
                    };
                }
            }
        });

        $scope.modal.result.then(function(result) {
            //  Set the resulting coordenated to the parent page
            $scope.coordenadas = result;
        });

    };

    $scope.getTableDatosTrabajadoresModel = function() {
        return $scope.tableDatosTrabajadores;
    };

    $scope.agregarTrabajador = function(rutTrabajador, documentoIdentificador) {

        var encontro = false;
        angular.forEach($scope.tableDatosTrabajadores, function(item, index) {

            if (item.rutPasaporteTrabajador == rutTrabajador) {
                encontro = true;
            }
        });

        if (encontro == true) {
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
        }

        //$scope.configPages();
    }

    $scope.eliminarTrabajador = function(id) {
        var itemEliminar = id - 1;
        var itemMover = id++;
        $scope.tableDatosTrabajadores.splice(itemEliminar, 1);
        //$scope.configPages();
    };

    $scope.gettrabajadoresIncluidosNombrada = function() {
        return $scope.trabajadoresIncluidosNombrada;
    }

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

    //--- inicio de Datos de duro
    $scope.puertoUnico = 'Valparaiso'

    $scope.trabajadoresIncluidosNombrada = [{
        rutPasaporteTrabajador: '12345678',
        nombresTrabajador: 'Maria Zenair',
        apellidosTrabajador: 'Yepez Ruiz',
        turnoTrabajador: 'Turno 2',
        fechaInicioJornadaTrabajador: '10/11/2017 13:00',
        fechaTerminoJornadaTrabajador: '10/11/2017 13:00',
        naveTrabajador: 'Ocean Dream',
        sitioTrabajador: '1',
        LugarTrabajador: 'Sin lugar',
        EstadoTrabajador: 'APROBADO'
    }];

    //--- fin de Datos de duro

    // ------------------------- TAB 2 ---------------------------


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
        // Funcion que valida los datos y posiciona en la siguien tab

    $scope.changeTabByButton = function(tab) {

        if ($scope.date.value < date_now) {
            $scope.messageValidateDate = true;
            $scope.messageValidateDate = "La fecha de inicio de nombrada no puede ser menor a la actual.";
            $scope.mostrarmensaje = true;
        } else {
            if ($scope.date.value == "" || $scope.date.value == undefined) {
                $scope.messageValidate = true;
            } else {
                $scope.messageValidate = false;
            }

            if (vm.TurnSelected == "" || vm.TurnSelected == undefined) {
                $scope.ValidateTurno = true;
            } else {
                $scope.ValidateTurno = false;
            }

            if (vm.NaveSelected == "" || vm.NaveSelected == undefined) {
                $scope.ValidateNave = true;
            } else {
                $scope.ValidateNave = false;
            }

            if (vm.LugarSelected == "" || vm.LugarSelected == undefined) {
                $scope.ValidateLugar = true;
            } else {
                $scope.ValidateLugar = false;
            }

            if ($scope.messageValidate || $scope.ValidateTurno || ($scope.ValidateNave && $scope.ValidateLugar)) {

                $scope.animationsEnabled = true;
                var message = "Debe completar todos los campos obligatorios";
                $scope.messageModal(message);

            } else {

                $scope.ValidateLugar = false;
                $scope.ValidateNave = false;

                // muestra el mensaje de resolucion
                var camposVacios = false;
                if (!$scope.showTableTrabajadores) {
                    var message = "Debe agregar los trabajadores";
                    $scope.messageModal(message);
                } else {
                    angular.forEach($scope.tableDatosTrabajadores, function(item, index) {

                        var indextab = item.id - 1;

                        if ($scope.tableDatosTrabajadores[index].laborSelect[index] == "" || $scope.tableDatosTrabajadores[index].laborSelect[index] == undefined || $scope.tableDatosTrabajadores[index].funcionSelect[index] == "" || $scope.tableDatosTrabajadores[index].funcionSelect[index] == undefined || $scope.tableDatosTrabajadores[index].jornadaSelect[index] == "" || $scope.tableDatosTrabajadores[index].jornadaSelect[index] == undefined) {
                            camposVacios = true;
                        } else {
                            $scope.tableDatosTrabajadores[index]["idLabor"] = $scope.tableDatosTrabajadores[index].laborSelect[index];
                            $scope.tableDatosTrabajadores[index]["idFuncion"] = $scope.tableDatosTrabajadores[index].funcionSelect[index];
                            $scope.tableDatosTrabajadores[index]["idJornada"] = $scope.tableDatosTrabajadores[index].jornadaSelect[index];
                        }

                    });

                    if (camposVacios) {

                        var message = "Debe completar los campos de la tabla";
                        $scope.messageModal(message);

                    } else {

                        $scope.datosNombrada.push({
                            id: 0,
                            fechaInicioNombrada: $scope.date.value,
                            idTurnos: vm.TurnSelected,
                            idEmpresa: 1, //dato de prueba,
                            idNave: vm.NaveSelected,
                            idLocacion: vm.LocationSelected,
                            posicion: $scope.puertoUnico,
                            fechaCreacion: date_now,
                            activo: 1,
                            idEstado: 1,
                            trabajadores: $scope.tableDatosTrabajadores
                        })

                        console.log($scope.datosNombrada);
                        $scope.guardarNombrada($scope.datosNombrada);

                    }
                }


            }
        }
    };
    $scope.guardarNombrada = function(data) {

        RestClientNombrada.guardarNombradas(data, function(data) {
                if (!tab || tab < 1 || tab > 2)
                    return;

                $scope.tabs[tab].disable = false;
                $scope.tabs[0].disable = true;
                $scope.tabsActive = tab;

                var message = "Se ha ingresado la nombrada";
                $scope.messageModal(message);
                console.log(data);

            },
            function(error) {
                var message = error.statusText;
                $scope.messageModal(message);
            });
    };

}])

.controller('ModalShowMap', ['$scope', 'NgMap', '$uibModalInstance', 'store',
    function($scope, NgMap, $uibModalInstance, store) {

        console.log("entre");
        var address = store.puerto; //  Puert to seek in google
        console.log(store.coordenadas);
        var result = store.coordenadas.split(",");
        latitude = result[0].replace(/['"]+/g, ''); //  Port Latitude
        longitude = result[1].replace(/['"]+/g, ''); //  Port Longitude

        var geocoder = new google.maps.Geocoder(); //  Google function to decode an address
        var evento = null;
        var mapa = null;

        //  Seek in google the new lat, long values

        $scope.center = [latitude, longitude];
        $scope.position = [latitude, longitude];
        $scope.coordenadas = latitude + "," + longitude;
        $scope.infoMarkerLabel = "Latitud: " + latitude + " | Longitud: " + longitude;


        //  At last, resize the map, to avoid problems at second rendering
        NgMap.getMap().then(function(map) {

            //  Resize the map
            google.maps.event.trigger(map, "resize");
            //  Center again
            map.setCenter(new google.maps.LatLng(latitude, longitude));
            //  Show the Info Window on the marker with the lat and long
            map.showInfoWindow('info', 'latitudLongitudMarker');

        });

        /**
         * Close the modal popup
         * @returns {undefined}C
         */
        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };

        /**
         * Accept the new values and show them in the Lugar field
         * @returns {undefined}
         */
        $scope.ok = function() {
            $uibModalInstance.close(latitude + "," + longitude);
        };
    }
])

/*.filter('startFromGrid', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }

})*/

.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', '$rootScope', 
    function($scope, $uibModalInstance, $rootScope) {

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}])