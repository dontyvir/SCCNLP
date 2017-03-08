angular.module('sccnlp.relacionLaboral.ingresoIndividual', [ 'ui.router' ])

.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.relindividual', {
		url : "/relindividual",
		templateUrl : 'relacion_laboral/ingreso_individual/relacion_laboral_individual.view.html',
		controller : 'RelIndividualCtrl',
		controllerAs : 'relIndCtl'
	})
} ]);