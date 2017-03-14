'use strict';

angular.module('sccnlp.clave_empresa')

.controller('claveEmpresaCtrl', ['$scope', '$state', 'sessionService','clave_empresaMessages',
	function($scope, $state, sessionService, clave_empresaMessages) {
	
	$scope.trysubmit=false;
	$scope.messages = clave_empresaMessages;
	$scope.data = {
        CLAVE_EMPRESA_RUT: "",
        
        CLAVE_EMPRESA_RAZON_SOCIAL:"esto es una prueba",
		CLAVE_EMPRESA_RAZON_SOCIAL_CHK:-1,

        CLAVE_EMPRESA_DIRECCION_CM: -1,
        CLAVE_EMPRESA_DIRECCION_CM_CHK: -1,

        CLAVE_EMPRESA_ACTIV_ECONOMICA: -1,
        CLAVE_EMPRESA_ACTIV_ECONOMICA_CHK: -1,

        CLAVE_EMPRESA_DATOS_REP_LEGAL:"",
        CLAVE_EMPRESA_DATOS_REP_LEGAL_CHK:-1,

        CLAVE_EMPRESA_RUT_REP_LEGAL:"",
        CLAVE_EMPRESA_RUT_REP_LEGAL_CHK:-1,

        CLAVE_EMPRESA_NOMBRE_REP_LEGAL:"",
        CLAVE_EMPRESA_NOMBRE_REP_LEGAL_CHK:-1,

        CLAVE_EMPRESA_FECHANAC_REP_LEGAL:"",
        CLAVE_EMPRESA_FECHANAC_REP_LEGAL_CHK:-1

    };

	
	$scope.listaDirecciones=[
							 {id:1, texto:'Direccion 1'},
							 {id:2, texto:'Direccion 2'}
							];

	$scope.listaActividades=[
							 {id:1, texto:'Actividad 1'},
							 {id:2, texto:'Actividad 2'}
							];							
	
	$scope.dataLoading = false;
	
	$scope.generarClaveEmpresa = function() {
		$scope.trysubmit=true;
		if($scope.validarDatos())
			alert("ok");
		else
			alert("NoOk");
		
	};
	
	
	$scope.validarDatos = function() {
		$scope.data.CLAVE_EMPRESA_RAZON_SOCIAL_CHK=$scope.data.CLAVE_EMPRESA_RAZON_SOCIAL_CHK==-1||$scope.data.CLAVE_EMPRESA_RAZON_SOCIAL_CHK==0?0:true;
		$scope.data.CLAVE_EMPRESA_DIRECCION_CM=$scope.data.CLAVE_EMPRESA_DIRECCION_CM==-1||$scope.data.CLAVE_EMPRESA_DIRECCION_CM==null?null:$scope.data.CLAVE_EMPRESA_DIRECCION_CM;
		$scope.data.CLAVE_EMPRESA_DIRECCION_CM_CHK=$scope.data.CLAVE_EMPRESA_DIRECCION_CM_CHK==-1||$scope.data.CLAVE_EMPRESA_DIRECCION_CM_CHK==0?0:true;
		$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA=$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA==-1||$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA==null?null:$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA;
        $scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA_CHK=$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA_CHK==-1||$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA_CHK==0?0:true;
		$scope.data.CLAVE_EMPRESA_RUT_REP_LEGAL_CHK=$scope.data.CLAVE_EMPRESA_RUT_REP_LEGAL_CHK==-1||$scope.data.CLAVE_EMPRESA_RUT_REP_LEGAL_CHK==0?0:true;
		$scope.data.CLAVE_EMPRESA_NOMBRE_REP_LEGAL_CHK=$scope.data.CLAVE_EMPRESA_NOMBRE_REP_LEGAL_CHK==-1||$scope.data.CLAVE_EMPRESA_NOMBRE_REP_LEGAL_CHK==0?0:true;
		$scope.data.CLAVE_EMPRESA_FECHANAC_REP_LEGAL_CHK=$scope.data.CLAVE_EMPRESA_FECHANAC_REP_LEGAL_CHK==-1||$scope.data.CLAVE_EMPRESA_FECHANAC_REP_LEGAL_CHK==0?0:true;
		if( $scope.data.CLAVE_EMPRESA_RUT=="" ||
			$scope.data.CLAVE_EMPRESA_RAZON_SOCIAL_CHK!=true ||
		   	!$scope.data.CLAVE_EMPRESA_DIRECCION_CM ||
			$scope.data.CLAVE_EMPRESA_DIRECCION_CM_CHK!=true ||
			!$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA ||
	        $scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA_CHK==null ||
			$scope.data.CLAVE_EMPRESA_RUT_REP_LEGAL_CHK!=true ||
			$scope.data.CLAVE_EMPRESA_NOMBRE_REP_LEGAL_CHK!=true ||
			$scope.data.CLAVE_EMPRESA_FECHANAC_REP_LEGAL_CHK!=true )
				 return false;
			return true;
	};
	
} ])