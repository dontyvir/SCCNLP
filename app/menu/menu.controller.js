'use strict';

// definición de módulo menu
angular.module('sccnlp.menu', ['sccnlp.session', 'ui.router'])

.controller('MenuCtrl', ['$scope', 'sessionService', '$state', 'menuMessages',
	function ($scope, sessionService, $state, menuMessages) {
	
	$scope.messages = menuMessages; // conexión del servicio messages
	
	$scope.logout = function(){
		
		sessionService.logout();
		$state.go('login');
	}
	
	$scope.getUserName = function(){
		
		$scope.userData = sessionService.getUserData();
		return $scope.userData.username;
	}
}])

