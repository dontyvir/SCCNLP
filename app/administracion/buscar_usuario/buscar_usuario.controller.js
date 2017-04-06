'use strict';

angular.module('sccnlp.buscar_usuario')

        .controller('buscarUsuarioCtrl', ['$scope', '$state', '$uibModal', 'sessionService', 'buscar_usuarioMessages', 'RestClient', 'validateRut',
            function ($scope, $state, $uibModal, sessionService, buscar_usuarioMessages, RestClient, validateRut) {

                $scope.messages = buscar_usuarioMessages;
                $scope.USUARIO_RUT = '';
                $scope.USUARIO_NOMBRES = '';
                $scope.VIGENCIA_LISTA = {//  Data puerto
                    nombre: ['', 'Activo', 'Inactivo'],
                    seleccionado: ''
                };


                $scope.modulo = [];
                $scope.puerto = [];
                $scope.tablaUsuarios = [];
                $scope.usuarioSeleccionado = {};
                var session_data = sessionService.getUserData();

                $scope.pageSize = 5;
                $scope.currentPage = 2;
                $scope.totalItems = $scope.tablaUsuarios.length;

                $scope.confirmEliminar = false;

                $scope.cancel = function () {
                    $scope.tablaUsuarios = [];
                };

                var getRutBody = function (param) {
                    var valor = String(param).replace('.', '');
                    valor = valor.replace('-', '');
                    return valor.slice(0, -1);
                };

                var getVigencia = function (param) {
                    if (param === 'Activo')
                        return true;
                    else if (param === 'Inactivo')
                        return false;
                    else
                        return '';
                };

                $scope.buscar = function () {
                    $scope.tablaUsuarios = [];

                    if ($scope.USUARIO_RUT !== '') {
                        if (!validateRut.validate($scope.USUARIO_RUT)) {
                            var nuevo = RestClient.getConsultarUsuarios(session_data.id, getRutBody($scope.USUARIO_RUT), $scope.USUARIO_NOMBRES, getVigencia($scope.VIGENCIA_LISTA.seleccionado), function (data) {
                                if (data.length === 0) {
                                    var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_PERSONA_NO_ENCONTRADA);
                                } else {
                                    for (var item = 0; data.length > item; item++) {

                                        var modulosDeServicio = angular.copy($scope.modulo);
                                        var puertosDeServicio = angular.copy($scope.puerto);
                                        //get modulos seleccionados


                                        for (var modulo in data[item].modulos) {
                                            if (data[item].modulos[modulo].activo === true) {
                                                for (var mod in modulosDeServicio) {
                                                    if (modulosDeServicio[mod].id === data[item].modulos[modulo].id) {
                                                        modulosDeServicio[mod].selected = true;
                                                    }
                                                }
                                            }
                                        }

                                        //get puertos seleccionados


                                        for (var puerto in data[item].puertos) {
                                            if (data[item].puertos[puerto].activo === true) {
                                                for (var mod in puertosDeServicio) {
                                                    if (puertosDeServicio[mod].id === data[item].puertos[puerto].id) {
                                                        puertosDeServicio[mod].selected = true;
                                                    }
                                                }
                                            }
                                        }


                                        var element = {USUARIO_RUT: data[item].rut,
                                            USUARIO_NOMBRES: data[item].nombres,
                                            USUARIO_APELLIDOS: data[item].apellidos,
                                            USUARIO_MODULOS: modulosDeServicio,
                                            USUARIO_PUERTOS: puertosDeServicio,
                                            MODULOS_COMPLETADOS: '',
                                            PUERTOS_COMPLETADOS: '',
                                            VIGENCIA: data[item].activo,
                                            ID_USUARIO: data[item].idUsuario,
                                            ID_EMPLEADO: data[item].idEmpleado,
                                            ID_EMPRESA: data[item].idEmpresa,
                                            ID_PERSONA: data[item].idPersona,
                                            INDEX_ELEMENT: item
                                        };

                                        $scope.tablaUsuarios.push(element);
                                    }
                                    $scope.totalItems = $scope.tablaUsuarios.length;
                                }
                            }, function (data) {

                                var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_NO_SERVICE);
                            });
                        } else {
                            var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_RUT);
                        }
                    } else {
                        var nuevo = RestClient.getConsultarUsuarios(session_data.id, getRutBody($scope.USUARIO_RUT), $scope.USUARIO_NOMBRES, getVigencia($scope.VIGENCIA_LISTA.seleccionado), function (data) {
                            if (data.length === 0) {
                                var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_PERSONA_NO_ENCONTRADA);
                            } else {
                                for (var item = 0; data.length > item; item++) {

                                    var modulosDeServicio = angular.copy($scope.modulo);
                                    var puertosDeServicio = angular.copy($scope.puerto);
                                    //get modulos seleccionados


                                    for (var modulo in data[item].modulos) {
                                        if (data[item].modulos[modulo].activo === true) {
                                            for (var mod in modulosDeServicio) {
                                                if (modulosDeServicio[mod].id === data[item].modulos[modulo].id) {
                                                    modulosDeServicio[mod].selected = true;
                                                }
                                            }
                                        }
                                    }

                                    //get puertos seleccionados


                                    for (var puerto in data[item].puertos) {
                                        if (data[item].puertos[puerto].activo === true) {
                                            for (var mod in puertosDeServicio) {
                                                if (puertosDeServicio[mod].id === data[item].puertos[puerto].id) {
                                                    puertosDeServicio[mod].selected = true;
                                                }
                                            }
                                        }
                                    }


                                    var element = {USUARIO_RUT: data[item].rut,
                                        USUARIO_NOMBRES: data[item].nombres,
                                        USUARIO_APELLIDOS: data[item].apellidos,
                                        USUARIO_MODULOS: modulosDeServicio,
                                        USUARIO_PUERTOS: puertosDeServicio,
                                        MODULOS_COMPLETADOS: '',
                                        PUERTOS_COMPLETADOS: '',
                                        VIGENCIA: data[item].activo,
                                        ID_USUARIO: data[item].idUsuario,
                                        ID_EMPLEADO: data[item].idEmpleado,
                                        ID_EMPRESA: data[item].idEmpresa,
                                        ID_PERSONA: data[item].idPersona
                                        ,
                                            INDEX_ELEMENT: item
                                    };

                                    $scope.tablaUsuarios.push(element);
                                }
                                $scope.totalItems = $scope.tablaUsuarios.length;
                            }
                        }, function (data) {

                            var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_NO_SERVICE);
                        });
                    }

                };

                $scope.getTableDatosUsuarios = function () {
                    return $scope.tablaUsuarios;

                };

                var getListToUpdate = function (param) {
                    var table = [];
                    for (var item = 0; item < param.length; item++) {

                        //  get Modulos
                        var newModulos = [];
                        for (var modulos in param[item].USUARIO_MODULOS) {
                            if (param[item].USUARIO_MODULOS[modulos].selected === true) {
                                var moduloInput = {id: param[item].USUARIO_MODULOS[modulos].id, glosa: param[item].USUARIO_MODULOS[modulos].glosa, activo: 1};
                                newModulos.push(moduloInput);
                            }
                        }


                        //  get Puertos
                        var newPuertos = [];
                        for (var puertos in param[item].USUARIO_PUERTOS) {
                            if (param[item].USUARIO_PUERTOS[puertos].selected === true) {
                                var puertoInput = {id: param[item].USUARIO_PUERTOS[puertos].id, glosa: param[item].USUARIO_PUERTOS[puertos].glosa, activo: 1};
                                newPuertos.push(puertoInput);
                            }
                        }

                        var element = {idUsuario: param[item].ID_USUARIO,
                            idEmpleado: param[item].ID_EMPLEADO,
                            idEmpresa: param[item].ID_EMPRESA,
                            idPersona: param[item].ID_PERSONA,
                            nombres: null,
                            modulos: newModulos,
                            puertos: newPuertos,
                            activo: param[item].VIGENCIA,
                            index_element: item        
                        };
                        table.push(element);
                    }
                    return table;
                };


                $scope.save = function (index, lugar) {

                    var element = $scope.tablaUsuarios[index];
                    var table = [];
                    table.push(element);
                    var nuevo = RestClient.modifyUser(getListToUpdate(table), function (data) {
                        console.log('Guardado Exitosamente');
                    }, function (data) {
                        if (lugar === 'puerto')
                            var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_NO_SERVICE_PUERTO);
                        if (lugar === 'modulo')
                            var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_NO_SERVICE_MODULO);
                        if (lugar === 'vigencia')
                            var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_NO_SERVICE_VIGENCIA);
                    });
                };


                $scope.generarClaveEmpresa = function () {
                    $scope.trysubmit = true;
                };


                /**
                 * Function to select the modules
                 * @param {type} elemento
                 * @param {type} p_index
                 * @returns {undefined}
                 */

                $scope.openModule = function (elemento, p_index) {
                    $scope.modal = $uibModal.open({
                        templateUrl: 'administracion/buscar_usuario/modulos.modal.view.html',
                        controller: 'modalShowModulos',
                        size: 'sm',
                        resolve: {
                            store: function () {
                                return {"mensajes": $scope.messages, elemento: elemento};
                            }
                        }
                    });
                    $scope.modal.result.then(function (result) {
                        $scope.tablaUsuarios[p_index].MODULOS_COMPLETADOS = '';
                        //  Set the resulting coordenated to the parent page
                        for (var item in result.USUARIO_MODULOS) {
                            $scope.tablaUsuarios[p_index].USUARIO_MODULOS[item].selected = result.USUARIO_MODULOS[item].selected;
                        }

                        $scope.save(p_index, 'modulo')

                    });
                };
                /**
                 * Function to select the modules
                 * @param {type} elemento
                 * @param {type} p_index
                 * @returns {undefined}
                 */
                $scope.openPort = function (elemento, p_index) {
                    $scope.modal = $uibModal.open({
                        templateUrl: 'administracion/buscar_usuario/puertos.modal.view.html',
                        controller: 'modalShowPuertos',
                        size: 'md',
                        resolve: {
                            store: function () {
                                return {"mensajes": $scope.messages, elemento: elemento};
                            }
                        }
                    });
                    $scope.modal.result.then(function (result) {
                        $scope.tablaUsuarios[p_index].PUERTOS_COMPLETADOS = '';
                        //  Set the resulting coordenated to the parent page
                        for (var item in result.USUARIO_PUERTOS) {
                            $scope.tablaUsuarios[p_index].USUARIO_PUERTOS[item].selected = result.USUARIO_PUERTOS[item].selected;
                        }
                        $scope.save(p_index, 'puerto');
                    });
                };
                /**
                 * Function to load the Module at init
                 * @returns {undefined}
                 */
                $scope.loadModule = function () {
                    $scope.modulo = [];
                    var modulosAux = RestClient.getModulo(function () {
                        for (var item in modulosAux) {
                            if (modulosAux[item].activo === true) {
                                var element = {id: modulosAux[item].id, glosa: modulosAux[item].glosa, selected: false};
                                $scope.modulo.push(element);
                            }
                        }
                        ;
                    }, null);
                };
                /**
                 * Function to load the ports availables
                 * @returns {undefined}
                 */
                $scope.loadPorts = function () {
                    $scope.puerto = [];
                    var puertoAux = RestClient.getPuerto(function () {
                        for (var item in puertoAux) {
                            if (puertoAux[item].activo === true) {
                                var element = {id: puertoAux[item].id, glosa: puertoAux[item].glosa, codigo: puertoAux[item].codigo, selected: false};
                                $scope.puerto.push(element);
                            }
                        }
                    }, null);
                };
                /**
                 * Initialize elements
                 * @returns {undefined}
                 */
                $scope.init = function () {
                    $scope.loadModule();
                    $scope.loadPorts();
                };

                var modalWindow = function (p_type, p_value) {
                    return $uibModal.open({
                        templateUrl: 'messageComponent.html',
                        controller: 'alertMessageAdmin',
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

                $scope.changeVigencia = function (element, index) {
                    element.VIGENCIA = !element.VIGENCIA;
                    $scope.save(index, 'vigencia');
                };

                /**
                 * Function to get the Excel file
                 * @returns {undefined}
                 */
                $scope.getExcel = function () {

                    var mystyle = {sheetid: 'Consultar usuarios',
                        headers: true,
                        style: 'font-size:12px;font-weight:bold;background:white',

                        caption: {
                            title: 'Consultar usuarios'
                        },

                        columns: [
                            {columnid: 'USUARIO_RUT', title: $scope.messages.HEADER_RUT, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold'},
                            {columnid: 'USUARIO_NOMBRES', title: $scope.messages.HEADER_NOMBRES, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 250},
                            {columnid: 'USUARIO_APELLIDOS', title: $scope.messages.HEADER_APELLIDOS, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold;', width: 300},
                            {columnid: 'USUARIO_MODULOS', title: $scope.messages.HEADER_MODULOS, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 300},
                            {columnid: 'USUARIO_PUERTOS', title: $scope.messages.HEADER_PUERTOS, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 100},
                            {columnid: 'VIGENCIA', title: $scope.messages.HEADER_VIGENCIA, style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold', width: 300}
                        ],

                        row: {
                            style: function (sheet, row, rowidx) {
                                return 'background:' + (rowidx % 2 ? '#F1F1F1' : 'white') + ';text-align:center;border-style:groove;vertical-align:middle';
                            }
                        }
                    };
                    var table = [];

                    for (var item in $scope.tablaUsuarios) {
                        var modulosAceptados = [];
                        var puertosAceptados = [];
                        for (var moduloElement in $scope.tablaUsuarios[item].USUARIO_MODULOS) {
                            if ($scope.tablaUsuarios[item].USUARIO_MODULOS[moduloElement].selected === true) {
                                modulosAceptados.push($scope.tablaUsuarios[item].USUARIO_MODULOS[moduloElement].glosa);
                            }
                        }
                        for (var puertoElement in $scope.tablaUsuarios[item].USUARIO_PUERTOS) {
                            if ($scope.tablaUsuarios[item].USUARIO_PUERTOS[puertoElement].selected === true) {
                                puertosAceptados.push($scope.tablaUsuarios[item].USUARIO_PUERTOS[puertoElement].glosa);
                            }
                        }
                        var element = {USUARIO_RUT: $scope.tablaUsuarios[item].USUARIO_RUT,
                            USUARIO_NOMBRES: $scope.tablaUsuarios[item].USUARIO_NOMBRES,
                            USUARIO_APELLIDOS: $scope.tablaUsuarios[item].USUARIO_APELLIDOS,
                            USUARIO_MODULOS: modulosAceptados,
                            USUARIO_PUERTOS: puertosAceptados,
                            VIGENCIA: $scope.tablaUsuarios[item].VIGENCIA === true ? $scope.messages.TEXT_SI : $scope.messages.TEXT_NO
                        };
                        table.push(element);
                    }

                    alasql('SELECT * INTO XLS("Reporte Consulta usuarios - ' + new Date() + '.xls",?) FROM ?', [mystyle, table]);

                };


            }]);


angular.module('sccnlp.buscar_usuario').controller('modalShowModulos', ['$scope', '$uibModalInstance', 'store',
    function ($scope, $uibModalInstance, store) {
        $scope.messagesModal = store.mensajes; // conexión del servicio messages para Modal
        $scope.elemento = angular.copy(store.elemento);
        /**
         * Change the value of the element
         * @param {type} index
         * @returns {undefined}
         */
        $scope.selectModule = function (index) {
            $scope.elemento.USUARIO_MODULOS[index].selected = !$scope.elemento.USUARIO_MODULOS[index].selected;
        };
        /**
         * Close the modal popup
         * @returns {undefined}C
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        /**
         * Accept the new values 
         * @returns {undefined}
         */

        $scope.getActiveModules = function () {
            $scope.hasMinimun = false;
            for (var item in  $scope.elemento.USUARIO_MODULOS) {
                if ($scope.elemento.USUARIO_MODULOS[item].selected === true) {
                    $scope.hasMinimun = true;
                }
            }
            return $scope.hasMinimun;
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.elemento);
        };
    }]);
angular.module('sccnlp.buscar_usuario').controller('modalShowPuertos', ['$scope', '$uibModalInstance', 'store',
    function ($scope, $uibModalInstance, store) {
        $scope.messagesModal = store.mensajes; // conexión del servicio messages para Modal
        $scope.elemento = angular.copy(store.elemento);
        /**
         * Change the value of the element
         * @param {type} index
         * @returns {undefined}
         */
        $scope.selectPuertos = function (index) {
            $scope.elemento.USUARIO_PUERTOS[index].selected = !$scope.elemento.USUARIO_PUERTOS[index].selected;
        };
        /**
         * Close the modal popup
         * @returns {undefined}C
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.getActivePorts = function () {
            $scope.hasMinimun = false;
            for (var item in  $scope.elemento.USUARIO_PUERTOS) {
                if ($scope.elemento.USUARIO_PUERTOS[item].selected === true) {
                    $scope.hasMinimun = true;
                }
            }
            return  $scope.hasMinimun;
        };

        /**
         * Accept the new values 
         * @returns {undefined}
         */
        $scope.ok = function () {
            $uibModalInstance.close($scope.elemento);
        };
    }]);


/**
 * Modal view to show to user a modal message
 */
angular.module('sccnlp.crear_usuario').controller('alertMessageAdmin', function ($scope, $uibModalInstance, message, type, value) {

    $scope.type = type;
    $scope.alertMessages = message;
    $scope.customMessage = angular.copy(value);

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});
