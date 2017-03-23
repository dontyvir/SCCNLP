'use strict';

// definición de módulo administrador Geografico
var module = angular.module('sccnlp.administradorGeograf-consultar');


module.controller('AdministradorGeografConsultarCtrl', ['$scope', 'sessionService', '$state', 'administradorGeografConsultarMessages', '$uibModal',
    function ($scope, sessionService, $state, administradorGeografMessages, $uibModal) {
        $scope.mensajeriaConsulta = administradorGeografMessages; // conexión del servicio messages
        $scope.rutEmpresaConsultaData = '';             //  Data rut empresa
        $scope.nombreEmpresaConsultaData = "";          //  Data nombre empresa
        $scope.direccionCasaMatrizConsultaData = "";    //  Data direccion casa matriz
        $scope.lugarConsultaData = {
            nombre: [],
            seleccionado: ''
        };                  //  Data lugar
        $scope.coordenadasConsultaData = "";            //  Data Coordenadas
        $scope.tablaLocacionConsulta = [];              //  Result table
        $scope.puertoConsulta = {//  Data puerto
            nombre: [],
            seleccionado: ''
        };


        var modalWindow = function (p_type, p_value) {
            return $uibModal.open({
                templateUrl: 'messageComponentConsulta.html',
                controller: 'alertMessage',
                size: 'md',
                animation: true,
                resolve: {message: function () {
                        return $scope.mensajeriaConsulta;
                    }, type: function () {
                        return p_type;
                    }, value: function () {
                        return p_value;
                    }
                }
            });
        };


        /**
         * Function to get the values of available places from backend
         * @returns {Array}
         */
        var getLugaresFromBackend = function () {
            //  TODO: get all elements based on the port
            var elemento = [{puerto: 'Aeropuerto arturo merino benitez',
                    lugares: ["anden 1", "anden 2"]},
                {puerto: 'alvarez de toledo 880, san miguel',
                    lugares: ["anden 32", "anden 33"]}];
            return elemento;
        };

        /**
         * Function to get all lugar field form to query
         * @returns {undefined}
         */
        var getLugarConsulta = function () {
            var element = getLugaresFromBackend();
            var lugar = [];

            for (var item in element) {
                for (var item2 in element[item].lugares) {
                    lugar.push(element[item].lugares[item2]);
                }
            }

            for (var item in lugar) {
                $scope.lugarConsultaData.nombre.push(lugar[item]);
            }
        };

        /**
         * Update the place based on the puerto
         * @returns {undefined}
         */
        $scope.updateLugar = function () {
            var elemento = getLugaresFromBackend();
            $scope.lugarConsultaData.nombre = [];

            for (var item in elemento) {
                if ($scope.puertoConsulta.seleccionado === elemento[item].puerto) {
                    for (var item2 in elemento[item].lugares) {
                        $scope.lugarConsultaData.nombre.push(elemento[item].lugares[item2]);
                    }
                }
            }
        };


        var getPortsFromBackend = function () {
            // :TODO replace the hardcode for the service
            var elemento = ['Aeropuerto arturo merino benitez', 'alvarez de toledo 880, san miguel'];
            return elemento;
        };

        /**
         * Function to get the ports of field Ports
         * @returns {undefined}
         */
        var getPorts = function () {
            var element = getPortsFromBackend();

            if (element === null || element.length === 0) {
                var modalInstance = modalWindow('warning', 'MESSAGE_CON_DIRECTMAR');
            }

            for (var item in element) {
                $scope.puertoConsulta.nombre.push(element[item]);
            }
        };

        /**
         * Function to fill the RUT EMPRESA field
         * @returns {undefined}
         */
        var getRutEmpresa = function () {
            //:TODO Replace the rut for the backend function to retreive info
            $scope.rutEmpresaConsultaData = "8.356.666-K";
        };

        /**
         * Function to fill the NOMBRE EMPRESA field
         * @returns {undefined}
         */
        var getNombreEmpresa = function () {
            //:TODO Replace the nombre for the backend function to retreive info
            $scope.nombreEmpresaConsultaData = "nueva empresa";
        };

        /**
         * Function to fill the CASA MATRIZ field
         * @returns {undefined}
         */
        var getCasaMatriz = function () {
            //:TODO Replace the direccion for the backend function to retreive info
            $scope.direccionCasaMatrizConsultaData = "Alameda XYZ";
        };

        /**
         * Function to initialize the fields
         * @returns {undefined}
         */
        $scope.initiate = function () {
            getPorts();
            getRutEmpresa();
            getNombreEmpresa();
            getCasaMatriz();
            getLugarConsulta();
        };

        var getSearchElements = function () {
            //:TODO Search for the real values
            var elemento = [{rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"},
                {rutEmpresa: "15.656.115-k", nombreEmpresa: "everis S.A", direccionCasaMatriz: "alameda 1449, santiago", puerto: "alvarez de toledo 880, san miguel", lugar: "Piso 3", posicion: "33.44,12.22"}];
            return elemento;
        };

        /**
         * Function to search the information
         * @returns {undefined}
         */
        $scope.search = function () {
            //  Delete current information in table
            $scope.tablaLocacionConsulta = [];

            //  Call the function to get the elements
            var element = getSearchElements();
            //  Put the elements in the table

            for (var item in element) {
                $scope.tablaLocacionConsulta.push(element[item]);
            }


            //  Validate if the information retrieved have information 
            if ($scope.tablaLocacionConsulta.length === 0) {
                //  Show modal panel with the a message
                var modalInstanceConsulta = $uibModal.open({
                    animation: true,
                    component: 'messageComponentConsulta',
                    resolve: {
                        store: function () {
                            return $scope;
                        }
                    }
                });
            }
        };

        /**
         * Function to show a modal popup when the user want to edit the information
         * @param {type} index
         * @returns {undefined}
         */
        $scope.update = function (index) {
            $scope.modalConsulta = $uibModal.open({
                templateUrl: 'administradorGeografico/Consultar/updateInfo.html',
                controller: 'ModalShowMapConsulta',
                size: 'lg',
                resolve: {
                    store: function () {
                        return {
                            "RUT_EMPRESA": $scope.tablaLocacionConsulta[index].rutEmpresa,
                            "NOMBRE_EMPRESA": $scope.tablaLocacionConsulta[index].nombreEmpresa,
                            "CASA_MATRIZ": $scope.tablaLocacionConsulta[index].direccionCasaMatriz,
                            "PUERTO": $scope.puertoConsulta,
                            "PUERTO_SELECCIONADO": $scope.tablaLocacionConsulta[index].puerto,
                            "LUGAR": $scope.tablaLocacionConsulta[index].lugar,
                            "COORDENADAS": $scope.tablaLocacionConsulta[index].posicion,
                            "TABLA_LOCACION": $scope.tablaLocacionConsulta,
                            "mensajes": $scope.mensajeriaConsulta};
                    }
                }
            });

            $scope.modalConsulta.result.then(function (result) {
                //  Set the resulting coordenated to the parent page
                $scope.tablaLocacionConsulta[index].puerto = result[0].puertoSeleccionadoModal;
                $scope.tablaLocacionConsulta[index].lugar = result[0].lugarModal;
                $scope.tablaLocacionConsulta[index].posicion = result[0].coordenadasModal;
            });

        };

        /**
         * Remove a Item from the table tablaLocacion
         * @param {type} index of the element to be deleted
         * @returns {undefined}
         */
        $scope.delete = function (index) {

            var modalInstance = modalWindow('confirm', 'MESSAGE_CONFIRM_DELETE');

            modalInstance.result.then(function () {
                $scope.tablaLocacionConsulta.splice(index, 1);
            });

        };



        /**
         * Function to get the Excel file
         * @returns {undefined}
         */
        $scope.getExcel = function () {

            var mystyle = {sheetid: 'Consultar Locaciones',
                headers: true,
                style: 'font-size:12px;font-weight:bold;background:white',

                caption: {
                    title: 'Consultar Locaciones'
                },

                columns: [
                    {columnid: 'rutEmpresa', title: $scope.mensajeriaConsulta.RUT_EMPRESA, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold'},
                    {columnid: 'nombreEmpresa', title: $scope.mensajeriaConsulta.NOMBRE_EMPRESA, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 250},
                    {columnid: 'direccionCasaMatriz', title: $scope.mensajeriaConsulta.DIRECCION_CASA_MATRIZ, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold;', width: 300},
                    {columnid: 'puerto', title: $scope.mensajeriaConsulta.PUERTO, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 300},
                    {columnid: 'lugar', title: $scope.mensajeriaConsulta.LUGAR, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 100},
                    {columnid: 'posicion', title: $scope.mensajeriaConsulta.POSICION, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 300}

                ],

                row: {
                    style: function (sheet, row, rowidx) {
                        return 'background:' + (rowidx % 2 ? '#F1F1F1' : 'white') + ';text-align:center;border-style:groove;vertical-align:middle';
                    }
                }

//       , cells: {//if you want to put style in particular cell 
//                                                  1:{
//                                                        5:{
//                                                          style: 'font-size:20px;background:#115ea2 ;color:white;font-weight:bold;text-align:right',
//                                                          value: function(value){return value;}
//                                                        }
//
//                                                      }
//                                                    }
            };


            alasql('SELECT * INTO XLS("Reporte Consulta Locaciones - ' + new Date() + '.xls",?) FROM ?', [mystyle, $scope.tablaLocacionConsulta]);

        };

        /**
         * Function to check if the get Excel function ( Button Exportar a Excel)
         * Should be available or not
         * @returns {Boolean}
         */
        $scope.tableLength = function () {
            if ($scope.tablaLocacionConsulta.length > 0)
                return true;
            else
                return false;
        };
    }]);



/**
 * Modal view to show to user the result of saving
 */
module.component('messageComponentConsulta', {
    templateUrl: 'messageComponentConsulta.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function () {
        var $ctrl = this;
        $ctrl.message = {CONFIRM_SAVE: "No existen resultados con los criterios de búsqueda ingresados",
            ACEPTAR_BTN: "Aceptar"};

        $ctrl.ok = function () {
            $ctrl.close();
        };

    }
});


module.controller('ModalShowMapConsulta', ['$scope', 'NgMap', '$uibModalInstance', '$uibModal', 'store',
    function ($scope, NgMap, $uibModalInstance, $uibModal, store) {
        $scope.messagesModal = store.mensajes;  // conexión del servicio messages para Modal
        $scope.tablaLocacionModal = [];         //table with the selected element

        var elementoAuxiliar = {rutEmpresaModal: store.RUT_EMPRESA, nombreEmpresaModal: store.NOMBRE_EMPRESA, direccionCasaMatrizModal: store.CASA_MATRIZ, puertoModal: store.PUERTO, puertoSeleccionadoModal: store.PUERTO_SELECCIONADO, lugarModal: store.LUGAR, coordenadasModal: store.COORDENADAS};
        $scope.tablaLocacionModal.push(elementoAuxiliar);

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
            $uibModalInstance.close($scope.tablaLocacionModal);
        };

        /**
         * Function to show a modal popup when the user want to show the map
         * @returns {undefined}
         */
        $scope.showModalGmaps = function () {
            $scope.modalGMaps = $uibModal.open({
                templateUrl: 'administradorGeografico/Consultar/googleMapsConsultar.html',
                controller: 'editMapPosition',
                resolve: {
                    store: function () {
                        return {
                            "coordenadas": store.COORDENADAS,
                            "puerto": store.PUERTO_SELECCIONADO,
                            "mensajes": $scope.messagesModal};
                    }
                }
            });

            if ($scope.modalGMaps === null || $scope.modalGMaps === '') {
                var modalInstance = modalWindow('warning', 'MESSAGE_CON_GMAPS');
            }

            $scope.modalGMaps.result.then(function (result) {

                if (result === '' || result === null) {
                    var modalInstance = modalWindow('warning', 'MESSAGE_CON_GMAPS');
                } else {
                    //  Set the resulting coordenated to the parent page
                    $scope.tablaLocacionModal[0].coordenadasModal = result;
                }
            });

        };

        /**
         * Function to validate if the ports are retreived from directmar
         * @returns {undefined}
         */
        $scope.validatePorts = function () {
            if (store.PUERTO.nombre.length === 0) {
                var modalInstance = modalWindow('warning', 'MESSAGE_CON_DIRECTMAR');
            }
        };

    }]);




/**
 * Controller created to manage the google maps popup
 * 
 */
module.controller('editMapPosition', ['$scope', 'NgMap', '$uibModalInstance', 'store',
    function ($scope, NgMap, $uibModalInstance, store) {
        $scope.messagesModalConsulta = store.mensajes;  // conexión del servicio messages para Modal    
        var result = store.coordenadas.split(",");
        var latitud = result[0].replace(/['"]+/g, '');
        var longitud = result[1].replace(/['"]+/g, '');

        var evento = null;
        var mapa = null;

        /**
         * First need to center the map with the current latitude and longitude
         * @returns {undefined}
         */

        $scope.centerModal = [latitud, longitud];
        $scope.positionModal = [latitud, longitud];
        $scope.labelMarker = "Latitud: " + latitud + "| Longitud: " + longitud;

        //  At last, resize the map, to avoid problems at second rendering
        NgMap.getMap().then(function (map) {

            //  Resize the map
            google.maps.event.trigger(map, "resize");
            //  Center again
            map.setCenter(new google.maps.LatLng(latitud, longitud));
            //  Show the Info Window on the marker with the lat and long
            map.showInfoWindow('infoModal', 'latitudLongitudMarkerModal');

            //  Add a listener when the maps is created to listen the click event
            google.maps.event.addListener(map, 'click', function (event) {
                evento = event;
                mapa = map;
            });

        });

        /**
         * Update the marker when the user whants to change the current marker
         * @param {type} event
         * @returns {undefined}
         */
        $scope.updateMarkerUpdate = function (event) {
            try {
                //  Change the marker position
                if (event !== null || event !== '' || typeof event !== undefined) {
                    $scope.positionModal = [evento.latLng.lat(), evento.latLng.lng()];
                    // Center the visualizaiton
                    mapa.setCenter(evento.latLng);
                    //  Change the values returned to the main page ( lugar field)
                    latitud = evento.latLng.lat();
                    longitud = evento.latLng.lng();
                    $scope.labelMarker = "Latitud: " + evento.latLng.lat() + "| Longitud: " + evento.latLng.lng();
                }
            } catch (e) {
                console.log("Dragged");
            }
        };


        /**
         * Close the modal popup
         * @returns {undefined}C
         */
        $scope.cancelModal = function () {
            $uibModalInstance.dismiss();
        };

        /**
         * Accept the new values and show them in the Lugar field
         * @returns {undefined}
         */
        $scope.okModal = function () {
            $uibModalInstance.close(latitud + "," + longitud);
        };
    }]);


/**
 * Modal view to show to user the result of saving
 */
module.controller('alertMessage', function ($scope, $uibModalInstance, message, type, value) {

    $scope.type = type;
    $scope.alertMessages = message;
    if (value === 'MESSAGE_CONFIRM_DELETE') {
        $scope.customMessage = message.MESSAGE_CONFIRM_DELETE;
    }
    if (value === 'MESSAGE_CON_DIRECTMAR') {
        $scope.customMessage = message.MESSAGE_CON_DIRECTMAR;
    }
    if (value === 'MESSAGE_CON_GMAPS') {
        $scope.customMessage = message.MESSAGE_CON_GMAPS;
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});