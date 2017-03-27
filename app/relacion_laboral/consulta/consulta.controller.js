'use strict';

angular.module('sccnlp.relacionLaboral.consulta')

.controller('ConsultaCtrl', ['$scope', 'consultaMessages', '$uibModal', 'RestClient', 'sessionService','RegistrarContrato',
	
	function($scope, consultaMessages, $uibModal, RestClient, sessionService, RegistrarContrato) {
	
	$scope.messages = consultaMessages;
	
	$scope.consulta = {
		
			documentoIdentificador : 'rut',
			numDocIdentificador : null,
			fechaDeInicioDelContrato : null,
			fechaTerminoDelContrato : null,
			estadoContrato : null,
			resultados : null,
	};
	
	$scope.consultaLoading = false;
	$scope.dateFormat = 'dd/MM/yyyy';
	
    $scope.dateOptions = {
    	    formatYear: 'yy',
    	    maxDate: new Date(2020, 5, 22),
    	    startingDay: 1
    	  };
    
    $scope.popupFecIniCont = {opened : false};
    $scope.popupFecTerCont = {opened : false};
    
    $scope.openDatePicker = function (popup) {
		popup.opened = true;
    };
    
    $scope.loadData = function(numId){
    	
    }
    
    $scope.exportarExcel = function(){
    	
    }

}]);