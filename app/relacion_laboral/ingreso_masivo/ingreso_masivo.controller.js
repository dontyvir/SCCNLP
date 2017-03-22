'use strict';

angular.module('sccnlp.relacionLaboral.ingresoMasivo')

.controller('RelMasivoCtrl', ['$scope', 'ingMasMessages', '$uibModal', 'RestClient', 'sessionService','RegistrarContrato',
	
	function($scope, ingMasMessages, $uibModal, RestClient, sessionService, RegistrarContrato) {
	
	$scope.messages = ingMasMessages;
	
	$scope.empresaLoading = true;
	$scope.tabsActive = 0;
	$scope.tabs = [
		{disable : false}, //tab datos de la empresa
	    {disable : true}, // tab datos del trabajador
	    {disable : true}, // tab datos del contrato
	    {disable : true}  // tab finalización del proceso
	];
	
	// Datos del empleador Model
	
	$scope.empleador = {
			
			rutEmpleador : null,
			nombreEmpresa :null,
			tipoEmpresa : null,
			domicilio : null,
			terminoDeVigencia : null,
			rutRepresentanteLegal : null,
			nombreCompletoRepresentanteLegal :null,
			emailRepresentanteLegal : null,

			rutUsuarioQueRegistra : null,
			nombreCompletoUsuarioQueRegistra : null,
			cargoEnLaEmpresaQueRegistraData : null
			
	};
	
    $scope.ingresoContinue = function(tab, form) {
    	
    	if(form && form.$invalid){
    		return;
    	}
    	
    	if(!tab || tab < 1 || tab > 2)
    		return;

    	$scope.tabs[tab].disable = false;
    	$scope.tabsActive = tab;
    	
    };
	
    $scope.loadDataUsuario = function(idUsuario) {
    	
   	 var dat = RestClient.getDatosUsuario(idUsuario, function(){

   		if(dat.pasaporte) 
   			$scope.empleador.rutUsuarioQueRegistra = dat.pasaporte;
   		else
   			$scope.empleador.rutUsuarioQueRegistra = dat.rut+"-"+dat.dv;
   		
	        $scope.empleador.nombreCompletoUsuarioQueRegistra = dat.nombres+" "+dat.apellidoPaterno+" "+dat.apellidoMaterno;
   	 });
   };
	
   $scope.loadDataEmpresa = function(_rut){
    	
        var dat = RestClient.getDatosEmpresa(_rut, function(){
        	
	        $scope.empleador.rutEmpleador = dat.rutEmpresa+"-"+dat.dvEmpresa;
	        $scope.empleador.nombreEmpresa = dat.razonSocial;
	        $scope.empleador.tipoEmpresa = dat.actividades[dat.idActividadPrincipal].glosaActividad;
	        		        
	        for(var i=0;i<dat.direcciones.length;i++){
	        	if(dat.direcciones[i].esCasaMatriz)
	    	        $scope.empleador.domicilio = dat.direcciones[i].calle+" "+dat.direcciones[i].numero;
	        }
	        
	        // si ninguna dirección es casa matriz
	        if(!$scope.empleador.domicilio && dat.direcciones.length > 0)
	        	$scope.empleador.domicilio = dat.direcciones[0].calle+" "+dat.direcciones[0].numero;
	        
	        
	        $scope.empleador.rutRepresentanteLegal = dat.representante.rut+"-"+dat.representante.dv;
	        $scope.empleador.nombreCompletoRepresentanteLegal = dat.representante.glosa;
	        $scope.empleador.emailRepresentanteLegal = dat.representante.email;

	        
	        $scope.empresaLoading = false;
        });
    	
        $scope.empleador.terminoDeVigencia = null;

   }
    
    $scope.init = function() {

        /**
         * traemos los datos de sesión
          
          	var _userData = {
				id,
				username,
				rutEmpresa,
				dvEmpresa,
				role,
				permissions
			};
         */
        var session_data = sessionService.getUserData();

        $scope.loadDataEmpresa(session_data.rutEmpresa);
        $scope.loadDataUsuario(session_data.id);
    	
    };
    
    // se llaman las funciones de inicialización dinámicas
    $scope.init();
	
}]);
	
	