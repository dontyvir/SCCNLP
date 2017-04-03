angular.module('sccnlp.login', [ 'ui.router', 'sccnlp.session','sccnlp.common' ])


.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('login', {
		url : "/login",
		templateUrl : 'login/login.view.html',
		controller : 'LoginCtrl',
		controllerAs : 'logctl'
	})
} ]);