'use strict';

angular.module('sccnlp.clave_empresa')

.controller('claveEmpresaCtrl', ['$scope', '$state','$filter', 'sessionService','clave_empresaMessages','restClaveEmpresa',
	function($scope, $state, $filter, sessionService, clave_empresaMessages,restClaveEmpresa) {
	$scope.RUT="";
	$scope.DV="";

	$scope.trysubmit=false;
	$scope.messages = clave_empresaMessages;
	$scope.data = {
        CLAVE_EMPRESA_ID:0,
        CLAVE_EMPRESA_RUT: "",
        
        CLAVE_EMPRESA_RAZON_SOCIAL:"",
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

$scope.senData = {
        idEmpresa:0,
        idUsuario:0,
        rutEmpresa:0,
        dvEmpresa:"",
        razonSocial:"",
        idCasaMatriz:0,
        direcciones:[],
        idActividadPrincipal:0,
        actividades:[],
        representante: { glosa :"",
        				 rut:0,
        				 dv:"",
        				 fechaInicRepr:"",
        				 fechaNacimiento:""  }

    };
	
	$scope.listaDirecciones=[
							 //{id:1, texto:'Direccion 1'},
							 //{id:2, texto:'Direccion 2'}
							];

	$scope.listaActividades=[
							 //{id:1, texto:'Actividad 1'},
							 //{id:2, texto:'Actividad 2'}
							];							
	
	$scope.dataLoading = false;
	
	$scope.getDatosEmpresa = function($event) {
		$scope.dataLoading = true;
		$scope.setRut_DV();
		restClaveEmpresa.query({RUT: $scope.RUT, DV: $scope.DV},
			function(promisedData) {
				if(promisedData.idEmpresa>0)
					fillData(promisedData);
				$scope.dataLoading = false;
			});
	};

	$scope.setRut_DV = function() {
		 var array = $scope.data.CLAVE_EMPRESA_RUT.split('-');
		 $scope.RUT=array[0];
		 $scope.DV=array[1];
	};

	function fillData(promisedData) {
			$scope.data.CLAVE_EMPRESA_ID = promisedData.IdEmpresa;
			$scope.data.CLAVE_EMPRESA_RAZON_SOCIAL=promisedData.razonSocial;
			$scope.listaDirecciones=promisedData.direcciones;
			$scope.listaActividades=promisedData.actividades;
			$scope.data.CLAVE_EMPRESA_RUT_REP_LEGAL=promisedData.representante.rut;
			$scope.data.CLAVE_EMPRESA_NOMBRE_REP_LEGAL=promisedData.representante.glosa;
			$scope.data.CLAVE_EMPRESA_FECHANAC_REP_LEGAL=promisedData.fechaNacimiento;
			$scope.data.CLAVE_EMPRESA_DIRECCION_CM=$filter('getById')($scope.listaDirecciones, promisedData.idCasaMatriz);
			$scope.data.CLAVE_EMPRESA_ACTIV_ECONOMICA=$filter('getById')($scope.listaActividades, promisedData.actividades);
		}


	$scope.generarClaveEmpresa = function() {
		if($scope.validarDatos())
		{
			restClaveEmpresa.save($scope.data,
				function(promisedData) {
					if(promisedData.idEmpresa>0)
						fillData(promisedData);
					$scope.dataLoading = false;
			});
		}
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