'use strict';

// definición de módulo menu
angular.module('sccnlp.nombradas')

.controller('NombradasIndividualCtrl', ['$scope', '$state', 'nombradasMessages', '$uibModal', '$rootScope', function($scope, $state, nombradasMessages, $uibModal, $rootScope) {

    //--------------------------- Controller for NombradanIndividualTab.html ------------------------------------
    $scope.messages = nombradasMessages;
    $scope.messagevalidateRut = false;
    $scope.mostrarmensaje = false;

    $scope.title = "ng-table-to-csv";

    var vm = this;

    $rootScope.tab = 1;

    $rootScope.styleTab1 = {
        "background-color": "#ccc",
    }


    $scope.isSet = function(tabNum) {
        return $rootScope.tab === tabNum;
    };

    // inicio de fecha

    $scope.date = {
        value: new Date()
    };


    $scope.popup1 = {
        opened: false
    };

    $scope.formats = ['dd-MM-yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.open1 = function() {
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

    // fin de fecha

    var date_now = new Date();
    //Variables
    $scope.isVisible = true;
    $scope.verTablaTrabajador = false;
    $rootScope.styleTab1 = {
        "background-color": "#ccc",
    }

    $scope.tableDatosTrabajadores = [{
        id: '1',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Maria yepez',
        apellidosTrabajador: 'ruiz',
        tipoContratoTrabajador: '3 meses',
        tipoJornadaTrabajador: 'media',
        totalHorasSemanales: '0',
        remuneracionBrutaTrabajador: '200'
    }, {
        id: '2',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Maria yepez',
        apellidosTrabajador: 'ruiz',
        tipoContratoTrabajador: '3 meses',
        tipoJornadaTrabajador: 'media',
        totalHorasSemanales: '1',
        remuneracionBrutaTrabajador: '200'
    }];

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

    // FIN DE PAGINACION DE TABLA
    // ------------------------- TAB 1 ---------------------------

    // Functions for call services
    $scope.getTurnos = function() {
        return $scope.Turnos;
    };
    $scope.getNaves = function() {
        return $scope.Nave;
    };
    $scope.getLugares = function() {
        return $scope.Lugar;
    };
    $scope.getLaborTrabajador = function() {
        return $scope.laborTrabajador;
    };
    $scope.getFuncionTrabajador = function() {
        return $scope.funcionTrabajador;
    };

    $scope.getTableDatosTrabajadoresModel = function() {
        return $scope.tableDatosTrabajadores;
    };

    $scope.agregarTrabajador = function(rutTrabajador) {

        var encontro = false;
        $scope.showTableTrabajadores = true;
        angular.forEach($scope.tableDatosTrabajadores, function(item, index) {

            if (item.rutPasaporteTrabajador == rutTrabajador) {
                encontro = true;
            }
        });

        if (encontro == true) {
            alert('Se encontro un rut existente');
        } else {
            //-- inicio datos en duro ----
            $scope.tableDatosTrabajadores.push({
                id: $scope.tableDatosTrabajadores.length + 1,
                rutPasaporteTrabajador: rutTrabajador,
                nombresTrabajador: 'Maria Zenair',
                apellidosTrabajador: 'Yepez Ruiz',
                tipoContratoTrabajador: 'indefinido',
                tipoJornadaTrabajador: 'completo',
                totalHorasSemanales: '45',
                remuneracionBrutaTrabajador: '123456'
            });
            //--- fin datos en duro ---
            $scope.rutTrabajador = "";
            $scope.validadoRut = false;
            $scope.verTablaTrabajador = false;
            $scope.messagevalidateRut = false;
            document.getElementById('txt_rut').value = "";
        }

        $scope.configPages();
    }

    $scope.eliminarTrabajador = function(id) {
        var itemEliminar = id - 1;
        var itemMover = id++;
        // if (id < $scope.tableDatosTrabajadores.length) {
        //     $scope.tableDatosTrabajadores[itemMover].id = itemMover;
        // }
        $scope.tableDatosTrabajadores.splice(itemEliminar, 1);
        $scope.configPages();
    };

    $scope.gettrabajadoresIncluidosNombrada = function() {
        return $scope.trabajadoresIncluidosNombrada;
    }

    $scope.validateRut = function(documentoIdentificador) {

        var txt_rut = document.getElementById('txt_rut');

        if (documentoIdentificador == 'rut') {
            var Fn = {
                // Valida el rut con su cadena completa "XXXXXXXX-X"
                validaRut: function(rutCompleto) {
                    if (!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto))
                        return false;
                    var tmp = rutCompleto.split('-');
                    var digv = tmp[1];
                    var rut = tmp[0];
                    if (digv == 'K') digv = 'k';
                    return (Fn.dv(rut) == digv);
                },
                dv: function(T) {
                    var M = 0,
                        S = 1;
                    for (; T; T = Math.floor(T / 10))
                        S = (S + T % 10 * (9 - M++ % 6)) % 11;
                    return S ? S - 1 : 'k';
                }
            }

            if (Fn.validaRut(txt_rut.value)) {
                $scope.messagerut = ""
                $scope.validadoRut = true;
                $scope.messagevalidateRut = false;

            } else {
                $scope.messagerut = "El Rut no es válido :'( "
                $scope.validadoRut = false;
                $scope.messagevalidateRut = true;
            }
        } else {
            $scope.messagerut = ""
            $scope.validadoRut = true;
            $scope.messagevalidateRut = false;
        }


    }

    //--- inicio de Datos de duro
    $scope.puertoUnico = 'Valparaiso'

    $scope.Turnos = [{
        value: 'COMP',
        displayName: 'Completo'
    }, {
        value: 'MED',
        displayName: 'Medio'
    }];

    $scope.Nave = [{
        value: 'NAV1',
        displayName: 'A bordo nave'
    }, {
        value: 'NAV2',
        displayName: 'Nave 2'
    }];

    $scope.Lugar = [{
        value: 'LUG1',
        displayName: 'Lugar 1'
    }, {
        value: 'LUG2',
        displayName: 'Lugar 2'
    }];

    $scope.laborTrabajador = [{
        value: '1',
        displayName: 'Labor 1'
    }, {
        value: '2',
        displayName: 'Labor 2'
    }];

    $scope.funcionTrabajador = [{
        value: 'MEC1',
        displayName: 'Mecanico'
    }, {
        value: 'MEC2',
        displayName: 'Funcion 2'
    }];

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

    // Funcion que valida los datos y posiciona en la siguien tab

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

    $scope.changeTabByButton = function() {

        // --- continua a la siguiente TAB ---
        if ($scope.date.value < date_now) {
            $scope.messageValidateDate = true;
            $scope.messageValidateDate = "La fecha de inicio de nombrada no puede ser menor a la actual.";
            $scope.mostrarmensaje = true;
            alert("La fecha de inicio de nombrada no puede ser menor a la actual.");
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

            if ($scope.messageValidate || $scope.ValidateTurno || $scope.ValidateNave) {

                $scope.animationsEnabled = true;

                var message = "Debe completar todos los campos obligatorios";

                $scope.messageModal(message);

            } else {
                // muestra el mensaje de resolucion
                var camposVacios = false;
                if (!$scope.showTableTrabajadores) {
                    var message = "Debe agregar los trabajadores";
                    $scope.messageModal(message);
                } else {
                    angular.forEach($scope.tableDatosTrabajadores, function(item, index) {

                        var indextab = item.id - 1;

                        if (vm.laborSelect[index] == "" || vm.laborSelect[index] == undefined || vm.funcionSelect[index] == "" || vm.funcionSelect[index] == undefined) {
                            camposVacios = true;
                        } else {
                            $scope.tableDatosTrabajadores[index]["labor"] = vm.laborSelect[index];
                            $scope.tableDatosTrabajadores[index]["funcion"] = vm.funcionSelect[index];
                        }

                    });

                    if (camposVacios) {

                    var message = "Debe completar los campos de la tabla";
                    $scope.messageModal(message);

                } else {

                    $scope.animationsEnabled = true;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'nombradas/nombradas.modal.view.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'lg'
                    });
                }
                }

                
            }
        }
    };

}])

.filter('startFromGrid', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }

})

.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, $rootScope) {

    $scope.ok = function() {
        $uibModalInstance.close();
        $rootScope.tab = 2;
        $rootScope.styleTab2 = {
            "background-color": "#ccc",
        }
        $rootScope.styleTab1 = {
            "background-color": "#eeeee",
        }
        $scope.messageValidateDate = "";

    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});