'use strict';

angular.module('sccnlp', 
		[
		'ui.router',
		'ui.bootstrap',
		'angular-jwt',
		'sccnlp.main',
		'sccnlp.common',
		'sccnlp.menu',
		'sccnlp.session',
		'sccnlp.authorization',
		'sccnlp.relacionLaboral.ingresoIndividual',
		'sccnlp.relacionLaboral.ingresoMasivo',
		'sccnlp.login',
		'sccnlp.clave_empresa',
		'sccnlp.crear_usuario',
		'sccnlp.buscar_usuario',
		'sccnlp.nombradas',                
        'sccnlp.administradorGeograf-crear',
        'sccnlp.administradorGeograf-consultar'		
]);
