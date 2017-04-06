'use strict';

// definición de módulo menu
angular.module('sccnlp.menu', ['sccnlp.session', 'ui.router'])

.controller('MenuCtrl', ['$scope', 'sessionService', '$state', 'menuMessages',
	function ($scope, sessionService, $state, menuMessages) {
	
	$scope.isCollapsed = true;
	
	$scope.messages = menuMessages; // conexión del servicio messages
	
	$scope.logout = function(){
		
		sessionService.logout();
		$state.go('login');
	}
	
	$scope.getUserName = function(){
		
		var userData = sessionService.getUserData();
		return userData.username;
	}
	
	$scope.getPuerto = function(){
		
		var userData = sessionService.getUserData();
		if(userData.puerto.id)
			return userData.puerto.glosa;
		
		return null;
	}
}])

