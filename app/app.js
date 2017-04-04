'use strict';

angular.module('sccnlp', [
    'ui.router',
    'ui.bootstrap',
    'angular-jwt',
    'sccnlp.main',
    'sccnlp.common',
    'sccnlp.menu',
    'sccnlp.session',
    'sccnlp.authorization',
    'sccnlp.relacionLaboral',
    'sccnlp.relacionLaboral.ingresoIndividual',
    'sccnlp.relacionLaboral.ingresoMasivo',
    'sccnlp.relacionLaboral.consulta',
    'sccnlp.login',
    'sccnlp.clave_empresa',
    'sccnlp.crear_usuario',
    'sccnlp.buscar_usuario',
    'sccnlp.nombradas',
    'sccnlp.jornadas',
    'sccnlp.comiteParitario',
    'sccnlp.administradorGeograf-crear',
    'sccnlp.administradorGeograf-consultar'
]).constant('IPSERVER', {
          DESARROLLO: 'http://7.212.100.165/sccnlp/'
          //  DESARROLLO: 'http://localhost:59123/'
        });
