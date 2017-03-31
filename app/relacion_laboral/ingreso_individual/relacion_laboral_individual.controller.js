'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('RelIndividualCtrl', ['$scope', 'ingIndivMessages', '$uibModal', 'RestClient',
	                              'RestClientRelacionLaboral', 'sessionService','RegistrarContrato',
	                              'loadAcuerdoDescanso', 'loadAcuerdoJornadaLaboral',
	
	function($scope, ingIndivMessages, $uibModal, RestClient, RestClientRelacionLaboral,
			 sessionService, RegistrarContrato,loadAcuerdoDescanso,loadAcuerdoJornadaLaboral) {
	
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
	
    // Datos del trabajador Model
	
	$scope.trabajador = {
		
			loading : false, // flag para elemento en pantalla

			AFPSelected : null,
			ISAPRESelected : null,
			domicilio : null,
			email : null,
			documentoIdentificador : 'rut', // opción por defecto
			numDocIdentificador : null,
			sexo : {id:null,glosa:null},
			nombres : null,
			apellidos : null,
			nacionalidad : {id:null, glosa:null},
			fechaDeNacimiento : null,
			estadoCivil : {id:null,glosa:null},
			
	};
	
	
	// prototipo datos Labores
	
	function DatosLabores(_id) {
		
		this.id = _id,
		this.laborSelect = null;
		this.funcionSelect = null;
		this.lugarPrestacionServicios = null;
		this.horario = null;
		this.acuerdoDescanso = null;
		this.remunBruta = null;
		this.tipoJornada = null;
		this.acuerdoEmpty = true;
		this.horarioEmpty = true;
		
	}
	
	// información del contrato Model
	
	$scope.contrato = {
			
		    lugarDeCelebracionDelContrato : null,
		    fechaDeCelebracionDelContrato : null,
		    tipoContratoSelected : null,
		    fechaDeInicioDelContrato : null,
		    fechaTerminoDelContrato : null,
		    diaDePagoSelected : null,
		    total : 0,
		    datosLabores : [new DatosLabores(0)]
			
	};
	
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
    	
    	for(var i=0;i<$scope.contrato.datosLabores.length;i++){
    		
    		var lab = $scope.contrato.datosLabores[i];
    		
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
    
    $scope.addRow = function () {
    	    	
    	var id = $scope.contrato.datosLabores.length;
    	$scope.contrato.datosLabores.push(new DatosLabores(id));
    };
    
    $scope.deleteRow = function(rowModel) {
    	
    	if(!confirm($scope.messages.estaSeguro))
    		return;

    	var datos = $scope.contrato.datosLabores;
    	
    	datos.splice(rowModel.id, 1); // remove 1 element from index rowModel.id
    	
    	for(var i=rowModel.id;i<datos.length;i++){
    		datos[i].id--;
    	}
    	
    	if(datos.length == 0)
    		$scope.addRow();
    }

    $scope.updateTotal = function () {

    	var total = 0;
    	var length = $scope.contrato.datosLabores.length;
    	
    	for(var i=0; i < length; i++) {
    		
    		var remun = $scope.contrato.datosLabores[i].remunBruta;
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
	    	
	    	$scope.ingresoIdNum = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    	
		    var modalInstance = $uibModal.open({

			      ariaLabelledBy: 'modal-title',
			      ariaDescribedBy: 'modal-body',
			      templateUrl: 'relacion_laboral/recordatorio_legal/recordatorio_legal.modal.view.html',
			      controller: 'RecordatorioLegalController',
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
			    	var _result = RegistrarContrato.registrar(user_data.id, $scope.trabajador, $scope.empleador, $scope.contrato,
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
	    	
	    	RestClient.getDatosPersona(_rut, _pasaporte, function(data){

	    		for(var i=0;i<$scope.AFP.length;i++){
	    			if($scope.AFP[i].id == data.idAFP)
	    				$scope.trabajador.AFPSelected = $scope.AFP[i];
	    		}
	    		
	    		for(var i=0;i<$scope.ISAPRE.length;i++){
	    			if($scope.ISAPRE[i].id == data.idISAPRE)
	    				$scope.trabajador.ISAPRESelected = $scope.ISAPRE[i];
	    		}
	    		
	    		
	    		if(data.idSexo && data.idSexo == 2)
	    			$scope.trabajador.sexo = {id: 2, glosa: "Femenino"};
	    		else
	    			$scope.trabajador.sexo = {id: 1, glosa: "Masculino"};
	    		
		        $scope.trabajador.nombres = data.nombres;
		        $scope.trabajador.apellidos = data.apellidoPaterno+" "+data.apellidoMaterno;
		        $scope.trabajador.nacionalidad = {id: data.idNacionalidad,glosa: data.nombreNacionalidad};
		        $scope.trabajador.fechaDeNacimiento = new Date(data.fechaNacimiento);
		        $scope.trabajador.estadoCivil = {id: data.idEstadoCivil, glosa: data.estadoCivil};
		        $scope.trabajador.email = data.email;
		        
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
	    	
	    	$scope.estadoCivil = RestClient.getEstadoCivil();
	        $scope.AFP = RestClient.getAFP();
	        $scope.ISAPRE = RestClient.getIsapre();
	        $scope.tipoContrato = RestClientRelacionLaboral.getTipoContrato();
	        $scope.labores = RestClientRelacionLaboral.getLabor();
	        $scope.funciones = RestClientRelacionLaboral.getFuncion();
	        $scope.tiposJornada = RestClientRelacionLaboral.getTipoJornada();
	        $scope.modalidadDePago = RestClientRelacionLaboral.getModalidadPago();
	        $scope.nacionalidades = RestClient.getNacionalidad();

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
	        $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa);
	        $scope.loadDataUsuario(session_data.id);
	        
	        // get Término de Vigencia
	        RestClient.getTerminoVigencia(session_data.idEmpresa,1, function(data){
	        	$scope.empleador.terminoDeVigencia = data.fechavigencia;
	        });
	    };

	    $scope.googlemapsInit = function(){
	    	
	        // inicialización google maps autocompletar
	        
	        var defaultBounds = new google.maps.LatLngBounds(
	        		  new google.maps.LatLng(-33.8902, 151.1759),
	        		  new google.maps.LatLng(-33.8474, 151.2631));

    		var input = document.getElementById('domicilioGoogleMaps');
    		var options = {
    		 // bounds: defaultBounds,
    		  types: ['address']
    		};

    		var autocomplete = new google.maps.places.Autocomplete(input, options);
	    }
	    
	    // se llaman las funciones de inicialización dinámicas
	    $scope.init();
}])
