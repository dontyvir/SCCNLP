'use strict';

angular.module('sccnlp.session')

.config(function(localStorageServiceProvider) {
	
			localStorageServiceProvider.setPrefix('sccnlp');
})

/**
 * Servicio para manejo de sesión y autenticación
 */

.factory(
		'sessionService',['localStorageService', 'RestClient', 'jwtHelper',
		function(localStorageService, RestClient, jwtHelper) {

		/**
		 * 
		 * Modelo de las propiedades del usuario
		 * {
			  "idUsuario": "5",
			  "role": "Administrador",
			  "nombre": "pepito perez",
			  "rutEmpresa": "1",
			  "dvEmpresa": "0",
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
				id : null,
				username : null,
				rutEmpresa : null,
				dvEmpresa : null,
				role : null,
				permissions : []
		};

		function _fillUserData(access_token) {

			var tokenPayload = jwtHelper.decodeToken(access_token);
			
			_userData.id          = tokenPayload.idUsuario;
			_userData.username    = tokenPayload.nombre;
			_userData.rutEmpresa  = tokenPayload.rutEmpresa;
			_userData.dvEmpresa   = tokenPayload.dvEmpresa;
			_userData.permissions = tokenPayload.menus;
			
		}
		
		function _isLoggedIn() {
			
			var d = _getUserData();
			
			return (d.username && d.username != "");
		};

		/**
		 * Función para autenticar un par usuario/contraseña en BD de backend local
		 */
		
		function _login_empresa(_username, _password, callback_fn) {

			   RestClient.authEmpresa(_username, _password,
					
					function(tokenData) {

				if (tokenData.access_token) {
					
					_fillUserData(tokenData.access_token);
					
					localStorageService.set('id_token', tokenData.access_token);
					callback_fn(true);
				} else
					callback_fn(false);

			}, function(error_data){
				callback_fn(false, error_data);
			});
		};

		/**
		 * Función para manejar la itegración con clave única
		 */
		
		function _login_clave_unica(token) {

			//TODO: implement this
			
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
			
			// Inicialización del objeto usuario, en caso de estar logeado
			var token = _getIdToken();
			
			if(token && !_userData.username && 
			   !jwtHelper.isTokenExpired(token)){
				
				_fillUserData(token);
			}
			
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
