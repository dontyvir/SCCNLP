'use strict';

angular.module('sccnlp.nombradas')

.controller('NombradasModificarCtrl', ['$scope', '$state', 'nombradasMessages', '$uibModal', '$rootScope', function($scope, $state, nombradasMessages, $uibModal, $rootScope) {

    $scope.messages = nombradasMessages;

    //tabs
    $scope.tabsActive = 0;
    $scope.tabs = [{
            disable: false
        }, //tab ingreso de nombrada
        {
            disable: true
        }, // tab resolucion
    ]

    // ---------------PAGINACION DE LA TABLA ------------------
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

    // ---------------FIN DE PAGINACION DE TABLA------------------------

    $scope.gettrabajadoresIncluidosNombrada = function() {
        return $scope.trabajadoresIncluidosNombrada;
    }


    $rootScope.tableDatosTrabajadores = [{
        id: '1',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Maria yepez',
        apellidosTrabajador: 'ruiz',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'RECHAZADO'
    }, {
        id: '2',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Pablo',
        apellidosTrabajador: 'Gonzalez',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'APROBADO'
    }, {
        id: '3',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Edixo',
        apellidosTrabajador: 'Ballestero',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'PENDIENTE'
    }, {
        id: '4',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Zenair',
        apellidosTrabajador: 'Yepez',
        turnoTrabajador: 'Tarde',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'RECHAZADO'
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
    $scope.reemplazarTrabajador = function(rut, nombre, index) {

        $rootScope.rutSelect = rut;
        $rootScope.nombreSelect = nombre;
        $rootScope.index = index;

        $scope.animationsEnabled = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'nombradas/modificar/nombradas.modalModificar.view.html',
            controller: 'ModalModificarCtrl',
            size: 'lg'
        });
    }

    $scope.modificarTrabajadores = function(tab) {

        if (!tab || tab < 1 || tab > 2)
            return;

        $scope.tabs[tab].disable = false;
        $scope.tabs[0].disable = true;
        $scope.tabsActive = tab;
    }


}])

.controller('ModalModificarCtrl', function($scope, $uibModalInstance, $rootScope, nombradasMessages, $uibModal, RestClient) {

    $scope.messages = nombradasMessages;
    //-------------- LLAMADA DE SERVICIOS ----------------------
    $scope.init = function() {

        $scope.labores = RestClient.getLabor();
        $scope.funciones = RestClient.getFuncion();
    };

    // se llaman las funciones de inicialización dinámicas
    $scope.init();
    //-------------- LLAMADA DE SERVICIOS ----------------------

    $scope.validateRut = function() {

        var txt_rut = document.getElementById('txt_rut');

        if ($scope.documentoIdentificador == 'rut') {
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

    // --- MESAJE DE MODAL --------------

    $scope.messageModal = function(message) {
        var template = '<div class="modal-body" id="modal-body">' +
            '<p>' + message + '</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button class="btn btn-primary" type="button" ng-click="cancel()">Cerrar</button>' +
            '</div>';

        var modalInstance = $uibModal.open({
            template: template,
            controller: 'ModalModificarCtrl',
            size: 'sm'
        });
    }

    $scope.ok = function() {
        $uibModalInstance.close();
        $rootScope.tab = 2;
        $rootScope.styleTab2 = {
            "background-color": "#ccc",
        }
        $rootScope.styleTab1 = {
            "background-color": "#eeeee",
        }
    };

    $scope.agregarTrabajador = function(rutTrabajador) {
        $scope.nombreTrabajador = "Maria Yepez"
    }

    $scope.continuar = function() {

        if ($scope.LaborSelected == "" || $scope.LaborSelected == undefined) {
            $scope.ValidateLabor = true;
        }else{
            $scope.ValidateLabor = false;
        }

        if ($scope.FuncionSelected == "" || $scope.FuncionSelected == undefined) {
            $scope.ValidateFuncion = true;
        }else{
            $scope.ValidateFuncion = false;
        }

        if ($scope.ValidateLabor || $scope.ValidateFuncion) {
            var message = "Debe completar todos los campos obligatorios";
            $scope.messageModal(message);
        } else {
            $scope.tableDatosTrabajadores[$scope.index].rutPasaporteTrabajador = $scope.rutTrabajador;
            $scope.tableDatosTrabajadores[$scope.index].nombresTrabajador = $scope.nombreTrabajador;
            $uibModalInstance.close();
        }
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.limpiar = function() {
        $scope.rutTrabajador = "";
        $scope.nombreTrabajador = "";
        $scope.LaborSelected = "";
        $scope.FuncionSelected = "";
        $scope.validadoRut = false;

    }
});