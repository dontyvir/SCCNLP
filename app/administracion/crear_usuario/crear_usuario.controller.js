'use strict';

angular.module('sccnlp.crear_usuario')

.controller('crearUsuarioCtrl', ['$scope', '$state', '$uibModal', 'sessionService','crear_usuarioMessages',
	function($scope, $state,  $uibModal, sessionService, crear_usuarioMessages) {
	
	$scope.messages = crear_usuarioMessages;
	$scope.USUARIO_RUT='';
	

	$scope.tablaUsuarios = [];
	
	$scope.confirmEliminar=false;
	
	$scope.agregarUsuario=function(){
			var nuevo= new function() {
            this.USUARIO_RUT =$scope.USUARIO_RUT;
            this.USUARIO_NOMBRES    = "nombre"+($scope.tablaUsuarios.length+1);
            this.USUARIO_APELLIDOS  = 'apellido'; 
	        };
			$scope.USUARIO_RUT="";
		 	$scope.tablaUsuarios.push(nuevo);
		 	console.log("agrego"+JSON.stringify($scope.tablaUsuarios));
	};
	
	$scope.getTableDatosUsuarios=function(){
		return $scope.tablaUsuarios;
	}

	$scope.eliminarUsuario = function(id) {
		$scope.tablaUsuarios.splice(id, 1);
    };

	$scope.generarClaveEmpresa = function() {
		alert("guardando"+JSON.stringify($scope.data.CLAVE_EMPRESA_DIRECCION_CM));
		$scope.trysubmit=true;
		//$scope.data.CLAVE_EMPRESA_RUT=$scope.data.CLAVE_EMPRESA_RUT==""
	};
	
} ])

/*
.controller('confirmacionModalCtrl', function($scope, $uibModalInstance, $rootScope) {

    $scope.ok = function() {
        console.log('fue OK');
        $uibModalInstance.close();
        $scope.confirmEliminar=true;

    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
        console.log('fue CANCELADO');
        $scope.confirmEliminar=false;
    };
});
*/