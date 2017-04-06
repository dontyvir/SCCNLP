'use strict';

angular.module('sccnlp.relacionLaboral.consulta')

.controller('ConsultaCtrl', ['$scope', 'consultaMessages', '$uibModal', 'RestClient','RestClientRelacionLaboral',
	        'sessionService','$resource', '$filter', 'ingIndivMessages','Trabajador','Empleador','Contrato','Domicilio',
	        'Labor','loadAcuerdoJornadaLaboral','loadAcuerdoDescanso','ModalEsperaCarga','RegistrarContrato',
	        'GoogleMapsAutoComplete','LoadDataEmpleador','ConfirmacionGuardado',
	
	function($scope, consultaMessages, $uibModal, RestClient, RestClientRelacionLaboral,sessionService,
			$resource, $filter, ingIndivMessages, Trabajador,Empleador,Contrato,Domicilio,Labor,loadAcuerdoJornadaLaboral,
			loadAcuerdoDescanso,ModalEsperaCarga,RegistrarContrato,GoogleMapsAutoComplete,LoadDataEmpleador,
			ConfirmacionGuardado) {
	
	$scope.messages = ingIndivMessages;
	angular.merge($scope.messages, consultaMessages);

	$scope.consultaLoading = false;
	
    $scope.loadAcuerdoJornadaLaboral = loadAcuerdoJornadaLaboral;
    $scope.loadAcuerdoDescanso = loadAcuerdoDescanso;
    
    // flag para desactivar campos en tab3
    $scope.isEdit = true;
    $scope.editLoading = false; //cargando datos para edición
    $scope.fechaTerminoDisabled = function(){return true;}

	/** modelos de datos edición **/
	
	$scope.ingresoIdNum = null;
	
	//tabs
	$scope.terminoContratoTooltip = false;
	$scope.trabajadorLoading = false;
	$scope.empresaLoading = true;
	$scope.tabsActive = 0;
	$scope.ingresoMinimo = null;
	$scope.tabs = [
		{disable : false}, //tab datos de la empresa
	    {disable : true}, // tab datos del trabajador
	    {disable : true}, // tab datos del contrato
	    {disable : true},  // tab finalización del proceso
	    {disable : true}  // tab finalizar rel lab
	]
	$scope.modificarRL = false; // muestra pestañas modificación de RL
	$scope.finalizarRL = false; // muestra pestañas finalización de RL
	
	$scope.popupFecTermRL = {opened:false};
	
	// Model Ingreso Relación Laboral
	$scope.relLab = {
		
			loading : true,
			ingresada : false,
			finalizada : false,
			modificada : false,
			ingresoError : false,
			errorMsg : null,
			errorTitle : 'Error al procesar la solicitud',
			data : null
	};
	
	$scope.terminoRL = {idCausal : null, fecha: null};
	
	// prototipo consulta
	
	function Consulta(docId, numDocId, fecIniContrato,fecTerContrato,estadoContrato){
		
		if(!docId)
			this.documentoIdentificador = 'rut';
		else this.documentoIdentificador = docId;
		
		this.numDocIdentificador = numDocId;
		this.fechaDeInicioDelContrato = fecIniContrato;
		this.fechaTerminoDelContrato = fecTerContrato;
		this.estadoContrato = estadoContrato;
		this.resultados = null;
		this.editLoading = false;
	}
    
	$scope.empleador = new Empleador();
	
	$scope.trabajador = new Trabajador('rut');
		
	$scope.contrato = new Contrato();
	
	$scope.dataRelLab = null;
	
	$scope.consulta = new Consulta();
	
	/** fin modelos de datos edición **/

	$scope.dateFormat = 'dd/MM/yyyy';
	$scope.serviceFormat = 'yyyy/MM/dd';
	
    $scope.dateOptions = {
    	    formatYear: 'yy',
    	    maxDate: new Date(2020, 5, 22),
    	    startingDay: 1
    	  };

    $scope.loadData = function(consulta){
    	
    	var _rut = null;
    	var _pasaporte = null;
    	
    	
    	if(consulta.numDocIdentificador){
    	
	    	if(consulta.documentoIdentificador == 'pasaporte') {
	    		_pasaporte = consulta.numDocIdentificador;
	    		_rut = "";
	    	}
	    	else {
	    		_rut = consulta.numDocIdentificador.split("-")[0];
	    		_pasaporte = "";
	    	}
	    	
    	}
    	var fechaInicioContrato = $filter('date')(consulta.fechaDeInicioDelContrato,$scope.serviceFormat)||"";
    	var fechaFinContrato = $filter('date')( consulta.fechaTerminoDelContrato,$scope.serviceFormat)||"";
    	var estadoContrato = consulta.estadoContrato||"";
    	var sessData = sessionService.getUserData();
    	
    	$scope.consultaLoading = true;

    	RestClientRelacionLaboral.consultarRelacionLaboral(sessData.rutEmpresa, _rut, _pasaporte, fechaInicioContrato,
    										fechaFinContrato, estadoContrato, function(data){
    		
        	$scope.consultaLoading = false;
    		
    		if(data[0].error && data[0].error != ""){
    			//ERROR
    			console.log(data[0].error);
    			return;
    		}
    		
    		consulta.resultados = data;
    	});
    	
    }
    
    $scope.cleanData = function(){
    	$scope.consulta = new Consulta();
    }
    
    $scope.exportarExcel = function(){
    	
    }

    
    /** métodos pantallas de edición **/
    
    // limpieza solamente de campos editables
    
    $scope.limpiarTrabajador = function(){
    	$scope.trabajador.email = null;
    	$scope.trabajador.AFP = null;
    	$scope.trabajador.ISAPRE = null;
    	$scope.trabajador.domicilio = new Domicilio();
    }

    $scope.limpiarContrato = function(){
    	
    }
    
    $scope.ingresoCancelar = function(){

    	$scope.datos = null;
    	$scope.trabajador = null;
    	$scope.contrato = null;
    	
    	$scope.tabsActive = 0;
    	$scope.tabs[1].disable = true;

    }
    
    var loadDataTrabajador = function (datosTrabajador, listAFP, listISAPRE, listNacionalidad, listEstadoCivil) {

    	if(!datosTrabajador || !listAFP|| !listISAPRE||!listNacionalidad||!listEstadoCivil)
    		return;

    	var dat = datosTrabajador;
    	

    	var _trabajador = new Trabajador(dat.rut,dat.dv,dat.pasaporte,dat.nombres,dat.apellidoPaterno,
    			                         dat.apellidoMaterno,dat.idSexo,dat.fechaNacimiento,dat.email,dat.domicilio);

    	_trabajador.setISAPRE(dat.idIsapre, listISAPRE);
    	_trabajador.setAFP(dat.idAFP, listAFP);
    	_trabajador.setEstadoCivil(dat.idEstadoCivil, listEstadoCivil);
    	_trabajador.setNacionalidad(dat.idNacionalidad, listNacionalidad);

    	return _trabajador;
    };
    
    var loadDataContrato = function(contratoData){
    	
    	var dat = contratoData;

    	var _contrato = new Contrato(dat.idContrato, dat.fechaCelebContrato,dat.idTipoContrato,dat.fechaInicioContrato,
    			                    dat.fechaTerminoContrato,dat.idModalidad,dat.labores, true);
    	
    	return _contrato;
    }
    
    $scope.addRow = function () {
    	
    	var id = $scope.contrato.labores.length;
    	$scope.contrato.labores.push(new Labor(id));
    };
    
    /** usado en la tabla de resultados de contratos **/
    $scope.getRutOPasaporte = function(data){
    	if(data.rutPersona && data.rutPersona != "")
    		return data.rutPersona+"-"+data.dvPersona;
    	
    	return data.pasaporte;
    }

    /** al cambiar de región se recarga la lista de comunas **/
    $scope.cambioRegion = function(){
    	$scope.comunas = RestClient.getComunasByIdRegion($scope.trabajador.domicilio.idRegion);
    }
    
    $scope.validateFechaTerminoContrato = function(){
    	
    	if(!$scope.contrato.fechaTerminoContrato ||
    		!$scope.contrato.fechaInicioContrato) {
    		
    		$scope.terminoContratoTooltip = false;    		
    		return true;    		
    	}

    	
    	if($scope.contrato.fechaInicioContrato.getTime() > 
    		$scope.contrato.fechaTerminoContrato.getTime())
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
    
    $scope.ingresoSubmit = function(form){
    	
    	if(form && form.$invalid){
    		return;
    	}
    	
    	if(!$scope.validateFechaTerminoContrato)
    		return;
    	
    	if(!$scope.validateHorariosAcuerdos())
    		return;
    	
    	//Validación ingreso mínimo eventual con CPPT
    	if($scope.contrato.idTipoContrato == 3){
    		if($scope.contrato.total > $scope.ingresoMinimo.valor){
    			return; //TODO: visualizar error en pantalla
    		}
    	}

    	//Modal de confirmar Modificación
	    var modalInstance = ConfirmacionGuardado("Modificar Relación Laboral",
	    		"Se han modificado los datos de la relación laboral con el trabajador : "+
	    		$scope.trabajador.nombres+" "+$scope.trabajador.apellidoPaterno);

		    modalInstance.result.then(function () {
		    
		    	//paso4
	    	    $scope.tabs[0].disable = true;
	    	    $scope.tabs[1].disable = true;
	    	    $scope.tabs[2].disable = true;
		    	$scope.tabs[3].disable = false;
		    	$scope.tabsActive = 3;

		    	var user_data = sessionService.getUserData();

		    	var modal_carga = ModalEsperaCarga();

		    	// registro del contrato
		    	var _result = RegistrarContrato.actualizar(user_data.id, user_data.rutEmpresa,user_data.dvEmpresa,
		    			                                   $scope.trabajador, $scope.contrato,
		    		function(response){
		    		
		    		modal_carga.close(true);
		    		
		    		if(response[0].error == ""){
		    			
		    			$scope.relLab.data = response[0];
		    			$scope.relLab.ingresada = true;
		    			
		    		} else {
		    			$scope.relLab.ingresoError = true;
		    			$scope.relLab.errorMSG = response[0].error;
		    		}
		    		
		    			
		    	}, function(error){
		    		
		    		modal_carga.close(false);
		    		
		    		$scope.relLab.ingresoError = true;
		    		$scope.relLab.errorMSG = error.message;
		    	});

		    }, function () {
		    	
		      console.log('Modal dismissed at: ' + new Date());
		    });
    }
    
    $scope.updateTotal = function () {

    	var total = 0;
    	var length = $scope.contrato.labores.length;
    	
    	for(var i=0; i < length; i++) {
    		
    		var remun = $scope.contrato.labores[i].remunBruta;
    		if(remun && !isNaN(remun))
    		total += remun;
    	}
    	
    	$scope.contrato.total = total;
    };
    
    /** esperamos a que las listas se hayan cargado para continuar **/
    var loading = null;
    var _count_callback_fn = null;
    var _count = function(){

    	if(--loading==0){
    	
	    	$scope.trabajador = loadDataTrabajador($scope.datos.trabajador, $scope.AFP,$scope.ISAPRE, $scope.nacionalidades, $scope.estadoCivil);
	    	
	    	$scope.contrato = loadDataContrato($scope.datos);
	    	
	    	if($scope.datos.trabajador.domicilio)
	    		$scope.comunas = RestClient.getComunasByIdRegion($scope.datos.trabajador.domicilio.idRegion);
	    	
	    	_count_callback_fn();
    	}
    }
    
    var cargaData = function(relLab){
    	
    	loading = 13;
    	
        var session_data = sessionService.getUserData();
    	
    	$scope.estadoCivil = RestClient.getEstadoCivil(_count);
        $scope.AFP = RestClient.getAFP(_count);
        $scope.ISAPRE = RestClient.getIsapre(_count);
        $scope.tipoContrato = RestClientRelacionLaboral.getTipoContrato(_count);
        $scope.labores = RestClientRelacionLaboral.getLabor(_count);
        $scope.funciones = RestClientRelacionLaboral.getFuncion(_count);
        $scope.tiposJornada = RestClientRelacionLaboral.getTipoJornada(_count);
        $scope.modalidadDePago = RestClientRelacionLaboral.getModalidadPago(_count);
        $scope.nacionalidades = RestClient.getNacionalidad(_count);
    	$scope.regiones = RestClient.getRegion(_count);
        $scope.lugares = RestClient.getLocacion(session_data.rutEmpresa,_count);
    	$scope.ingresoMinimo = RestClient.getIngresoMinimoMensual(_count);
    	$scope.datos = RestClientRelacionLaboral.getDetalleContrato(relLab.idContrato,_count);
    }
    
    // esto se llama al modificar un registro en la pantalla de consulta
    $scope.modificarContrato = function(relLab){

    	$scope.editLoading = true;
    	relLab.editLoading = true;
    	$scope.modificarRL = true;
    	    	
        _count_callback_fn = function(){
	    	$scope.tabs[1].disable = false;
	    	$scope.tabsActive = 1;
	    	
	    	$scope.editLoading = false;
	    	relLab.editLoading = false;
        }
        
        cargaData(relLab);

    	var componentForm = {
	        street_number: 'numero',
	        route: 'calle'
	        //locality: 'block', // comuna
	        //administrative_area_level_1: '' // región
    	};
    	var autocomplete = GoogleMapsAutoComplete(document.getElementById('domicilioGoogleMaps'), componentForm);
    }
    
    $scope.ingresoContinue = function(nTab, form){
    	$scope.tabs[nTab].disable = false;
    	$scope.tabsActive = nTab;
    }
    
    $scope.loadDataUsuario = function(idUsuario) {
    	
   	 var dat = RestClient.getDatosUsuario(idUsuario, function(){

   		if(dat.rut) 
   			$scope.empleador.rutUsuarioQueRegistra = dat.rut+"-"+dat.dv;
   		else
   			$scope.empleador.rutUsuarioQueRegistra = dat.pasaporte;
   		
	        $scope.empleador.nombreCompletoUsuarioQueRegistra = dat.nombres+" "+dat.apellidoPaterno+" "+dat.apellidoMaterno;
   	 });
   };
   
    $scope.finalizarRelLab = function(relLab){
    	
    	$scope.modificarRL = false;
    	$scope.finalizarRL = true;
    	
        _count_callback_fn = function(){
        	
	    	$scope.tabs[4].disable = false;
	    	$scope.tabsActive = 4;
	    	
	    	$scope.editLoading = false;
	    	relLab.editLoading = false;
        }
        
        var user_data = sessionService.getUserData();
        
        $scope.empleador = LoadDataEmpleador();
        
        $scope.loadDataUsuario(user_data.id);
        
        $scope.causalesTerm = RestClient.getCausalTermino();
        
        cargaData(relLab);

    }
    
    $scope.submitFinalizarRL = function(){

    	//Modal de confirmar Modificación
	    var modalInstance = ConfirmacionGuardado("Finalizar Relación Laboral",
	    		"Usted ha seleccionado finalizar la relación laboral con el trabajador : "+
	    		                                 $scope.trabajador.nombres+" "+$scope.trabajador.apellidoPaterno);

		    modalInstance.result.then(function () {
		    
		    	//paso4
		    	$scope.tabs[4].disable = false;
		    	$scope.tabsActive = 5;

		    	var user_data = sessionService.getUserData();

		    	var modal_carga = ModalEsperaCarga();

		    	// registro del contrato
		    	var _result = RestClientRelacionLaboral.finalizarRelacionLaboral({
		    		rutEmpresa : user_data.rutEmpresa,
		    		idContrato: $scope.contrato.id,
		    		idCausalTermino: $scope.terminoRL.idCausal,
		    		idUsuario: user_data.id,
		    		fechaTermino: $scope.terminoRL.fecha
		    	},
		    		function(response){
		    		
		    		modal_carga.close(true);
		    		
		    		if(response[0].error == ""){
		    			
		    			$scope.relLab.data = response[0];
		    			$scope.relLab.finalizada = true;
		    			
		    		} else {
		    			$scope.relLab.ingresoError = true;
		    			$scope.relLab.errorMSG = response[0].error;
		    		}
		    		
		    			
		    	}, function(error){
		    		
		    		modal_carga.close(false);
		    		
		    		$scope.relLab.ingresoError = true;
		    		$scope.relLab.errorMSG = error.message;
		    	});

		    }, function () {
		    	
		      console.log('Modal dismissed at: ' + new Date());
		    });
    }

}]);
