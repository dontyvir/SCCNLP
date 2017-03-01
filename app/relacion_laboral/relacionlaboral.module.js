'use strict';

angular.module('sccnlp.ingresoRL',
		[ 'ngResource', 'ui.router' ])
		
.config(['$stateProvider', function($stateProvider) {
	
	$stateProvider
	.state('main.composite.ingresoRL',{
		url : '/consultaRelacionLaboral',
		templateUrl : 'relacion_laboral/relacionlaboral.view.html',
		controller : 'RelacionLaboralController',
		controllerAs : 'relabCtl'
	})
}])
