'use strict';

angular.module('sccnlp.nombradas', ['ui.router', 'ui.bootstrap', 'ngTableToCsv'])

.config(['$stateProvider', function($stateProvider) {

    $stateProvider

    .state('main.composite.nombradas_individual', {
        url: "/nombradas_individual",
        templateUrl: 'nombradas/nombradas_individual.view.html',
        controller: 'NombradasIndividualCtrl',
        controllerAs: 'nomIctl'
    })

    .state('main.composite.nombradas_masiva', {
        url: "/nombradas_masiva",
        templateUrl: 'nombradas/nombradas_masiva.view.html',
        controller: 'NombradasMasivaCtrl',
        controllerAs: 'nomMctl'
    })

    .state('main.composite.nombradas_consultar', {
        url: "/nombradas_consultar",
        templateUrl: 'nombradas/nombradas_consultar.view.html',
        controller: 'NombradasConsultarCtrl',
        controllerAs: 'nomCctl'
    })

    .state('main.composite.nombradas_modificar', {
        url: "/nombradas_modificar",
        templateUrl: 'nombradas/nombradas_modificar.view.html',
        controller: 'NombradasModificarCtrl',
        controllerAs: 'nomCctl'
    })

}]);
