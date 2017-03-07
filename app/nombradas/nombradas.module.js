'use strict';

angular.module('sccnlp.nombradas',['ui.router', 'sccnlp.session'])

.config(['$stateProvider', function($stateProvider) {
	
	$stateProvider
	
	.state('login2',{
		url : '/login2',
		templateUrl : 'login/login2.view.html',
		data: { requiresLogin: true }
	})
}])