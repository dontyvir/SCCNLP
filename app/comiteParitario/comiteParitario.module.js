'use strict';

angular.module('sccnlp.comiteParitario', ['ui.router', 'sccnlp.common', 'sccnlp.session'])

.config(['$stateProvider', function($stateProvider) {

    $stateProvider

        .state('main.composite.comiteParitario_crear', {
        url: "/comiteParitario",
        templateUrl: 'comiteParitario/crear/comiteParitario_crear.view.html',
        controller: 'comiteParitarioCrearCtrl',
        controllerAs: 'cpctl'
    })

    .state('main.composite.comiteParitario_consultar', {
        url: "/comiteParitarioConsultar",
        params: {
            emprRutRepre: null,
            emprDvRepre: null,
            idEmpresa: null,
            trabRutRepre: null,
            trabDvRepre: null
        },
        templateUrl: 'comiteParitario/consultar/comiteParitario_consultar.view.html',
        controller: 'comiteParitarioConsultarCtrl',
        controllerAs: 'cpcctl'
    })

    .state('main.composite.comiteParitario_modificar', {
        url: "/comiteParitarioConsultar",
        params: {
            data: null
        },
        templateUrl: 'comiteParitario/crear/comiteParitario_crear.view.html',
        controller: 'comiteParitarioModificarCtrl',
        controllerAs: 'cpmctl'
    })

}]);