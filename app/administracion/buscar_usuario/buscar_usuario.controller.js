'use strict';

angular.module('sccnlp.buscar_usuario')

.controller('buscarUsuarioCtrl', ['$scope', '$state', '$uibModal', 'sessionService','buscar_usuarioMessages',
	function($scope, $state,  $uibModal, sessionService, buscar_usuarioMessages) {
	
	$scope.messages = buscar_usuarioMessages;
	$scope.RUT='';
	
	$scope.tablaUsuarios=[];
	$scope.usuarioSeleccionado = {};
	//$scope.tablaModulo=[];

	$scope.confirmEliminar=false;
	
	$scope.buscar=function(){
			var nuevo= new function() {
            this.RUT ='1';
            this.NOMBRES    = "nombre"+($scope.tablaUsuarios.length+1);
            this.APELLIDOS  = 'apellido'; 
            this.MODULOS	= [  {
            						nombreModulo:'Administracion',
            					 	seleccionado:true
            					 },
            					 {
            					 	nombreModulo:'Relacion laboral',
            					 	seleccionado:true
            					 }
            					];
            this.ACTIVO		= true;
	        };
			$scope.tablaUsuarios.push(nuevo);
		 	//console.log("agrego"+JSON.stringify($scope.tablaUsuarios));
	};
	
	$scope.getTableDatosUsuarios=function(){
		return $scope.tablaUsuarios;

	}

	$scope.modificar = function(id) {
		$scope.usuarioSeleccionado=$scope.tablaUsuarios[id];
		//.MODULOS;
		//alert("guardando"+JSON.stringify($scope.tablaModulo));
		var modalInstance = $uibModal.open({
                    templateUrl: 'administracion/buscar_usuario/buscar_usuario.modal.view.html',
                    controller: 'editarModulosCtrl',
                    resolve: {
        						mensajes: function () {
          						return $scope.messages;
        					 	},
        						usuarioSel: function () {
          						return $scope.usuarioSeleccionado;
        					 	},	
                    			size: function() {
          							//console.log('size: ', size);
         						 return 300;
       						 	}
       						 },
       				size: 'md'
                });
                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                });
    };

	$scope.generarClaveEmpresa = function() {
		
		$scope.trysubmit=true;
		//$scope.data.CLAVE_EMPRESA_RUT=$scope.data.CLAVE_EMPRESA_RUT==""
	};
	
} ])


.controller('editarModulosCtrl', function($scope, $uibModalInstance, $rootScope,mensajes,usuarioSel,size) {
	$scope.mensajes=mensajes;
	$scope.usuarioSel = usuarioSel;
	$scope.size = size;

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
