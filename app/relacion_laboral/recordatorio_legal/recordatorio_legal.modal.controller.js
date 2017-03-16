'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('RecordatorioLegalController', ['$scope', '$uibModalInstance',
	
	function ($scope, $uibModalInstance) {
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.proceed = function(){
		
		$uibModalInstance.close(true);
	}
}]);