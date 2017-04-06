'use strict';

angular.module('sccnlp.relacionLaboral')

.controller('ConfirmacionGuardadoCtrl', ['$scope', '$uibModalInstance','title','message',
	
	function ($scope, $uibModalInstance, title, message) {
	
	$scope.title = title;
	$scope.message = message;
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.proceed = function(){
		
		$uibModalInstance.close(true);
	}
}]);