'use strict';

angular.module('sccnlp.jornadas', ['ui.router', 'ui.bootstrap', 'sccnlp.common', 'sccnlp.session'])

.config(['$stateProvider', function($stateProvider) {

    $stateProvider

    .state('main.composite.jornadas_individual', {
        url: "/jornadas_individual",
        templateUrl: 'jornadas/ingreso_individual/jornadas_individual.view.html',
        controller: 'jornadasIndividualCtrl',
        controllerAs: 'jorIctl'
    })

    .state('main.composite.jornadas_masiva', {
        url: "/jornadas_masiva",
        templateUrl: 'jornadas/ingreso_masivo/jornadas_masiva.view.html',
        controller: 'JornadasMasivaCtrl',
        controllerAs: 'jorMctl'
    })

    .state('main.composite.jornadas_consultar', {
        url: "/jornadas_consultar",
        templateUrl: 'jornadas/consulta/jornadas_consultar.view.html',
        controller: 'jornadasConsultarCtrl',
        controllerAs: 'jorCctl'
    })

}]);
