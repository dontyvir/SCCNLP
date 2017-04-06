angular.module('sccnlp.relacionLaboral.ingresoMasivo',[ 'ui.router', 'sccnlp.common', 'sccnlp.session','angularFileUpload'])

.config([ '$stateProvider', function($stateProvider) {

	$stateProvider.state('main.composite.relmasiva', {
		url : "/relmasiva",
		templateUrl : 'relacion_laboral/ingreso_masivo/ingreso_masivo.view.html',
		controller : 'RelMasivoCtrl',
		controllerAs : 'relMasCtl'
	})
} ])
