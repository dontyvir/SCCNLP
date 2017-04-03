'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('RelIndividualCtrl', ['$scope', 'ingIndivMessages', '$uibModal', 'RestClient',
	                              'RestClientRelacionLaboral', 'sessionService','RegistrarContrato',
	                              'loadAcuerdoDescanso', 'loadAcuerdoJornadaLaboral','Trabajador',
	                              'Contrato','Empleador','Labor','GoogleMapsAutoComplete',
	
	function($scope, ingIndivMessages, $uibModal, RestClient, RestClientRelacionLaboral,
			 sessionService, RegistrarContrato,loadAcuerdoDescanso,loadAcuerdoJornadaLaboral,
			 Trabajador, Contrato, Empleador, Labor,GoogleMapsAutoComplete) {
	
	$scope.messages = ingIndivMessages;
	
	$scope.ingresoIdNum = null;
	
	// flag para hacer editables campos en tab3
    $scope.isEdit = false;
	
	//tabs
	$scope.terminoContratoTooltip = false;
	$scope.trabajadorLoading = false;
	$scope.empresaLoading = true;
	$scope.tabsActive = 0;
	$scope.tabs = [
		{disable : false}, //tab datos de la empresa
	    {disable : true}, // tab datos del trabajador
	    {disable : true}, // tab datos del contrato
	    {disable : true}  // tab finalización del proceso
	]
	
	// Model Ingreso Relación Laboral
	$scope.relLab = {
		
			loading : true,
			ingresada : false,
			ingresoError : false,
			errorMsg : null,
			data : null
	};
	
	// Datos del empleador Model
	
	$scope.empleador = new Empleador();
	
    // Datos del trabajador Model
	
	$scope.trabajador = new Trabajador();
	$scope.trabajador.documentoIdentificador = 'rut'; // pot defecto
	
	
	// información del contrato Model
	
	$scope.contrato = new Contrato();
	
    /**
     * Variables para recibir listados en combobox
     */
    $scope.AFP = [];
    $scope.ISAPRE = [];
    $scope.tipoContrato = [];
    $scope.modalidadDePago = [];
    $scope.labores = [];
    $scope.funciones = [];
    $scope.tiposJornada = [];
    $scope.lugares = [];
    $scope.nacionalidades = [];
    
    /**
     * Métodos
     */

    $scope.fechaTerminoDisabled = function(){
    	
    	if($scope.contrato.tipoContratoSelected &&
    		$scope.contrato.tipoContratoSelected == 1) {
    		
    		$scope.contrato.fechaTerminoDelContrato = null;
    		return true;
    	}
    	
    	return false;
    }
    
    $scope.validateFechaTerminoContrato = function(){
    	
    	if(!$scope.contrato.fechaTerminoDelContrato ||
    		!$scope.contrato.fechaDeInicioDelContrato) {
    		
    		$scope.terminoContratoTooltip = false;    		
    		return true;    		
    	}

    	
    	if($scope.contrato.fechaDeInicioDelContrato.getTime() > 
    		$scope.contrato.fechaTerminoDelContrato.getTime())
    	{
    		
    		$scope.terminoContratoTooltip = true;
    		
    		return false;
    	}
    		$scope.terminoContratoTooltip = false;
    		return true;
    }
    
    $scope.validateHorariosAcuerdos = function(){
    	
    	var _ret = true;
    	
    	for(var i=0;i<$scope.contrato.labores.length;i++){
    		
    		var lab = $scope.contrato.labores[i];
    		
    		if(!lab.acuerdoDescanso) {
    			_ret = false;
    			lab.acuerdoEmpty = true;
    		}
    		
    		if(!lab.horario){
    			_ret = false;
    			lab.horarioEmpty = true;
    		}
    	}
    	
    	return _ret;
    }

    /** al cambiar de región se recarga la lista de comunas **/
    $scope.cambioRegion = function(){
    	$scope.comunas = RestClient.getComunasByIdRegion($scope.trabajador.domicilio.idRegion);
    }
    
    $scope.addRow = function () {
    	    	
    	var id = $scope.contrato.labores.length;
    	$scope.contrato.labores.push(new Labor(id));
    };
    
    $scope.deleteRow = function(rowModel) {
    	
    	if(!confirm($scope.messages.estaSeguro))
    		return;

    	var datos = $scope.contrato.labores;
    	
    	datos.splice(rowModel.id, 1); // remove 1 element from index rowModel.id
    	
    	for(var i=rowModel.id;i<datos.length;i++){
    		datos[i].id--;
    	}
    	
    	if(datos.length == 0)
    		$scope.addRow();
    }

    $scope.updateTotal = function () {

    	var total = 0;
    	var length = $scope.contrato.labores.length;
    	
    	for(var i=0; i < length; i++) {
    		
    		var remun = $scope.contrato.labores[i].remuneracionBruta;
    		if(remun && !isNaN(remun))
    		total += remun;
    	}
    	
    	$scope.contrato.total = total;
    };

    $scope.dateOptions = {
    	    formatYear: 'yy',
    	    maxDate: new Date(2020, 5, 22),
    	    startingDay: 1
    	  };
  
    $scope.dateFormat = 'dd/MM/yyyy';
    
    $scope.popupFecNacTrab   = {opened : false};
    $scope.popupFecCelebCont = {opened : false};
    $scope.popupFecIniCont   = {opened : false};
    $scope.popupFecTerCont   = {opened : false};
    
    $scope.openDatePicker = function (popup) {
    		popup.opened = true;
    };
    
    var $parentCtl = $scope;
    
    $scope.loadAcuerdoJornadaLaboral = loadAcuerdoJornadaLaboral;
    $scope.loadAcuerdoDescanso = loadAcuerdoDescanso;

	    $scope.clearDataTrabajador = function(){
	    	$scope.trabajador.numDocIdentificador = null,
			$scope.trabajador.nombres = null;
			$scope.trabajador.apellidos = null;			
			$scope.trabajador.nacionalidad = null;
			$scope.trabajador.sexo = null;
			$scope.trabajador.fechaDeNacimiento = null;
			$scope.trabajador.estadoCivil = null;
	    }

	    $scope.ingresoContinue = function(tab, form) {
	    	
	    	if(form && form.$invalid){
	    		return;
	    	}
	    	
	    	if(!tab || tab < 1 || tab > 2)
	    		return;

	    	$scope.tabs[tab].disable = false;
	    	$scope.tabsActive = tab;
	    	
	    };
	    
	    $scope.ingresoSubmit = function(form) {

	    	if(form && form.$invalid){
	    		return;
	    	}
	    	
	    	if(!$scope.validateFechaTerminoContrato)
	    		return;
	    	
	    	if(!$scope.validateHorariosAcuerdos())
	    		return;

		    var modalInstance = $uibModal.open({

			      ariaLabelledBy: 'modal-title',
			      ariaDescribedBy: 'modal-body',
			      templateUrl: 'relacion_laboral/confirmacion_guardado/recordatorio_legal.modal.view.html',
			      controller: 'ConfirmacionGuardadoCtrl',
			      controllerAs: '$ctrl'
			    });

			    modalInstance.result.then(function () {
			    
			    	//paso4
		    	    $scope.tabs[0].disable = true;
		    	    $scope.tabs[1].disable = true;
		    	    $scope.tabs[2].disable = true;
			    	$scope.tabs[3].disable = false;
			    	$scope.tabsActive = 3;
			    	
			    	var user_data = sessionService.getUserData();
			    
			    	// registro del contrato
			    	var _result = RegistrarContrato.registrar(user_data.id, $scope.empleador.rut,$scope.empleador.dv, $scope.trabajador, $scope.contrato,
			    		function(response){
			    		
			    		$scope.relLab.loading = false;
			    		
			    		if(response[0].error == ""){
			    			
			    			$scope.relLab.data = response[0];
			    			$scope.relLab.ingresada = true;
			    			
			    		} else {
			    			$scope.relLab.ingresoError = true;
			    			$scope.relLab.errorMSG = response[0].error;
			    		}
			    		
			    			
			    	}, function(error){
			    		$scope.relLab.loading = false;
			    		$scope.relLab.ingresoError = true;
			    		$scope.relLab.errorMSG = error.message;
			    	});

			    }, function () {
			    	
			      console.log('Modal dismissed at: ' + new Date());
			    });
	    }
	    
	    $scope.tryAgain = function(){
    	    $scope.tabs[0].disable = false;
    	    $scope.tabs[1].disable = false;
    	    $scope.tabs[2].disable = false;
	    	$scope.tabs[3].disable = true;
	    	$scope.tabsActive = 2;

	    	$scope.relLab.ingresoError = false;
	    	$scope.relLab.loading = true;
	    }
	    
	    /**
	     * Métodos de carga dinámica de datos
	     */

	    $scope.loadDataTrabajador = function (id_doc) {

	    	if(!id_doc || id_doc == "")
	    		return;
	    	
	    	$scope.trabajadorLoading = true;

	    	var _rut = "";
	    	var _dv = "";
	    	var _pasaporte = null;
	    	
	    	if($scope.trabajador.documentoIdentificador == "rut"){
	    		
	    		var split = id_doc.split("-");
	    		_rut = split[0];
	    		_dv  = split[1];
	    	} else {
	    		_pasaporte = id_doc;
	    	}
	    	
	    	RestClient.getDatosPersona(_rut, _dv, _pasaporte, function(dat){

	        	var _trabajador = new Trabajador(dat.rut,dat.dv,dat.pasaporte,dat.nombres,dat.apellidoPaterno,
	        			                         dat.apellidoMaterno,dat.idSexo,dat.fechaNacimiento,dat.email,dat.domicilio);

	        	_trabajador.setISAPRE(dat.idIsapre, $scope.ISAPRE);
	        	_trabajador.setAFP(dat.idAFP, $scope.AFP);
	        	_trabajador.setEstadoCivil(dat.idEstadoCivil, $scope.estadoCivil);
	        	_trabajador.setNacionalidad(dat.idNacionalidad, $scope.nacionalidades);
	        	
	        	$scope.trabajador = _trabajador;
		        
		        $scope.trabajadorLoading = false;
	    	});
	    };
	    
	    $scope.loadDataUsuario = function(idUsuario) {
	    	
	    	 var dat = RestClient.getDatosUsuario(idUsuario, function(){

	    		if(dat.rut) 
	    			$scope.empleador.rutUsuarioQueRegistra = dat.rut+"-"+dat.dv;
	    		else
	    			$scope.empleador.rutUsuarioQueRegistra = dat.pasaporte;
	    		
		        $scope.empleador.nombreCompletoUsuarioQueRegistra = dat.nombres+" "+dat.apellidoPaterno+" "+dat.apellidoMaterno;
	    	 });
	    };
	    
	    $scope.loadDataEmpresa = function(_rut, _dv){
	    	
	        var dat = RestClient.getDatosEmpresa(_rut,_dv, function(){
	        	
		        $scope.empleador.rut = dat.rutEmpresa
		        $scope.empleador.dv = dat.dvEmpresa;
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
	    	
	    	$scope.estadoCivil = RestClient.getEstadoCivil();
	        $scope.AFP = RestClient.getAFP();
	        $scope.ISAPRE = RestClient.getIsapre();
	        $scope.tipoContrato = RestClientRelacionLaboral.getTipoContrato();
	        $scope.labores = RestClientRelacionLaboral.getLabor();
	        $scope.funciones = RestClientRelacionLaboral.getFuncion();
	        $scope.tiposJornada = RestClientRelacionLaboral.getTipoJornada();
	        $scope.modalidadDePago = RestClientRelacionLaboral.getModalidadPago();
	        $scope.nacionalidades = RestClient.getNacionalidad();
	    	$scope.regiones = RestClient.getRegion();

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

	        $scope.loadDataEmpresa(session_data.rutEmpresa,session_data.dvEmpresa);
	        $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa);
	        $scope.loadDataUsuario(session_data.id);
	        
	        // get Término de Vigencia
	        RestClient.getTerminoVigencia(session_data.idEmpresa,1, function(data){
	        	$scope.empleador.terminoDeVigencia = data.fechavigencia;
	        });
	    };

	    $scope.googlemapsInit = function(){GoogleMapsAutoComplete(document.getElementById('domicilioGoogleMaps'));}
	    
	    // se llaman las funciones de inicialización dinámicas
	    $scope.init();
}])
