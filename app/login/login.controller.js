'use strict';

angular.module('sccnlp.login', [ 'ui.router', 'sccnlp.session' ])


.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('login', {
		url : "/login",
		templateUrl : 'login/login.view.html',
		controller : 'LoginCtrl',
		controllerAs : 'logctl'
	})
} ])


.controller('LoginCtrl', ['$scope', '$state', 'sessionService','loginMessages',
	function($scope, $state, sessionService, loginMessages) {
	
	$scope.messages = loginMessages;
	
	if(sessionService.isLoggedIn()){ // si el usuario ya está logeado, redireccionar
		$state.go('main.composite');
	}
	
	$scope.dataLoading = false;
	
	$scope.ingresarClaveEmpresa = function() {
		
		$scope.dataLoading = true;
		
		sessionService.login_empresa($scope.loginData.username, $scope.loginData.password, function(loginSuccessful){
			
			$scope.dataLoading = false;
			if(loginSuccessful)
				$state.go('main.composite');
			else {
				$state.go('login');
				$scope.alert.show("Error : usuario o clave incorrecta"); //TODO: mensajes de error
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
				$scope.alert.show = true;
			}
	};
	
} ])