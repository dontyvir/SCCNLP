'use strict';

angular.module('sccnlp.relacionLaboral.consulta')

.controller('ConsultaCtrl', ['$scope', 'consultaMessages', '$uibModal', 'RestClient','RestClientRelacionLaboral',
	        'sessionService','$resource', '$filter', 'ingIndivMessages','Trabajador','Empleador','Contrato',
	
	function($scope, consultaMessages, $uibModal, RestClient, RestClientRelacionLaboral,sessionService,
			$resource, $filter, ingIndivMessages, Trabajador,Empleador,Contrato) {
	
	$scope.messages = ingIndivMessages;
	angular.merge($scope.messages, consultaMessages);
		
	$scope.consultaLoading = false;

	/** modelos de datos edición **/
	
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
	
	// Model Ingreso Relación Laboral
	$scope.relLab = {
		
			loading : true,
			ingresada : false,
			ingresoError : false,
			errorMsg : null,
			data : null
	};
	
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
    
    $scope.popupFecIniCont = {opened : false};
    $scope.popupFecTerCont = {opened : false};
    
    $scope.openDatePicker = function (popup) {
		popup.opened = true;
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
    	$scope.consulta.documentoIdentificador = 'rut';
    	$scope.consulta.numDocIdentificador = null;
    	$scope.consulta.fechaDeInicioDelContrato = null;
    	$scope.consulta.fechaTerminoDelContrato = null;
    	$scope.consulta.estadoContrato = null;
    	$scope.consulta.resultados = null;
    }

    $scope.getRutOPasaporte = function(res){
    	
    	if(res.rutPersona && res.rutPersona!="")
    		return res.rutPersona+"-"+res.dvPersona;

    	return res.pasaporte;
    }
    
    $scope.exportarExcel = function(){
    	
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
    
    var loadDataEmpleador = function(empleadorData,terminoVigencia,userData){

		var dat = empleadorData;
        var rut = dat.rutEmpresa+"-"+dat.dvEmpresa;
        var nombre = dat.razonSocial;
        var tipo = dat.actividades[dat.idActividadPrincipal].glosaActividad;

        var domicilio = null;
        
        for(var i=0;i<dat.direcciones.length;i++){
        	if(dat.direcciones[i].esCasaMatriz)
    	        domicilio = dat.direcciones[i].calle+" "+dat.direcciones[i].numero;
        }
        
        // si ninguna dirección es casa matriz
        if(domicilio && dat.direcciones.length > 0)
        	domicilio = dat.direcciones[0].calle+" "+dat.direcciones[0].numero;
        
        var rutRepLegal = dat.representante.rut+"-"+dat.representante.dv;
        var nombreRepLegal = dat.representante.glosa;
        var emailRepLegal = dat.representante.email;
        var repLegal = new representanteLegal(rutRepLegal,nombreRepLegal,emailRepLegal);
        
		var empleador = new empleador(rut,nombre,tipo,domicilio,terminoVigencia,repLegal,userData.rut,userData.nombre);
        
        return empleador;
    }
    
    var loadDataContrato = function(contratoData){
    	
    	var dat = contratoData;

    	var _contrato = new Contrato(dat.fechaCelebContrato,dat.idTipoContrato,dat.fechaInicioContrato,
    			                    dat.fechaTerminoContrato,dat.idModalidad,dat.labores);
    	
    	return _contrato;
    }
    
    var loading = 10;

    var _count = function(){
    	
    	if(--loading==0){
    	
	    	$scope.trabajador = loadDataTrabajador($scope.datos.trabajador, $scope.AFP,$scope.ISAPRE, $scope.nacionalidades, $scope.estadoCivil);
	    	
	    	$scope.contrato = loadDataContrato($scope.datos);
	    	
	    	$scope.tabs[1].disable = false;
	    	$scope.tabsActive = 1;
    	}
    }
    
    // esto se llama al modificar un registro en la pantalla de consulta
    $scope.modificarContrato = function(relLab){

    	$scope.estadoCivil = RestClient.getEstadoCivil(_count);
        $scope.AFP = RestClient.getAFP(_count);
        $scope.ISAPRE = RestClient.getIsapre(_count);
        $scope.tipoContrato = RestClientRelacionLaboral.getTipoContrato(_count);
        $scope.labores = RestClientRelacionLaboral.getLabor(_count);
        $scope.funciones = RestClientRelacionLaboral.getFuncion(_count);
        $scope.tiposJornada = RestClientRelacionLaboral.getTipoJornada(_count);
        $scope.modalidadDePago = RestClientRelacionLaboral.getModalidadPago(_count);
        $scope.nacionalidades = RestClient.getNacionalidad(_count);

    	$scope.datos = RestClientRelacionLaboral.getDetalleRelacionLaboral(1,_count);
    	
    }
    
    $scope.ingresoContinue = function(nTab, form){
    	$scope.tabs[nTab].disable = false;
    	$scope.tabsActive = nTab;
    }

}]);
