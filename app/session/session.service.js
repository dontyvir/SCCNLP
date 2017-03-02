'use strict';

angular.module('sccnlp.session')

.config(function(localStorageServiceProvider) {
	
			localStorageServiceProvider.setPrefix('sccnlp');
})

.factory(
		'sessionService',['localStorageService', 'AuthEmpresa', 'jwtHelper',
		function(localStorageService, AuthEmpresa, jwtHelper) {

		/**
		 * 
		 * Modelo de las propiedades del usuario
		 * {
			  "sub": "5",
			  "role": "Administrador",
			  "nombre": "pepito perez",
			  "menus": "[Relacion laboral, Nombradas, Jornadas, Administracion]",
			  "iss": "http://localhost:54919",
			  "aud": "414e1927a3884f68abc79f7283837fd1",
			  "exp": 1488575707,
			  "nbf": 1488489307
			}
		 * 
		 */

		/* model interno datos de usuario */
		var _userData = {
				username : null,
				role : null,
				permissions : []
		};

		function _fillUserData(access_token) {

			var tokenPayload = jwtHelper.decodeToken(access_token);
			
			_userData.username = tokenPayload.nombre;
			_userData.role     = tokenPayload.menus;
			
		}
		
		function _isLoggedIn() {
			return (_userData.username && _userData.username != ""); //TODO: improve this
		};

		/**
		 * Función para autenticar un par usuario/contraseña en BD de backend local
		 */
		
		function _login_empresa(username, password, callback_fn) {

			   AuthEmpresa.get(function(tokenData) {

				if (tokenData.access_token) {
					
					_fillUserData(tokenData.access_token);
					
					localStorageService.set('id_token', tokenData.access_token);
					callback_fn(true);
				} else
					callback_fn(false);

			});
		};

		/**
		 * Función para manejar la itegración con clave única
		 */
		
		function _login_clave_unica(token) {

			localStorageService.set('id_token', token);
		};

		function _logout() {

			_userData.username = null;
			_userData.role = null;
			_userData.permissions = null;

			return localStorageService.remove('id_token');
		};

		function _getIdToken() { // recupera token del storage local

			return localStorageService.get('id_token');
		};

		function _getUserData() {

			return _userData;
		};

	return {

		login_empresa : _login_empresa,
		getIdToken : _getIdToken,
		isLoggedIn : _isLoggedIn,
		logout : _logout,
		getUserData : _getUserData
	};
} ]);
