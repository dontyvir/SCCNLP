'use strict';

// definición de módulo menu

angular.module('sccnlp.nombradas')

.controller('NombradasMasivaCtrl', ['$scope', '$state', 'nombradasMessages', '$uibModal', '$rootScope', function($scope, $state, nombradasMessages, $uibModal, $rootScope) {

    $scope.messages = nombradasMessages;
    
    $rootScope.styleTab1 = {
        "background-color": "#ccc",
    }
    $rootScope.tab = 1;

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
            if (Math.ceil($scope.trabajadoresIncluidosNombrada.length / $scope.pageSize) > 5)
                fin = 5;
            else
                fin = Math.ceil($scope.trabajadoresIncluidosNombrada.length / $scope.pageSize);
        } else {
            if (ini >= Math.ceil($scope.trabajadoresIncluidosNombrada.length / $scope.pageSize) - 5) {
                ini = Math.ceil($scope.trabajadoresIncluidosNombrada.length / $scope.pageSize) - 5;
                fin = Math.ceil($scope.trabajadoresIncluidosNombrada.length / $scope.pageSize);
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


    // ----- UPLOAD FILE ---------
    $scope.uploadFile = function(element, $scope) {
        console.log("Changed");
        $scope.$apply(function(scope) {

        });
        document.getElementById("uploadFile").value = this.files;
    }
    // -----------------------------------  


    $scope.gettrabajadoresIncluidosNombrada = function() {
        return $scope.trabajadoresIncluidosNombrada;
    }

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

    $scope.btnContinuarMasiva = function() {

        console.log($scope.nameFile);

        if ($scope.nameFile != undefined) {
            $scope.animationsEnabled = true;
            var modalInstance = $uibModal.open({
                template: '<div class="modal-body"><p>' + $scope.messages.messageModalMasiva + '</p></div><div class="modal-footer"><button class="btn btn-primary" type="button" ng-click="cerrar()">SI</button></div>',
                controller: 'masivaModalCtrl',
                size: 'sm'
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            });
        } else {

            $scope.animationsEnabled = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'nombradas/nombradas.modal.view.html',
                controller: 'masivaModalCtrl',
                size: 'lg'
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            });
        }
    }

}])

.controller('masivaModalCtrl', function($scope, $uibModalInstance, $rootScope) {

    $scope.cerrar = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ok = function() {
        console.log('fue OK');
        $uibModalInstance.close();
        $rootScope.tab = 2;
        $rootScope.styleTab2 = {
            "background-color": "#ccc",
        }
        $rootScope.styleTab1 = {
            "background-color": "#eeeee",
        }

    };
});