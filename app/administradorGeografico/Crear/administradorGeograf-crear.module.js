var modulo = angular.module('sccnlp.administradorGeograf-crear', [ 'ui.router', 'sccnlp.session','ngMap']);


modulo.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.administradorGeograf-crear', {
		url : "/administradorGeografico/Crear/adminGeografCrear",
		templateUrl : 'administradorGeografico/Crear/administradorGeograf-crear.view.html',
		controller : 'AdministradorGeografCrearCtrl',
		controllerAs : 'adminGeografCrear'
	});
} ]); 

