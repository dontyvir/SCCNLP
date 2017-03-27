angular.module('sccnlp.relacionLaboral.consulta',[ 'ui.router', 'sccnlp.common', 'sccnlp.session' ])

.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.consultaRelLab', {
		url : "/consultaRL",
		templateUrl : 'relacion_laboral/consulta/consulta.view.html',
		controller : 'ConsultaCtrl',
		controllerAs : 'consCtl'
	})
} ]);