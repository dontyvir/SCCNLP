'use strict';

angular.module('sccnlp.nombradas')

.controller('NombradasConsultarCtrl', ['$scope', '$state', 'nombradasMessages', '$uibModal', '$rootScope', 'RestClient', 'sessionService', function($scope, $state, nombradasMessages, $uibModal, $rootScope, RestClient, sessionService) {

    $scope.messages = nombradasMessages;
    var session_data = sessionService.getUserData();
    // --------- inicio de fecha ----------------
    $scope.today = function() {
        $scope.date = new Date();
    };
    $scope.today();

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

    // ---------------fin de fecha ------------------------
    // --------------PAGINACION DE LA TABLA ---------------
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];

    $scope.configPages = function() {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
            ini = 1;
            if (Math.ceil($scope.Nombradas.length / $scope.pageSize) > 5)
                fin = 5;
            else
                fin = Math.ceil($scope.Nombradas.length / $scope.pageSize);
        } else {
            if (ini >= Math.ceil($scope.Nombradas.length / $scope.pageSize) - 5) {
                ini = Math.ceil($scope.Nombradas.length / $scope.pageSize) - 5;
                fin = Math.ceil($scope.Nombradas.length / $scope.pageSize);
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

    //----------------- FIN DE PAGINACION DE TABLA-----------------

     //-------------- LLAMADA DE SERVICIOS ----------------------
    $scope.init = function() {

        $scope.naves = RestClient.getNave();
    
        $scope.tipoContrato = RestClient.getTipoContrato();

        $scope.labores = RestClient.getLabor();

        $scope.estados = RestClient.getEstado();

        $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa);

        $scope.funciones = RestClient.getFuncion();

        $scope.tiposTurno = RestClient.getTurno();
    };

    // se llaman las funciones de inicialización dinámicas
    $scope.init();
    //-------------- FIN LLAMADA DE SERVICIOS ----------------------

    $scope.Nombradas = [{
        IDNombrada: '13001',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        naveNombrada: 'Ocean Dream',
        sitioNombrada: '1',
        LugarNombrada: 'Sin lugar',
        EstadoNombrada: 'REVISADA'
    },{
        IDNombrada: '13341',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        naveNombrada: 'Ocean Dream',
        sitioNombrada: '1',
        LugarNombrada: 'Sin lugar',
        EstadoNombrada: 'PENDIENTE DE REVISION'
    },{
        IDNombrada: '15236',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        naveNombrada: 'Ocean Dream',
        sitioNombrada: '1',
        LugarNombrada: 'Sin lugar',
        EstadoNombrada: 'RECHAZADA'
    }];



    $scope.listadoNombrada = function() {

        $scope.animationsEnabled = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'nombradas/consulta/nombradas.modalConsulta.view.html',
            controller: 'ModalConsultaCtrl',
            size: 'lg'
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        });
    }

    $scope.buscarNombrada = function(){
        $scope.mostrarTabla = true;
    }

    $scope.eliminarTrabajador = function(id) {
        var itemEliminar = id - 1;
        var itemMover = id++;

        $scope.Nombradas.splice(itemEliminar, 1);
        $scope.configPages();
    };

}])

.controller('ModalConsultaCtrl', function($scope, $uibModalInstance, $rootScope) {

     $scope.tableDatosTrabajadores = [{
        id: '1',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Maria yepez',
        apellidosTrabajador: 'ruiz',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'RECHAZADO(Turno continuo)'
    }, {
        id: '2',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Pablo',
        apellidosTrabajador: 'Gonzalez',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'APORBADO'
    }, {
        id: '3',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Edixo',
        apellidosTrabajador: 'Ballestero',
        turnoTrabajador: 'Mañana',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'PENDIENTE POR AUTORIZACION'
    }, {
        id: '4',
        rutPasaporteTrabajador: '25432654-9',
        nombresTrabajador: 'Zenair',
        apellidosTrabajador: 'Yepez',
        turnoTrabajador: 'Tarde',
        fechaInicioNombrada: '10/11/2017 13:00',
        fechaTerminoNombrada: '10/11/2017 13:00',
        estadoTrabajador: 'APROBADO'
    }];

    $scope.salir = function() {
        $uibModalInstance.dismiss('cancel');
        console.log('fue CANCELADO');
    };

});