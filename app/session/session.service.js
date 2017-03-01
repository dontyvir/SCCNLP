'use strict';

angular
		.module('sccnlp.session')

		.config(function(localStorageServiceProvider) {

			localStorageServiceProvider.setPrefix('sccnlp');

		})

.factory(
		'sessionService',['localStorageService', 'AuthEmpresa', 'jwtHelper',
		function(localStorageService, AuthEmpresa, jwtHelper) {

		var _sessData = {
			username : "",
			profile : -1,
			token : null,
			session_expiry : -1
		};

		function _isLoggedIn() {
			return (_sessData.username && _sessData.username != "");
		};

		function _login_empresa(username, password,
				callback_fn) {

			   AuthEmpresa.get(function(tokenData) {

				if (tokenData.access_token) {
					
					localStorageService.set('id_token', tokenData.access_token);
					callback_fn(true);
				} else
					callback_fn(false);

			});
		};

		function _login_clave_unica(token) {

			localStorageService.set('id_token', token);
		};

		function _logout() {

			_sessData.username = "";
			_sessData.profile = -1;
			_sessData.token = null;
			_sessData.session_expiry = -1;

			return localStorageService.remove('id_token');
			
		};
		
		function _getIdToken() { // recupera token

			return localStorageService.get('id_token');
		};


	return {
		login_empresa : _login_empresa,
		getIdToken : _getIdToken,
		isLoggedIn : _isLoggedIn,
		logout : _logout
	};
} ]);
