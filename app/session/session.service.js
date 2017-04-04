'use strict';

angular.module('sccnlp.session')

.config(function(localStorageServiceProvider) {

	localStorageServiceProvider.setPrefix('sccnlp');
})

/**
 * Servicio para manejo de sesión y autenticación
 */

.factory(
		'sessionService',
		[
		'localStorageService',
		'RestClient',
		'jwtHelper',
function(localStorageService, RestClient, jwtHelper) {

	var wrapper = {};

	/**
	 * 
	 * Modelo de las propiedades del usuario { "idUsuario": "5",
	 * "role": "Administrador", "nombre": "pepito perez",
	 * "rutEmpresa": "1", "dvEmpresa": "0", "idEmpresa": "1",
	 * "menus": "[Relacion laboral, Nombradas, Jornadas,
	 * Administracion]", "iss": "http://localhost:54919", "aud":
	 * "414e1927a3884f68abc79f7283837fd1", "exp": 1488575707,
	 * "nbf": 1488489307 }
	 * 
	 */

	/* model interno datos de usuario */
	wrapper.UserData = function(_id, _idEmpresa, _username,
			_rutEmpresa, _dvEmpresa, _permissions, _is_clave_empresa) {
		
		this.id = _id, this.idEmpresa = _idEmpresa;
		this.username = _username;
		this.rutEmpresa = _rutEmpresa;
		this.dvEmpresa = _dvEmpresa;
		this.puerto = null;
		this.permissions = _permissions || [];
		this.isClaveEmpresa = _is_clave_empresa;
	};

	wrapper.userData = null;

	wrapper.fillUserData = function(access_token) {

		var t = jwtHelper.decodeToken(access_token);

		var u = new wrapper.UserData(t.idUsuario, t.idEmpresa,
				t.nombre, t.rutEmpresa, t.dvEmpresa,t.menus);
		
		wrapper.userData = u;
	}

	wrapper.isLoggedIn = function() {

		if(!wrapper.userData)
			return false;

		return true;
	};

	/**
	 * Función para autenticar un par usuario/contraseña en BD
	 * de backend local
	 */

	wrapper.login_empresa = function(_username, _password, callback_fn) {

		RestClient.authEmpresa(_username, _password, function(
				tokenData) {

			if (tokenData.access_token) {

				wrapper.fillUserData(tokenData.access_token);

				localStorageService.set('id_token', tokenData.access_token);
				callback_fn(true);
			} else
				callback_fn(false);

		}, function(error_data) {
			callback_fn(false, error_data);
		});
	};

	wrapper.savePuerto = function(_puerto) {

		localStorageService.set('puerto', _puerto);
	}

	/**
	 * Función para manejar la itegración con clave única
	 */

	wrapper.login_clave_unica = function(token) {

		//callback para login con clave única
		
	};

	wrapper.logout = function() {

		wrapper.userData = null;
		localStorageService.remove('puerto');
		return localStorageService.remove('id_token');
	};

	wrapper.getIdToken = function() {

		var token = localStorageService.get('id_token');
		return token;
	};

	wrapper.getUserData = function() {
		return wrapper.userData;
	};

	function init(){

		var token = localStorageService.get('id_token');
		
		if (token && !wrapper.userData
				&& !jwtHelper.isTokenExpired(token)) {

			wrapper.fillUserData(token);

			var puerto = localStorageService.get('puerto');
			if(puerto) wrapper.userData.puerto = puerto;
		}
	}
	
	init();
	
	return wrapper;
} ]);
