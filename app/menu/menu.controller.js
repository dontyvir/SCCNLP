'use strict';

// referenciamos al módulo padre sccnlp.main
angular.module('sccnlp.main')

.config(function($stateProvider) {


})

.controller('MenuCtrl', ['$scope', 'sessionService', '$state', function ($scope, sessionService, $state) {
	
	$scope.logout = function(){
		
		sessionService.logout();
		$state.go('login');
	}
	
	$scope.getUserName = function(){
		$scope.userData = sessionService.getUserData();
		return $scope.userData.username;
	}
}])


