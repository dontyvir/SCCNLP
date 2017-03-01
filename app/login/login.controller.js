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

	.controller('LoginCtrl', ['$scope', '$state', 'sessionService', function($scope, $state, sessionService) {
		
		$scope.dataLoading = false;
		
		$scope.ingresarClaveEmpresa = function() {
			
			$scope.dataLoading = true;
			
			sessionService.login_empresa($scope.loginData.username, $scope.loginData.password, function(loginSuccessful){
				
				$scope.dataLoading = false;
				if(loginSuccessful)
					$state.go('main.composite');
				else {
					$state.go('login');
					//TODO: mensaje de error
				}
			});
			
		};
		
	} ])