'use strict';

angular.module('sccnlp.login')

.controller('LoginCtrl', ['$scope', '$state', 'sessionService','loginMessages','RestClient',
	function($scope, $state, sessionService, loginMessages,RestClient) {
	
	$scope.messages = loginMessages;
	
	$scope.dataLoading = false;
	
	$scope.loginData = {username: null, password: null};
	
	$scope.userData = null;
	
	$scope.isLoggedIn = false;

	$scope.puertos = null;
	
	$scope.loginClaveUnica = function(){

	}
	
	$scope.redirectMain = function(){

		sessionService.savePuerto($scope.userData.puerto);
		$state.go('main.composite');		
	}
	
	$scope.ingresarClaveEmpresa = function() {
		
		$scope.dataLoading = true;
		
		sessionService.login_empresa($scope.loginData.username, $scope.loginData.password,
		function(loginSuccessful, error_data){
			
			$scope.dataLoading = false;
			
			if(loginSuccessful){

				$scope.puertos = RestClient.getPuerto(function(){ // esperamos hasta cargar los puertos
					$scope.userData = sessionService.getUserData();
					$scope.isLoggedIn = true;
				});
			}
			else {

				if(error_data){
					
					if(error_data.error_description)
						$scope.alert.show(error_data.error_description);
					else
						$scope.alert.show("Error : status: "+error_data.status+", favor intentar nuevamente");

				}
				else {
					$scope.alert.show("Error: favor intentar nuevamente");
				}
			}
		});
	};
	
	//funciones para mostrar la alerta
	
	$scope.alert = {
			msg : null,
			active : false,
			type : 'danger',
			
			close : function(){
				
				$scope.alert.active = false;
				$scope.alert.msg = null;
				
			},
			show : function(_msg, _type){
				
				$scope.alert.msg = _msg;
				if(_type)
					$scope.alert.type = _type;
				$scope.alert.active = true;
			}
	};
	
	if(sessionService.isLoggedIn()){ // si el usuario ya está logeado, redireccionar
		$state.go('main.composite');
	}
	
} ])