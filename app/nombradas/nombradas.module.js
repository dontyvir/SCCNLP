'use strict';

angular.module('sccnlp.nombradas', ['ui.router', 'ui.bootstrap', 'ngTableToCsv', 'sccnlp.common'])

.config(['$stateProvider', function($stateProvider) {

    $stateProvider

    .state('main.composite.nombradas_individual', {
        url: "/nombradas_individual",
        templateUrl: 'nombradas/ingreso_individual/nombradas_individual.view.html',
        controller: 'NombradasIndividualCtrl',
        controllerAs: 'nomIctl'
    })

    .state('main.composite.nombradas_masiva', {
        url: "/nombradas_masiva",
        templateUrl: 'nombradas/ingreso_masivo/nombradas_masiva.view.html',
        controller: 'NombradasMasivaCtrl',
        controllerAs: 'nomMctl'
    })

    .state('main.composite.nombradas_consultar', {
        url: "/nombradas_consultar",
        templateUrl: 'nombradas/consulta/nombradas_consultar.view.html',
        controller: 'NombradasConsultarCtrl',
        controllerAs: 'nomCctl'
    })

    .state('main.composite.nombradas_modificar', {
        url: "/nombradas_modificar",
        templateUrl: 'nombradas/modificar/nombradas_modificar.view.html',
        controller: 'NombradasModificarCtrl',
        controllerAs: 'nomCctl'
    })

}]);
