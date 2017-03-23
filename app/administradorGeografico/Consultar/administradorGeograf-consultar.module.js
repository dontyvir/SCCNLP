var modulo = angular.module('sccnlp.administradorGeograf-consultar', [ 'ui.router', 'sccnlp.session','ngMap']);


modulo.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.administradorGeograf-consultar', {
		url : "/administradorGeografico/Consultar/adminGeografConsultar",
		templateUrl : 'administradorGeografico/Consultar/administradorGeograf-consultar.view.html',
		controller : 'AdministradorGeografConsultarCtrl',
		controllerAs : 'adminGeografConsultar'
	});
} ]);

