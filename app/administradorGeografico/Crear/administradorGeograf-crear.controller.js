'use strict';

// definición de módulo administrador Geografico
var module = angular.module('sccnlp.administradorGeograf-crear');


module.controller('AdministradorGeografCrearCtrl', ['$scope', 'sessionService', '$state', 'administradorGeografCrearMessages', '$uibModal',
    function ($scope, sessionService, $state, administradorGeografMessages, $uibModal) {
        $scope.messages = administradorGeografMessages; // conexión del servicio messages
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
        $scope.tablaLocacion = [];              //  Data of table

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
        };

        /**
         * Remove a Item from the table tablaLocacion
         * @param {type} index of the element to be deleted
         * @returns {undefined}
         */
        $scope.removeLocation = function (index) {
            $scope.tablaLocacion.splice(index, 1);
        };

        /**
         * Save the information
         * @returns {undefined}
         */
        $scope.save = function () {
            alert("Guardado pendiente");

            var modalInstance = $uibModal.open({
                animation: true,
                component: 'modalComponent',
                resolve: {
                    store: function () {
                        return $scope;
                    }
                }
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
            //:TODO Replace the element = [] for the backend function to retreive info
            var element = ['Aeropuerto arturo merino benitez', 'alvarez de toledo 880, san miguel'];
            for (var item in element) {
                $scope.puerto.nombre.push(element[item]);
            }
        };

        /**
         * Function to fill the RUT EMPRESA field
         * @returns {undefined}
         */
        var getRutEmpresa = function () {
            //:TODO Replace the rut for the backend function to retreive info
            $scope.rutEmpresaData = "8.356.666-K";
        };

        /**
         * Function to fill the NOMBRE EMPRESA field
         * @returns {undefined}
         */
        var getNombreEmpresa = function () {
            //:TODO Replace the nombre for the backend function to retreive info
            $scope.nombreEmpresaData = "nueva empresa";
        };

        /**
         * Function to fill the CASA MATRIZ field
         * @returns {undefined}
         */
        var getCasaMatriz = function () {
            //:TODO Replace the direccion for the backend function to retreive info
            $scope.direccionCasaMatrizData = "Alameda XYZ";
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
module.component('modalComponent', {
    templateUrl: 'myModalContent.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function () {
        var $ctrl = this;
        $ctrl.message = {CONFIRM_SAVE: "Se ha guardado de forma correcta la informacion indicada de locaciones",
            ACEPTAR_BTN: "Aceptar"};

        $ctrl.ok = function () {
            $ctrl.close();
        };

    }
});