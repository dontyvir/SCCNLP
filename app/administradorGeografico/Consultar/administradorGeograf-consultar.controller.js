'use strict';

// definición de módulo administrador Geografico
var module = angular.module('sccnlp.administradorGeograf-consultar');


module.controller('AdministradorGeografConsultarCtrl', ['$scope', 'sessionService', '$state', 'administradorGeografConsultarMessages', '$uibModal', 'RestClient',
    function ($scope, sessionService, $state, administradorGeografMessages, $uibModal, RestClient) {
        $scope.mensajeriaConsulta = administradorGeografMessages; // conexión del servicio messages
        var session_data = sessionService.getUserData();
        $scope.coordClass = '';
        $scope.rutEmpresaConsultaData = '';             //  Data rut empresa
        $scope.nombreEmpresaConsultaData = "";          //  Data nombre empresa
        $scope.direccionCasaMatrizConsultaData = "";    //  Data direccion casa matriz
        $scope.lugarConsultaData = "";
        $scope.coordenadasConsultaData = "";            //  Data Coordenadas
        $scope.tablaLocacionConsulta = [];              //  Result table
        $scope.puertoConsulta = {//  Data puerto
            nombre: [],
            seleccionado: ''
        };
        $scope.regex = "/-?[0-9]+.?[0-9]+,{1}-?[0-9]+.?[0-9]+";
        $scope.puertos = {//  Data puerto
            nombre: [],
            seleccionado: ''
        };
        $scope.pageSize = 5;
        $scope.currentPage = 1;
        $scope.totalItems = $scope.tablaLocacionConsulta.length;

        var modalWindow = function (p_type, p_value) {
            return $uibModal.open({
                templateUrl: 'messageComponentConsulta0.html',
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



        $scope.updateLongitudLatitudIsValid = function () {
            if ($scope.coordenadasConsultaData.length > 0) {
                if (/-?[0-9]+.?[0-9]+,{1}-?[0-9]+.?[0-9]+/.test($scope.coordenadasConsultaData)) {
                    var result = $scope.coordenadasConsultaData.split(",");
                    $scope.longitud = result[0];
                    $scope.latitud = result[1];
                    $scope.coordClass = '';

                } else
                    $scope.coordClass = true;
            } else
                $scope.coordClass = '';
        };


        var getPortsFromBackend = function () {
            var nuevo = RestClient.getPuertoPorIDEmpresa(session_data.idEmpresa, function (data) {
                for (var item = 0; item < data.length; item++) {
                    var elemento = {id: data[item].manT_PUERTO.id, codigo: data[item].manT_PUERTO.codigo, glosa: data[item].manT_PUERTO.glosa};
                    $scope.puertoConsulta.nombre.push(elemento);
                }
//                $scope.puertos.nombre.push("");
                for (var item in $scope.puertoConsulta.nombre) {
                    $scope.puertos.nombre.push($scope.puertoConsulta.nombre[item].glosa);
                }
                return $scope.puertoConsulta.nombre;
            }, function (data) {
                console.log("No se ha podido obtener los puertos");
                var modalInstance = modalWindow('warning', 'MESSAGE_CON_DIRECTMAR');
            });
        };

        /**
         * Function to get the ports of field Ports
         * @returns {undefined}
         */
        var getPorts = function () {
            var element = getPortsFromBackend();


        };

        /**
         * Function to fill the RUT EMPRESA field
         * @returns {undefined}
         */
        var getRutEmpresa = function () {

            $scope.rutEmpresaConsultaData = session_data.rutEmpresa + '-' + session_data.dvEmpresa;
        };

        /**
         * Function to fill the NOMBRE EMPRESA field
         * @returns {undefined}
         */
        var getNombreEmpresa = function () {


            var nuevo = RestClient.getDatosEmpresa(session_data.rutEmpresa, session_data.dvEmpresa, function (data) {
                if (data.nombreEmpresa === null)
                    $scope.nombreEmpresaConsultaData = 'Empresa sin nombre';
                else
                    $scope.nombreEmpresaConsultaData = data.nombreEmpresa;
            }, function (error) {
                console.log("error al obtener Nombre Empresa");
//                var modalInstance = modalWindow('warning', 'Error Al obtener los datos de la empresa, Campo Nombre');
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
                            $scope.direccionCasaMatrizConsultaData = 'Empresa sin dirección';
                        else
                            $scope.direccionCasaMatrizConsultaData = data.direcciones[item].direccion;
                    }
                }
            }, function (error) {
                console.log("error al obtener direccion");
//                var modalInstance = modalWindow('warning', 'Error Al obtener los datos de la empresa, Campo Dirección');
            });
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

        };

        var getRutBody = function (RUT) {
            var valor = String(RUT).replace('.', '');
            valor = valor.replace('-', '');
            return valor.slice(0, -1);
        };

        var getPuertoByNombre = function (nombrePuerto) {
            for (var item in $scope.puertoConsulta.nombre) {
                if ($scope.puertoConsulta.nombre[item].glosa === nombrePuerto) {
                    return $scope.puertoConsulta.nombre[item].id;
                }
            }
            return "";
        };



        var getSearchElements = function () {

            var nuevo = RestClient.getConsultarLocacionFiltro(getRutBody($scope.rutEmpresaConsultaData), getPuertoByNombre($scope.puertos.seleccionado), $scope.lugarConsultaData, $scope.coordenadasConsultaData, function (data) {
                for (var item = 0; item < data.length; item++) {
                    var elemento = {lugar: data[item].lugar, posicion: data[item].posicion, puerto: data[item].nombrePuerto, id: data[item].id, idEmpresa: data[item].idEmpresa, puertoId: data[item].idPuerto, rutEmpresa: $scope.rutEmpresaConsultaData, nombreEmpresa: $scope.nombreEmpresaConsultaData, direccionCasaMatriz: $scope.direccionCasaMatrizConsultaData};
                    $scope.tablaLocacionConsulta.push(angular.copy(elemento));

                }
                $scope.totalItems = $scope.tablaLocacionConsulta.length;

            }, function (error) {
                console.log("Error al obtener la consulta", error);

                var modalInstance = modalWindow('warning', 'Error Al obtener Consultar el servicio');
            });
        };

        /**
         * Function to search the information
         * @returns {undefined}
         */
        $scope.search = function () {
            //  Delete current information in table
            $scope.tablaLocacionConsulta = [];

            //  Call the function to get the elements
            getSearchElements();
            //  Put the elements in the table

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
                            "RUT_EMPRESA": $scope.rutEmpresaConsultaData,
                            "NOMBRE_EMPRESA": $scope.nombreEmpresaConsultaData,
                            "CASA_MATRIZ": $scope.direccionCasaMatrizConsultaData,
                            "PUERTO": $scope.puertos,
                            "PUERTO_SELECCIONADO": $scope.tablaLocacionConsulta[index].puerto,
                            "ID_EMPRESA": $scope.tablaLocacionConsulta[index].idEmpresa,
                            "ID_PUERTO": $scope.tablaLocacionConsulta[index].idPuerto,
                            "ID": $scope.tablaLocacionConsulta[index].id,
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

                RestClient.modificarLocaciones($scope.tablaLocacionConsulta[index].id,
                        $scope.tablaLocacionConsulta[index].idEmpresa,
                        getPortByName($scope.tablaLocacionConsulta[index].puerto),
                        $scope.tablaLocacionConsulta[index].puerto,
                        $scope.tablaLocacionConsulta[index].lugar,
                        $scope.tablaLocacionConsulta[index].posicion,
                        true,
                        function (data) {
                            console.log('Modificado registro');

                        }, function (error) {
                    console.log('error al modificar registro');
                });

            });

        };

        var getPortByName = function (puertoNombre) {
            for (var item in $scope.puertoConsulta.nombre) {
                if ($scope.puertoConsulta.nombre[item].glosa === puertoNombre) {
                    return $scope.puertoConsulta.nombre[item].id;
                }
            }
            return null;
        };

        /**
         * Remove a Item from the table tablaLocacion
         * @param {type} index of the element to be deleted
         * @returns {undefined}
         */
        $scope.delete = function (index) {

            var modalInstance = modalWindow('confirm', $scope.mensajeriaConsulta.MESSAGE_CONFIRM_DELETE);

            modalInstance.result.then(function () {

                RestClient.modificarLocaciones($scope.tablaLocacionConsulta[index].id,
                        $scope.tablaLocacionConsulta[index].idEmpresa,
                        getPortByName($scope.tablaLocacionConsulta[index].puerto),
                        $scope.tablaLocacionConsulta[index].puerto,
                        $scope.tablaLocacionConsulta[index].lugar,
                        $scope.tablaLocacionConsulta[index].posicion,
                        false,
                        function (data) {
                            console.log('Modificado registro');

                        }, function (error) {
                    console.log('error al modificar registro');
                });
                $scope.tablaLocacionConsulta.splice(index, 1);
                $scope.totalItems = $scope.tablaLocacionConsulta.length;
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
    templateUrl: 'messageComponentConsulta0.html',
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
        if ((store.coordenadas !== null || store.coordenadas !== '' || store.coordenadas !== "") && (store.coordenadas.length > 0) && store.coordenadas.toString().includes(',')) {
            var latitud = result[0].replace(/['"]+/g, '');
            var longitud = result[1].replace(/['"]+/g, '');
        } else {
            var latitud = 0;
            var longitud = 0;
        }

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
    } else
        $scope.customMessage = value;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

