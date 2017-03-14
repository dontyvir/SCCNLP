'use strict';

angular.module('sccnlp.nombradas')

.controller('NombradasModificarCtrl', ['$scope', '$state', 'nombradasMessages', '$uibModal', '$rootScope', function($scope, $state, nombradasMessages, $uibModal, $rootScope) {

    $scope.messages = nombradasMessages;

    $rootScope.styleTab1 = {
        "background-color": "#ccc",
    }

    $rootScope.tab = 1;

    $scope.isSet = function(tabNum) {
        return $rootScope.tab === tabNum;
    };

    $scope.deleteItem = function(item){
        var msgbox = $dialog.messageBox('Delete Item', 'Are you sure?', [{label:'Yes, I\'m sure', result: 'yes'},{label:'Nope', result: 'no'}]);
        msgbox.open().then(function(result){
            if(result === 'yes') {
              //code to delete here
              console.log("entre");
            }
        });
    };

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

    $scope.gettrabajadoresIncluidosNombrada = function() {
        return $scope.trabajadoresIncluidosNombrada;
    }


    $scope.tableDatosTrabajadores = [{
        id: '1',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Maria yepez',
        apellidosTrabajador: 'ruiz',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'activo'
    }, {
        id: '2',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Pablo',
        apellidosTrabajador: 'Gonzalez',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'activo'
    }, {
        id: '3',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Edixo',
        apellidosTrabajador: 'Ballestero',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'inactivo'
    }, {
        id: '4',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Zenair',
        apellidosTrabajador: 'Yepez',
        turnoTrabajador: 'Tarde',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'activo'
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
    $scope.reemplazarTrabajador = function(rut, nombre) {

        $rootScope.rutSelect = rut;
        $rootScope.nombreSelect = nombre;

        $scope.animationsEnabled = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'nombradas/nombradas.modalModificar.view.html',
            controller: 'ModalModificarCtrl',
            size: 'lg'
        });
    }

    $scope.modificarTrabajadores = function() {
        console.log("entre");
        $scope.animationsEnabled = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'nombradas/nombradas.modal.view.html',
            controller: 'ModalModificarCtrl',
            size: 'lg'
        });
    }


}])

.controller('ModalModificarCtrl', function($scope, $uibModalInstance, $rootScope, nombradasMessages) {

    $scope.messages = nombradasMessages;


    $scope.getLaborTrabajador = function() {
        return $scope.laborTrabajador;
    };
    $scope.getFuncionTrabajador = function() {
        return $scope.funcionTrabajador;
    };

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

    $scope.guardar = function() {
        console.log($scope.LaborSelected);
        if ($scope.LaborSelected == "" || $scope.LaborSelected == undefined) {
            $scope.ValidateLabor = true;
        } else {

            $uibModalInstance.close();
        }
    };

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