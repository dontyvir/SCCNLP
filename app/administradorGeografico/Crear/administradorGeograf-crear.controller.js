'use strict';

// definición de módulo administrador Geografico
var module = angular.module('sccnlp.administradorGeograf-crear');


module.controller('AdministradorGeografCrearCtrl', ['$scope', 'sessionService', '$state', 'administradorGeografCrearMessages', '$uibModal', 'RestClient',
    function ($scope, sessionService, $state, administradorGeografMessages, $uibModal, RestClient) {
        $scope.messages = administradorGeografMessages; // conexión del servicio messages
        var session_data = sessionService.getUserData();
        $scope.rutEmpresaData = '';             //  Data rut empresa
        $scope.nombreEmpresaData = "";          //  Data nombre empresa
        $scope.direccionCasaMatrizData = "";    //  Data direccion casa matriz
        $scope.lugarData = "";                  //  Data Sitio
        $scope.coordenadas = "";                //  Data Coordenadas
        $scope.longitud = null;                 //  Data to store Longitude
        $scope.latitud = null;                  //  Data to store latitude
        $scope.puerto = {//  Data puerto
            nombre: [],
            seleccionado: ''
        };
        $scope.puertoConsulta = {//  Data puerto
            nombre: [],
            seleccionado: ''
        };
        $scope.tablaLocacion = [];              //  Data of table
        $scope.pageSize = 5;
        $scope.currentPage = 1;
        $scope.totalItems = $scope.tablaLocacion.length;
        /**@deprecated If the place field is entered by the user, this funciton will be available
         * Update the Map depending on the data entered in the lugar field
         * @returns {undefined}
         */
        $scope.updateLongitudLatitud = function () {
            if (/-?[0-9]+.?[0-9]+,{1}-?[0-9]+.?[0-9]+/.test($scope.coordenadas)) {
                var result = $scope.coordenadas.split(",");
                $scope.longitud = result[0];
                $scope.latitud = result[1];
            }
        };

        /**
         * Function to show a modal popup when the user want to show the map
         * @returns {undefined}
         */
        $scope.showModal = function (param, index) {
            var _puerto = null;
            var _coordenadas = null;
            if (param === 'search') {
                _puerto = $scope.puerto.seleccionado;
            } else if (param === 'table') {
                _coordenadas = $scope.tablaLocacion[index].posicion;
            }

            $scope.modal = $uibModal.open({
                templateUrl: 'administradorGeografico/Crear/googleMaps.html',
                controller: 'ModalShowMap',
                resolve: {
                    store: function () {
                        return {"coordenadas": _coordenadas,
                            "puerto": _puerto,
                            "mensajes": $scope.messages,
                            "from": param};
                    }
                }
            });

            $scope.modal.result.then(function (result) {
                //  Set the resulting coordenated to the parent page
                $scope.coordenadas = result;
            });

        };



        /**
         * Add a new item to the table tablaLocacion
         * @returns {undefined}
         */
        $scope.addNewLocation = function () {
            var element = {rutEmpresa: $scope.rutEmpresaData, nombreEmpresa: $scope.nombreEmpresaData, direccionCasaMatriz: $scope.direccionCasaMatrizData
                , puerto: $scope.puerto.seleccionado, lugar: $scope.lugarData, posicion: $scope.coordenadas};
            $scope.tablaLocacion.push(element);
            $scope.totalItems = $scope.tablaLocacion.length;
        };

        /**
         * Remove a Item from the table tablaLocacion
         * @param {type} index of the element to be deleted
         * @returns {undefined}
         */
        $scope.removeLocation = function (index) {
            $scope.tablaLocacion.splice(index, 1);
            $scope.totalItems = $scope.tablaLocacion.length;
        };

        /**
         * Save the information
         * @returns {undefined}
         */
        $scope.save = function () {
            var listaAGuardar = [];

            for (var item in $scope.tablaLocacion) {
                var elemento = {id: 0,
                    idEmpresa: session_data.idEmpresa,
                    idPuerto: getPuertoIdByNombre($scope.tablaLocacion[item].puerto),
                    nombrePuerto: $scope.tablaLocacion[item].puerto,
                    lugar: $scope.tablaLocacion[item].lugar,
                    posicion: $scope.tablaLocacion[item].posicion,
                    activo: true};
                listaAGuardar.push(elemento);
            }

            RestClient.guardarLocaciones(listaAGuardar,
                    function (data) {
                        var errores = "";
                        if (data[data.length - 1].idUsuario === 0) {                            
                            for (var item = 0; item < data.length; item++) {
                                if (data[item].idUsuario === 0 && item + 1 < data.length) {
                                    errores = errores + " " + data[item].error;
                                }
                            }
                        }
                        if (errores === "") {
                            console.log('Modificado registro');
                            var modalInstance = modalWindow('warning', 'CONFIRM_SAVE');
                        } else {
                            
                            var modalInstance = modalWindow('warning', "No se ha guardado debido a los siguientes errores: " + errores );
                        }

                    }, function (error) {
                console.log('error al modificar registro');
                var modalInstance = modalWindow('warning', 'MESSAGE_CON_DIRECTMAR');
            });

        };


        /**
         * Function to clear all the data entered by the user
         * @returns {undefined}
         */
        $scope.clear = function () {
            $scope.rutEmpresaData = "";
            $scope.nombreEmpresaData = "";
            $scope.direccionCasaMatrizData = "";
            $scope.lugarData = "";
            $scope.coordenadas = "";
            $scope.puerto.seleccionado = "";
            $scope.tablaLocacion = [];
            $scope.tablaLocacion = null;
        };

        /**
         * Function to get the ports of field Ports
         * @returns {undefined}
         */
        var getPorts = function () {

            var nuevo = RestClient.getPuertoPorIDEmpresa(session_data.idEmpresa, function (data) {
                for (var item = 0; item < data.length; item++) {
                    var elemento = {id: data[item].manT_PUERTO.id, codigo: data[item].manT_PUERTO.codigo, glosa: data[item].manT_PUERTO.glosa};
                    $scope.puertoConsulta.nombre.push(elemento);
                }

                for (var item in $scope.puertoConsulta.nombre) {
                    $scope.puerto.nombre.push($scope.puertoConsulta.nombre[item].glosa);
                }
                return $scope.puertoConsulta.nombre;
            }, function (data) {
                console.log("No se ha podido obtener los puertos");
                var modalInstance = modalWindow('warning', 'MESSAGE_CON_DIRECTMAR');
            });

        };

        var getPuertoIdByNombre = function (puertoNombre) {
            for (var item in $scope.puertoConsulta.nombre) {
                if ($scope.puertoConsulta.nombre[item].glosa === puertoNombre)
                    return $scope.puertoConsulta.nombre[item].id;
            }
            return null;
        };
        /**
         * Function to fill the RUT EMPRESA field
         * @returns {undefined}
         */
        var getRutEmpresa = function () {

            $scope.rutEmpresaData = session_data.rutEmpresa + '-' + session_data.dvEmpresa;
        };

        /**
         * Function to fill the NOMBRE EMPRESA field
         * @returns {undefined}
         */
        var getNombreEmpresa = function () {
            var nuevo = RestClient.getDatosEmpresa(session_data.rutEmpresa, session_data.dvEmpresa, function (data) {
                if (data.nombreEmpresa === null)
                    $scope.nombreEmpresaData = 'Empresa sin nombre';
                else
                    $scope.nombreEmpresaData = data.nombreEmpresa;
            }, function (error) {
                console.log("error al obtener Nombre Empresa");
            });

        };

        /**
         * Function to fill the CASA MATRIZ field
         * @returns {undefined}
         */
        var getCasaMatriz = function () {

            var nuevo = RestClient.getDatosEmpresa(session_data.rutEmpresa, session_data.dvEmpresa, function (data) {
                for (var item in data.direcciones) {
                    if (data.direcciones[item].esCasaMatriz === true) {
                        if (data.direcciones[item].direccion === null)
                            $scope.direccionCasaMatrizData = 'Empresa sin dirección';
                        else
                            $scope.direccionCasaMatrizData = data.direcciones[item].direccion;
                    }
                }
            }, function (error) {
                console.log("error al obtener direccion");
//                var modalInstance = modalWindow('warning', 'Error Al obtener los datos de la empresa, Campo Dirección');
            });
        };

        /**
         * Function created to load al the data at load
         * @returns {undefined}
         */
        $scope.init = function () {
            // Fill the ports combobox
            getPorts();
            getRutEmpresa();
            getNombreEmpresa();
            getCasaMatriz();
            // 
        };


        $scope.getLocation = function (puerto) {
            var geocoder = new google.maps.Geocoder();  //  Google function to decode an address
            if (geocoder) {
                geocoder.geocode({
                    'address': puerto
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();

                        if (latitude !== null && longitude !== null) {
//                        store.latitude = latitude;
//                        store.longitude = longitude;
                            //  Update the center of the map
                            $scope.center = [latitude, longitude];
                            //  Update the marker in the map
                            $scope.position = [latitude, longitude];
                            //  Update the variable to store the new lat and long values
//                            $scope.coordenadas = latitude + "," + longitude;
                            //  Update the markerLabel
                            $scope.infoMarkerLabel = "Latitud: " + latitude + " | Longitud: " + longitude;
                        }
                    }
                });
            }
        };

        var modalWindow = function (p_type, p_value) {
            return $uibModal.open({
                templateUrl: 'messageComponentConsulta2.html',
                controller: 'alertMessageCrear',
                size: 'md',
                animation: true,
                resolve: {message: function () {
                        return $scope.messages;
                    }, type: function () {
                        return p_type;
                    }, value: function () {
                        return p_value;
                    }
                }
            });
        };


    }]);



/**
 * Controller created to manage the google maps popup
 * 
 */
module.controller('ModalShowMap', ['$scope', 'NgMap', '$uibModalInstance', 'store',
    function ($scope, NgMap, $uibModalInstance, store) {


        $scope.messagesModal = store.mensajes;  // conexión del servicio messages para Modal
        $scope.view = store.from;       // Store the information if is from select map or see map
        var address = store.puerto;             //  Puert to seek in google
        var latitude = null;
        var longitude = null;
        if ($scope.view === 'table') {
            var result = store.coordenadas.split(",");
            latitude = result[0].replace(/['"]+/g, ''); //  Port Latitude
            longitude = result[1].replace(/['"]+/g, '');    //  Port Longitude
        }
        var geocoder = new google.maps.Geocoder();  //  Google function to decode an address
        var evento = null;
        var mapa = null;



//        /**
//         * First need to center the map with the current latitude and longitude
//         * @returns {undefined}
//         */
//        this.onInit = function () {
//            $scope.center = [latitude, longitude];
//            $scope.position = [latitude, longitude];
//            $scope.infoMarkerLabel = "Latitud: " + latitude + " | Longitud: " + longitude;
//        };

        //  Seek in google the new lat, long values
        if (geocoder && $scope.view === 'search') {
            geocoder.geocode({
                'address': address
//                , componentRestrictions: {
//                    country: 'CL'
//                }
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    latitude = results[0].geometry.location.lat();
                    longitude = results[0].geometry.location.lng();

                    if (latitude !== null && longitude !== null) {
//                        store.latitude = latitude;
//                        store.longitude = longitude;
                        //  Update the center of the map
                        $scope.center = [latitude, longitude];
                        //  Update the marker in the map
                        $scope.position = [latitude, longitude];
                        //  Update the variable to store the new lat and long values
                        $scope.coordenadas = latitude + "," + longitude;
                        //  Update the markerLabel
                        $scope.infoMarkerLabel = "Latitud: " + latitude + " | Longitud: " + longitude;
                    }
                }
            });
        } else if ($scope.view === 'table') {
            $scope.center = [latitude, longitude];
            $scope.position = [latitude, longitude];
            $scope.coordenadas = latitude + "," + longitude;
            $scope.infoMarkerLabel = "Latitud: " + latitude + " | Longitud: " + longitude;
        }

        //  At last, resize the map, to avoid problems at second rendering
        NgMap.getMap().then(function (map) {

            //  Resize the map
            google.maps.event.trigger(map, "resize");
            //  Center again
            map.setCenter(new google.maps.LatLng(latitude, longitude));
            //  Show the Info Window on the marker with the lat and long
            map.showInfoWindow('info', 'latitudLongitudMarker');

            if ($scope.view === 'search') {
                //  Add a listener when the maps is created to listen the click event
                google.maps.event.addListener(map, 'click', function (event) {
                    evento = event;
                    mapa = map;
                });
            }
        });

        /**
         * Update the marker when the user whants to change the current marker
         * @param {type} event
         * @returns {undefined}
         */
        $scope.updateMarker = function (event) {
            try {
                //  Change the marker position
                if (event !== null || event !== '' || typeof event !== undefined) {
                    $scope.position = [evento.latLng.lat(), evento.latLng.lng()];
                    // Center the visualizaiton
                    mapa.setCenter(evento.latLng);
                    //  Change the values returned to the main page ( lugar field)
                    latitude = evento.latLng.lat();
                    longitude = evento.latLng.lng();

                    $scope.infoMarkerLabel = "Latitud: " + latitude + " | Longitud: " + longitude;
                }
            } catch (e) {
                console.log("Dragged");
            }
        };


        /**
         * Close the modal popup
         * @returns {undefined}C
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        /**
         * Accept the new values and show them in the Lugar field
         * @returns {undefined}
         */
        $scope.ok = function () {
            $uibModalInstance.close(latitude + "," + longitude);
        };
    }]);


/**
 * Modal view to show to user the result of saving
 */
module.controller('alertMessageCrear', function ($scope, $uibModalInstance, message, type, value) {

    $scope.type = type;
    $scope.alertMessages = message;
    if (value === 'MESSAGE_CONFIRM_DELETE') {
        $scope.customMessage = message.MESSAGE_CONFIRM_DELETE;
    } else if (value === 'MESSAGE_CON_DIRECTMAR') {
        $scope.customMessage = message.MESSAGE_CON_DIRECTMAR;
    } else if (value === 'MESSAGE_CON_GMAPS') {
        $scope.customMessage = message.MESSAGE_CON_GMAPS;
    } else if (value === 'CONFIRM_SAVE') {
        $scope.customMessage = message.CONFIRM_SAVE;
    } else
        $scope.customMessage = value;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});
