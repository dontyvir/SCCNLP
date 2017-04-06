angular.module('sccnlp.buscar_usuario', [ 'ui.router', 'sccnlp.session','ui.bootstrap.pagination' ])


.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.buscar_usuario', {
		url : "/administracion/buscar_usuario",
		templateUrl : 'administracion/buscar_usuario/buscar_usuario.view.html',
		controller : 'buscarUsuarioCtrl',
		controllerAs : 'buscarUsuarioCtrl'
	})
} ]);