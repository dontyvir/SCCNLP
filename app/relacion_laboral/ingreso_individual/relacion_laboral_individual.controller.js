'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('RelIndividualCtrl', ['$scope', 'ingIndivMessages', '$uibModal', 'RestClient', 'sessionService','RegistrarContrato',
	
	function($scope, ingIndivMessages, $uibModal, RestClient, sessionService,RegistrarContrato) {
	
	$scope.messages = ingIndivMessages;
	
	$scope.ingresoIdNum = null;
	
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
			
			nombreCompleto : null,
			nacionalidad : null,
			fechaDeNacimiento : null,
			estadoCivil : null
			
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
    
    $scope.loadAcuerdoJornadaLaboral = function (datosLaborales) {

	    var modalInstance = $uibModal.open({

	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'relacion_laboral/acuerdo_jornada_laboral/acuerdo_jornada_laboral.modal.view.html',
	      controller: 'AcuerdoJornadaLaboralController',
	      controllerAs: '$ctrl',
	      resolve: {
	          datosLaborales: function () { return datosLaborales; }
	      }
	    });

	    modalInstance.result.then(function (acuerdos_jornada) {
	    	
	    	if(acuerdos_jornada.length == 0)
	    		datosLaborales.horario = null;
	    	else
		    	datosLaborales.horario = acuerdos_jornada;
	    	
	    }, function () {
	    	
	      console.log('Modal dismissed at: ' + new Date());
	    });
    };
    
    $scope.loadAcuerdoDescanso = function (datosLaborales){
    	
	    var modalInstance = $uibModal.open({

		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'relacion_laboral/acuerdo_colectivo_descanso/acuerdo_colectivo_descanso.modal.view.html',
		      controller: 'AcuerdoDescansoController',
		      controllerAs: '$ctrl',
		      resolve: {
		    	  _acuerdoActivo: function () { return datosLaborales.acuerdoDescanso; }
		      }
		    });

		    modalInstance.result.then(function (acuerdo_descanso) {
		    	
		    	if(!acuerdo_descanso)
		    		datosLaborales.acuerdoDescanso = null;
		    	else
		    		datosLaborales.acuerdoDescanso = acuerdo_descanso;
		    	
		    }, function () {
		    	
		      console.log('Modal dismissed at: ' + new Date());
		    });
	    };

	    $scope.clearDataTrabajador = function(){
			$scope.trabajador.nombreCompleto = null;
			$scope.trabajador.nacionalidad = null;
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
	    	
	    	$scope.ingresoIdNum = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    	
		    var modalInstance = $uibModal.open({

			      ariaLabelledBy: 'modal-title',
			      ariaDescribedBy: 'modal-body',
			      templateUrl: 'relacion_laboral/recordatorio_legal/recordatorio_legal.modal.view.html',
			      controller: 'RecordatorioLegalController',
			      controllerAs: '$ctrl'
			    });

			    modalInstance.result.then(function () {
			    	
			    	// registro del contrato
			    var _result = RegistrarContrato.registrar($scope.trabajador, $scope.empleador, $scope.contrato,
			    	function(response){
			    		
				    	//paso4
			    	    $scope.tabs[0].disable = true;
			    	    $scope.tabs[1].disable = true;
			    	    $scope.tabs[2].disable = true;
				    	$scope.tabs[3].disable = false;
				    	$scope.tabsActive = 3;
				    	
			    	});

			    }, function () {
			    	
			      console.log('Modal dismissed at: ' + new Date());
			    });
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

		        $scope.trabajador.nombreCompleto = data.nombres+" "+data.apellidoPaterno+" "+data.apellidoMaterno;
		        $scope.trabajador.nacionalidad = data.nombreNacionalidad;
		        $scope.trabajador.fechaDeNacimiento = new Date(data.fechaNacimiento);
		        $scope.trabajador.estadoCivil = data.estadoCivil;
		        $scope.trabajador.email = data.email;
		        $scope.trabajador.AFPSelected = data.idAFP;
		        $scope.trabajador.ISAPRESelected = data.idISAPRE;
		        
		        $scope.trabajadorLoading = false;
	    	});
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
	    	
	    	$scope.estadoCivil = RestClient.getEstadoCivil();
	        $scope.AFP = RestClient.getAFP();
	        $scope.ISAPRE = RestClient.getIsapre();
	        $scope.tipoContrato = RestClient.getTipoContrato();
	        $scope.labores = RestClient.getLabor();
	        $scope.funciones = RestClient.getFuncion();
	        $scope.tiposJornada = RestClient.getTipoJornada();
	        

	        $scope.modalidadDePago = [{id:1,glosa:"Diario"}]; //TODO: client
	        $scope.lugares = RestClient.getLocacion($scope.empleador.rutEmpleador);
	        
	        
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
}])
