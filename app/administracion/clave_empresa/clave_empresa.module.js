angular.module('sccnlp.clave_empresa', [ 'ui.router', 'sccnlp.session' ])


.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.clave_empresa', {
		url : "/administracion/clave_empresa",
		templateUrl : 'administracion/clave_empresa/clave_empresa.view.html',
		controller : 'claveEmpresaCtrl',
		controllerAs : 'claveEmpresaCtrl'
	})
} ]);