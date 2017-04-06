'use strict';

angular.module('sccnlp.crear_usuario')

        .controller('crearUsuarioCtrl', ['$scope', '$state', '$uibModal', 'sessionService', 'crear_usuarioMessages', 'validateRut', 'RestClient',
            function ($scope, $state, $uibModal, sessionService, crear_usuarioMessages, validateRut, RestClient) {

                $scope.messages = crear_usuarioMessages;
                $scope.USUARIO_RUT = '';
                $scope.modulo = [];
                $scope.puerto = [];
                $scope.tablaUsuarios = [];
                $scope.confirmEliminar = false;
                var session_data = sessionService.getUserData();
                
                $scope.pageSize = 5;
                $scope.currentPage = 1;
                $scope.totalItems = $scope.tablaUsuarios.length;

                /**
                 * Used to validate the form and will activate the SAVE button
                 * when the mandatory elements are right
                 * @returns {Boolean}
                 */
                $scope.dataLoading = function () {
                    if ($scope.tablaUsuarios <= 0) {
                        return true;
                    } else {
                        var auxModuleDisabled = '';
                        var auxPortDisabled = '';
                        //  Clear backgrounds to reckeck
                        for (var item in $scope.tablaUsuarios) {
                            $scope.tablaUsuarios[item].PUERTOS_COMPLETADOS = {color: '', focus: ''};
                            $scope.tablaUsuarios[item].MODULOS_COMPLETADOS = {color: '', focus: ''};
                            ;
                        }

                        for (var item in $scope.tablaUsuarios) {
                            var disableModule = true;
                            for (var module in $scope.tablaUsuarios[item].USUARIO_MODULOS) {
                                if ($scope.tablaUsuarios[item].USUARIO_MODULOS[module].selected === true)
                                    disableModule = false;
                            }
                            if (disableModule) {
                                $scope.tablaUsuarios[item].MODULOS_COMPLETADOS.color = '#a94442';
                                $scope.tablaUsuarios[item].MODULOS_COMPLETADOS.focus = 'rgb(217, 83, 79) 0px 1px 1px inset, rgb(217, 83, 79) 0px 0px 6px';
                                auxModuleDisabled = true;
                            }
                        }


                        for (var item in $scope.tablaUsuarios) {
                            var disablePort = true;
                            for (var port in $scope.tablaUsuarios[item].USUARIO_PUERTOS) {
                                if ($scope.tablaUsuarios[item].USUARIO_PUERTOS[port].selected === true)
                                    disablePort = false;
                            }
                            if (disablePort) {
                                $scope.tablaUsuarios[item].PUERTOS_COMPLETADOS.color = '#a94442';
                                $scope.tablaUsuarios[item].PUERTOS_COMPLETADOS.focus = 'rgb(217, 83, 79) 0px 1px 1px inset, rgb(217, 83, 79) 0px 0px 6px';
                                auxPortDisabled = true;
                            }
                        }

                        if (auxModuleDisabled || auxPortDisabled)
                            return true;
                        else {

                            RestClient.saveNewUser(getUserListToSave($scope.tablaUsuarios), function (data) {
                                var containError = false;
                                var errores = '';

                                for (var item = 0; item < data.length; item++) {
                                    if (data[item].error !== '') {
                                        errores = errores + "Registro N° " + (item + 1 + ": ") + data[item].error;
                                        containError = true;
                                    }
                                }

                                if (containError)
                                    var modalInstance = modalWindow('warning', errores);
                                else
                                    var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_GUARDADO_EXITOSO);

                            }, function (data) {
                                console.log("Error de guardado: " + data);
                                var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_GUARDADO_FALLIDO);
                            });
                        }

                        return false;
                    }

                };

                /**
                 * Function to generate the output to save the tablaUsuarios field
                 * @param {type} param
                 * @returns {undefined}
                 */
                var getUserListToSave = function (param) {
                    var list = [];
                    for (var item in param) {

                        //  getModulos
                        var modulosList = [];
                        for (var modulo in param[item].USUARIO_MODULOS) {
                            if (param[item].USUARIO_MODULOS[modulo].selected === true) {
                                var moduloAux = {id: param[item].USUARIO_MODULOS[modulo].id, glosa: param[item].USUARIO_MODULOS[modulo].glosa, activo: 1};
                                modulosList.push(moduloAux);
                            }
                        }


                        // getPuertos
                        var puertosList = [];
                        for (var puerto in param[item].USUARIO_PUERTOS) {
                            if (param[item].USUARIO_PUERTOS[puerto].selected === true) {
                                var puertoAux = {id: param[item].USUARIO_PUERTOS[puerto].id, glosa: param[item].USUARIO_PUERTOS[puerto].glosa, activo: 1};
                                puertosList.push(puertoAux);
                            }
                        }


                        var element = {idUsuario: 0, idEmpleado: 0, idEmpresa: session_data.id, idPersona: param[item].ID_PERSONA, nombres: param[item].USUARIO_NOMBRES, modulos: modulosList, puertos: puertosList};
                        list.push(element);
                    }
                    return list;
                };

                var getRutBody = function (param) {
                    var valor = String(param).replace('.', '');
                    valor = valor.replace('-', '');
                    return valor.slice(0, -1);
                };
                var getRutDV = function (param) {
                    var valor = String(param).replace('.', '');
                    valor = valor.replace('-', '');
                    return valor.slice(-1);
                }

                /**
                 * Function to add to the table the values returned from the Registro Civil Service
                 * @returns {undefined}
                 */
                $scope.agregarUsuario = function () {
                    if ($scope.USUARIO_RUT !== '' && validateRut.validate($scope.USUARIO_RUT)) {

                        var nuevo = RestClient.getDatosPersona(getRutBody($scope.USUARIO_RUT), getRutDV($scope.USUARIO_RUT), '', function (data) {
                            if (data.id === 0) {
                                var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_PERSONA_NO_ENCONTRADA);
                            } else {
                                var element = {USUARIO_RUT: data.rut + "-" + data.dv,
                                    USUARIO_NOMBRES: data.nombres,
                                    USUARIO_APELLIDOS: data.apellidoPaterno + " " + data.apellidoMaterno,
                                    USUARIO_MODULOS: angular.copy($scope.modulo),
                                    USUARIO_PUERTOS: angular.copy($scope.puerto),
                                    MODULOS_COMPLETADOS: {color:'',focus:''},
                                    PUERTOS_COMPLETADOS: {color:'',focus:''},
                                    ID_PERSONA: data.id                                    
                                };

                                RestClient.getConsultarUsuarios(session_data.id, getRutBody($scope.USUARIO_RUT), '', '', function (usuario) {
                                    if (usuario.length === 0){
                                        $scope.tablaUsuarios.push(element);                                        
                                        $scope.totalItems = $scope.tablaUsuarios.length;
                                    }
                                    else
                                        var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_USUARIO_EXISTENTE);
                                }, function (usuario) {
                                    var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_REG_CIVIL);
                                });
                            }

                        }, function (data) {

                            if (data.data === 'Persona no encontrada') {
                                var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_PERSONA_NO_ENCONTRADA);
                            } else
                                var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_REG_CIVIL);
                        });

                    } else {
                        var modalInstance = modalWindow('warning', $scope.messages.MESSAGE_WARNING_RUT);
                    }
                };


                $scope.getTableDatosUsuarios = function () {
                    return $scope.tablaUsuarios;
                };
                $scope.eliminarUsuario = function (id) {
                    $scope.tablaUsuarios.splice(id, 1);
                };
                $scope.generarClaveEmpresa = function () {
                    alert("guardando" + JSON.stringify($scope.data.CLAVE_EMPRESA_DIRECCION_CM));
                    $scope.trysubmit = true;
                    //$scope.data.CLAVE_EMPRESA_RUT=$scope.data.CLAVE_EMPRESA_RUT==""
                };
                /**
                 * Created to allow the user to add a user through the button Add User.
                 * this function will validate the RUT and will allow the user to add it
                 * @param {type} param
                 * @returns {Boolean}
                 */
                $scope.addUser = function (param) {
                    var disabled = true;
                    if (validateRut.validate(param))
                        disabled = false;

                    return disabled;
                };
                /**
                 * Function to select the modules
                 * @returns {undefined}
                 */
                $scope.openModule = function (elemento, p_index) {
                    $scope.modal = $uibModal.open({
                        templateUrl: 'administracion/crear_usuario/modulos.modal.view.html',
                        controller: 'modalShowModulos',
                        size: 'sm',
                        resolve: {
                            store: function () {
                                return {"mensajes": $scope.messages, elemento: elemento};
                            }
                        }
                    });
                    $scope.modal.result.then(function (result) {

                        $scope.tablaUsuarios[p_index].MODULOS_COMPLETADOS.color = '';
                        $scope.tablaUsuarios[p_index].MODULOS_COMPLETADOS.focus = '';
                        //  Set the resulting coordenated to the parent page
                        for (var item in result.USUARIO_MODULOS) {
                            $scope.tablaUsuarios[p_index].USUARIO_MODULOS[item].selected = result.USUARIO_MODULOS[item].selected;
                        }

                    });
                };
                /**
                 * Function to select the modules
                 * @returns {undefined}
                 */
                $scope.openPort = function (elemento, p_index) {
                    $scope.modal = $uibModal.open({
                        templateUrl: 'administracion/crear_usuario/puertos.modal.view.html',
                        controller: 'modalShowPuertos',
                        size: 'md',
                        resolve: {
                            store: function () {
                                return {"mensajes": $scope.messages, elemento: elemento};
                            }
                        }
                    });
                    $scope.modal.result.then(function (result) {

                        $scope.tablaUsuarios[p_index].PUERTOS_COMPLETADOS.color = '';
                        $scope.tablaUsuarios[p_index].PUERTOS_COMPLETADOS.focus = '';
                        //  Set the resulting coordenated to the parent page
                        for (var item in result.USUARIO_PUERTOS) {
                            $scope.tablaUsuarios[p_index].USUARIO_PUERTOS[item].selected = result.USUARIO_PUERTOS[item].selected;
                        }

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

            }]);
angular.module('sccnlp.crear_usuario').controller('modalShowModulos', ['$scope', '$uibModalInstance', 'store',
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
        $scope.ok = function () {
            $uibModalInstance.close($scope.elemento);
        };
    }]);
angular.module('sccnlp.crear_usuario').controller('modalShowPuertos', ['$scope', '$uibModalInstance', 'store',
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