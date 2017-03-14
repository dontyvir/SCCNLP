function ngReallyClick($uibModal) {

    var ModalInstanceCtrl = function($scope, $uibModalInstance) {
        $scope.ok = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    return {
        restrict: 'A',
        scope: {
            ngReallyClick: "&" //, //declare a function binding for directive
        },
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage || "Estas Seguro?";

                var modalHtml = '<div class="modal-body"><h4>' + message + '</h4></div>';
                modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">SI</button><button class="btn btn-warning" ng-click="cancel()">Cancelar</button></div>';

                var modalInstance = $uibModal.open({
                    template: modalHtml,
                    controller: ModalInstanceCtrl
                });

                modalInstance.result.then(function() {
                    scope.ngReallyClick();
                }, function() {
                    //Modal dismissed
                });
                //*/

            });

        }
    }
};

/**
 *
 * Pass all functions into module
 */
angular
    .module('sccnlp')
    .directive('ngReallyClick', ngReallyClick)
