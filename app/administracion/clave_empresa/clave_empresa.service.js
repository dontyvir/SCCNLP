'use strict';

angular.module('sccnlp.clave_empresa')

.config(function(localStorageServiceProvider) {
	
			localStorageServiceProvider.setPrefix('sccnlp');
})

/**
 * Servicio para manejo de sesión y autenticación
 */

.factory(
		'sessionService',['localStorageService', 'restClaveEmpresa', 'jwtHelper',
		function(localStorageService, restClaveEmpresa, jwtHelper) {

		/* model interno datos clave empresa */
		var datoClaveEmpresa = {
				IdEmpresa : 0,
				rutEmpresa: 0,
				nombreEmpresa:"",
				direcciones:[],
				actividadesEco:[],
				rutRepresentante:0,
				nombreRepresentante:0,
				fechaNacimiento:""
		};

		function _fillData(data) {
			datoClaveEmpresa.IdEmpresa = data.IdEmpresa;
			datoClaveEmpresa.rutEmpresa=data.rutEmpresa;
			datoClaveEmpresa.nombreEmpresa=data.nombreEmpresa;
			datoClaveEmpresa.direcciones=data.direcciones;
			datoClaveEmpresa.actividadesEco=data.actividadesEco;
			datoClaveEmpresa.rutRepresentante=data.rutRepresentante;
			datoClaveEmpresa.nombreRepresentante=data.nombreRepresentante;
			datoClaveEmpresa.fechaNacimiento=data.fechaNacimiento;
		}
		
		

		/**
		 * Función para consultar los datos de la empresa
		 */
		
		function _getDatosEmpresa(rutEmpresa,dvEmpresa, callback_fn) {
		   restClaveEmpresa.query({},
				{RutEmpresa: rutEmpresa, DVEmpresa: dvEmpresa},
				
				function(data) {
					if (data.access_token) {
						_fillData(tokenData.access_token);
						callback_fn(true);
					} else
						callback_fn(false);
			});
		};

		
		function _datoClaveEmpresa() {
			return datoClaveEmpresa;
		};

	return {
		getUserData : _datoClaveEmpresa
	};
} ]);
