'use strict';

angular.module('sccnlp.relacionLaboral.ingresoMasivo')

.controller('RelMasivoCtrl', ['$scope', 'ingMasMessages','ingIndivMessages', 'RestClient', 'sessionService',
							'Empleador','LoadDataEmpleador','RecordatorioLegal','ModalEsperaCarga','FileUploader',
							'Contrato','procesarCSV',
	
	function($scope, ingMasMessages, ingIndivMessages, RestClient, sessionService,Empleador,
			 LoadDataEmpleador,RecordatorioLegal,ModalEsperaCarga,FileUploader,
			 Contrato,procesarCSV) {
	
	$scope.messages = ingMasMessages;
	angular.merge($scope.messages, ingIndivMessages);
    
	//tabs
	$scope.empresaLoading = true;
	$scope.tabsActive = 0;
	$scope.tabs = [
		{disable : false}, //tab datos de la empresa
	    {disable : true}, // tab carga relaciones laborales
	    {disable : true}  // tab finalización del proceso
	]
	$scope.error = {
		msg : null,
		tooltipIsOpen : false
	}	
	// Model Ingreso Relación Laboral
	$scope.relLab = {
		
			loading : true,
			ingresada : false,
			ingresoError : false,
			errorMsg : null,
			data : null
	};
	
	$scope.fileUploader = new FileUploader();
	$scope.results = {contratos: null, validaciones: null};
	// Datos del empleador Model
	
	$scope.empleador = new Empleador();
	
	$scope.ingresoContinueT1 = function(){
		$scope.tabs[1].disable = false;
		$scope.tabsActive = 1;
	}
	
	$scope.masivoSubmit = function(){
		
		var recordatorioModal = RecordatorioLegal();
		
		recordatorioModal.result.then(function () {
	    	var modalEsperaCarga = ModalEsperaCarga();
	    	
	    	//paso4
    	    $scope.tabs[0].disable = true;
    	    $scope.tabs[1].disable = true;
    	    $scope.tabs[2].disable = false;
	    	$scope.tabsActive = 2;
	    	
	    	var user_data = sessionService.getUserData();
	    
	    	// registro del contrato
	    	var _result = RegistrarContrato.registrar(user_data.id, $scope.empleador.rut,$scope.empleador.dv, $scope.trabajador, $scope.contrato,
	    		function(response){
	    		
	    		$scope.relLab.loading = false;
	    		
	    		modalEsperaCarga.close(true);
	    		
	    		if(response[0].error == ""){
	    			
	    			$scope.relLab.data = response[0];
	    			$scope.relLab.ingresada = true;
	    			
	    		} else {
	    			$scope.relLab.ingresoError = true;
	    			$scope.relLab.errorMSG = response[0].error;
	    		}	
	    	}, function(error){
	    		
	    		modalEsperaCarga.close(true);
	    		
	    		$scope.relLab.loading = false;
	    		$scope.relLab.ingresoError = true;
	    		$scope.relLab.errorMSG = error.message;
	    	});
		})
	}
	
	$scope.fileProcess = function(fileItem){
		
		if(!fileItem)
			return;
		
		var file = document.getElementById('csvMasivo').files[0];

		var data = Papa.parse(file,{delimiter:";",complete: function(results) {

			$scope.results = procesarCSV(results.data);
		}});
	}
	
    function init(){
        var session_data = sessionService.getUserData();

        $scope.empleador = LoadDataEmpleador(function(){
        	$scope.empresaLoading = false;
        });
        

    };

    init();
	
}]);
	
	