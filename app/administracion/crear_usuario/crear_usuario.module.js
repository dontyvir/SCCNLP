angular.module('sccnlp.crear_usuario', [ 'ui.router', 'sccnlp.session' ])


.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.crear_usuario', {
		url : "/administracion/crear_usuario",
		templateUrl : 'administracion/crear_usuario/crear_usuario.view.html',
		controller : 'crearUsuarioCtrl',
		controllerAs : 'crearUsuarioCtrl'
	})
} ]);