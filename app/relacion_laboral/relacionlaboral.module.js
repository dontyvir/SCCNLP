'use strict';

angular.module('sccnlp.relacionlaboral',
		[ 'ngResource', 'ui.router' ])
		
.config(['$stateProvider', function($stateProvider) {
	
	$stateProvider
	.state('main.composite.relacionlaboral',{
		url : '/relacionlaboral',
		templateUrl : 'relacionlaboral/relacionlaboral.view.html'
	})
}])
