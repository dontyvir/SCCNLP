'use strict';

// definición de módulo menu
angular.module('sccnlp.nombradas')

.controller('NombradasIndividualCtrl', ['$scope', '$state', 'nombradasMessages', '$uibModal', '$rootScope', 'RestClient', 'sessionService', 'RestClientNombrada', 'RestClientRelacionLaboral', 'validateRut', function($scope, $state, nombradasMessages, $uibModal, $rootScope, RestClient, sessionService, RestClientNombrada, RestClientRelacionLaboral, validateRut) {

    //--------------------------- Controller for NombradanIndividualTab.html ------------------------------------
    $scope.messages = nombradasMessages;
    $scope.messagevalidateRut = false;
    $scope.mostrarmensaje = false;
    $scope.tableDatosTrabajadores = [];
    $scope.validadoRut = false;
    var session_data = sessionService.getUserData();
    console.log(session_data)
    $scope.nombradasLoading = true;
    $scope.resolucionNombradas = [];

    $scope.naves = null;
    $scope.tipoContrato = null;
    $scope.labores = null;
    $scope.lugares = null;
    $scope.funciones = null;
    $scope.jornadas = null;
    $scope.tiposTurno = null;

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

    $scope.fechaTurno = {
        fecha: null,
        TurnSelected: null
    }

    $scope.trabajo = {
        puerto: null,
        NaveSelected: null,
        LocationSelected: null,
        posicion: null
    }

    $scope.trabajador = {
        rutTrabajador: null
    }


    //---------------- inicio de fecha --------------------

    $scope.date = {
        value: new Date()
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.formats = ['dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.formatPlaceholder = 'dd/mm/aaaa'

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
        $scope.tipoContrato = RestClientRelacionLaboral.getTipoContrato();
        $scope.labores = RestClientRelacionLaboral.getLabor();
        $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa);
        $scope.funciones = RestClientRelacionLaboral.getFuncion();
        $scope.jornadas = RestClientRelacionLaboral.getTipoJornada();
        $scope.tiposTurno = RestClientRelacionLaboral.getTurno();

        if ($scope.naves != null &&
            $scope.tipoContrato != null &&
            $scope.labores != null &&
            $scope.lugares != null &&
            $scope.funciones != null &&
            $scope.jornadas != null &&
            $scope.tiposTurno != null) {

            $scope.nombradasLoading = false;
        }
    };

    $scope.loadTrabajador = function(rut, documentoIdentificador) {

        var idEmpresa = session_data.idEmpresa;
        $scope.validadoRut = true;

        if (documentoIdentificador == 'rut') {
            var rutTrabajador = rut.split("-")[0];
            //var dvTrabajador = rut.split("-")[1];
            var pasaporte = null;
        } else {
            var rutTrabajador = null;
            //var dvTrabajador = "";
            var pasaporte = rut;
        }

        RestClientNombrada.getDatosTrabajador(idEmpresa, rutTrabajador, pasaporte, function(data) {
            if (data.activo) {
                var activo = 1;
            } else {
                var activo = 0;
            }
            $scope.tableDatosTrabajadores.push({
                idTrabajador: $scope.tableDatosTrabajadores.length + 1,
                id: 0,
                idNombrada: 0, 
                activo: activo,
                idContrato: data.idContrato,
                idEstado: data.idEstado,
                fechaCreacion: "2017-01-10T00:00:00", 
                rutTrabajador: data.rut,
                pasaporte: data.pasaporte,
                dv: data.dv,
                nombresTrabajador: data.nombres,
                apellidosTrabajador: data.apellidoPaterno + " " + data.apellidoMaterno,
                tipoContratoTrabajador: data.nombreTipoContrato,
                totalHorasSemanales: data.totalHorasSemanales,
                remuneracionBrutaTrabajador: data.remuneracionBruta
            });
            $scope.showTableTrabajadores = true;
            $scope.validadoRut = false;
            $scope.trabajador.rutTrabajador = null;
        }, function(error) {
            console.log(error);
            /*$scope.animationsEnabled = true;
            var message = error.statusText;
            $scope.messageModal(message);*/
            alert("Problemas en la conexión, intente mas tarde");
            $scope.validadoRut = false;
        });

    }

    // se llaman las funciones de inicialización dinámicas
    $scope.init();
    //-------------- FIN LLAMADA DE SERVICIOS ----------------------
    // ------------------------- GOOGLE MAPS ---------------------------

    $scope.showModal = function(param) {
        var _puerto = "San isidro 292";
        var _coordenadas = param;

        console.log(_coordenadas);

        $scope.modal = $uibModal.open({
            templateUrl: 'nombradas/ingreso_individual/googleMaps.html',
            controller: 'ModalShowMapNombradas',
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
    $scope.getLocation = function(puerto) {

        puerto = "San isidro 292"; // en duro
        var geocoder = new google.maps.Geocoder(); //  Google function to decode an address
        if (geocoder) {
            geocoder.geocode({
                'address': puerto
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();;

                    if (latitude !== null && longitude !== null) {
                        $scope.center = [latitude, longitude];
                        $scope.position = [latitude, longitude];
                        $scope.infoMarkerLabel = "Latitud: " + latitude + " | Longitud: " + longitude;
                    }
                }
            });
        }
        $scope.trabajo.posicion = "-33.3935486,-70.79356710000002"; // en duro
        $scope.viewPosicion = true;
    };

    // -------------------------FIN GOOGLE MAPS ---------------------------

    $scope.getTableDatosTrabajadoresModel = function() {
        return $scope.tableDatosTrabajadores;
    };

    $scope.agregarTrabajador = function(rutTrabajador, documentoIdentificador) {

        if (!rutTrabajador)
            return

        var encontro = false;
        $scope.validadoRut = true;
        angular.forEach($scope.tableDatosTrabajadores, function(item, index) {

            if (item.rutPasaporteTrabajador == rutTrabajador) {
                encontro = true;
            }
        });

        if (encontro == true) {
            /*$scope.animationsEnabled = true;
            var message = "Se encontro un rut o pasaporte existente, por favor ingrese un nuevo rut";
            $scope.messageModal(message);*/
            alert("Se encontro un rut o pasaporte existente, por favor ingrese un nuevo rut");
            $scope.validadoRut = false;
        } else {

            $scope.loadTrabajador(rutTrabajador, documentoIdentificador);
            $scope.rutTrabajador = "";
            $scope.verTablaTrabajador = false;
            $scope.messagevalidateRut = false;
        }

        //$scope.configPages();
    }

    $scope.eliminarTrabajador = function(id) {
        var itemEliminar = id - 1;
        var itemMover = id++;
        $scope.tableDatosTrabajadores.splice(itemEliminar, 1);
        //$scope.configPages();
    };

    $scope.validateRut = function(documentoIdentificador) {
        var response = validateRut.validate(documentoIdentificador);
        if (response) {
            $scope.messagerut = ""

            $scope.messagevalidateRut = false;

        } else {
            $scope.messagerut = "El Rut no es válido :'( "
            $scope.messagevalidateRut = true;

        }
    }

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

        $scope.datosNombrada = [];

        $scope.blockButtons = true;
        if ($scope.fechaTurno.fecha < date_now) {
            $scope.messageValidateDate = true;
            $scope.messageValidateDate = "La fecha de inicio de nombrada no puede ser menor a la actual.";
            $scope.mostrarmensaje = true;
            $scope.blockButtons = false;
        } else {

            if ($scope.trabajo.NaveSelected == null && $scope.trabajo.LocationSelected == null) {
                $scope.blockButtons = false;
                return false;

            } else {

                var camposVacios = false;
                if (!$scope.showTableTrabajadores) {
                    alert("Debe agregar los trabajadores");
                    $scope.blockButtons = false;
                } else {
                    angular.forEach($scope.tableDatosTrabajadores, function(item, index) {

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
                        $scope.blockButtons = false;

                    } else {

                        $scope.datosNombrada.push({
                            id: 0,
                            fechaInicioNombrada: $scope.fechaTurno.fecha,
                            idTurnos: $scope.fechaTurno.TurnSelected,
                            idEmpresa: parseInt(session_data.idEmpresa),
                            idNave: $scope.trabajo.NaveSelected,
                            idLocacion: $scope.trabajo.LocationSelected,
                            posicion: $scope.trabajo.posicion,
                            fechaCreacion: date_now,
                            activo: "true",
                            trabajadores: $scope.tableDatosTrabajadores
                        })

                        $scope.guardarNombrada($scope.datosNombrada, tab);

                    }
                }
            }
        }
    };
    $scope.guardarNombrada = function(data, tab) {

        RestClientNombrada.guardarNombradas(data, function(response) {

                $scope.blockButtons = false;

                if (response[0].error == "") {

                    $scope.resolucionNombradas = response[0].data;

                    if (!tab || tab < 1 || tab > 2)
                        return;
                    $scope.tabs[tab].disable = false;
                    $scope.tabs[0].disable = true;
                    $scope.tabsActive = tab;
                }else{
                    alert(response[0].error)
                }

            },
            function(error) {
                var message = "no responde";
                $scope.messageModal(message);
                $scope.blockButtons = false;
            });
    };

}])

.controller('ModalShowMapNombradas', ['$scope', 'NgMap', '$uibModalInstance', 'store',
    function($scope, NgMap, $uibModalInstance, store) {

        var address = store.puerto; //  Puert to seek in google
        var result = store.coordenadas.split(",");
        var latitude = result[0].replace(/['"]+/g, ''); //  Port Latitude
        var longitude = result[1].replace(/['"]+/g, ''); //  Port Longitude

        var geocoder = new google.maps.Geocoder(); //  Google function to decode an address
        var evento = null;
        var mapa = null;

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

        $scope.ok = function() {
            $uibModalInstance.close(latitude + "," + longitude);
        };
    }
])

.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', '$rootScope',
    function($scope, $uibModalInstance, $rootScope) {

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
])