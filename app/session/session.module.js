'use strict';

/* Módulo para manejar la autenticación y la sessión del sistema */

angular.module('sccnlp.session',
		[ 'ngResource', 'angular-jwt', 'ui.router', 'LocalStorageModule' ])

/**
 * Inicialización de la redirección según estado de autenticación del usuario
 * 
 */	
		
.config(function Config($httpProvider, jwtOptionsProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/main');
	
    jwtOptionsProvider.config({
    
	  unauthenticatedRedirector: ['$state', function($state) {
		  
	        $state.go('login');
	  }],
    	
      tokenGetter: ['options', 'sessionService','jwtHelper',
    	  
    	  function(options, sessionService, jwtHelper) {
    	  
    	   if (options && options.url.substr(options.url.length - 5) == '.html')
    		   return null; // esta excepción previene enviar el token de sesión para los fragmentos html

    	   var token = sessionService.getIdToken();
    	   return token;
      }],
    
      whiteListedDomains: ['10.212.129.38'] // For development purposes
    
    });
    
    /* activación de interceptor de sesión de angular-jwt */
    
    $httpProvider.interceptors.push('jwtInterceptor');
})


/**
 * Configuración del interceptor de sessión
 * 
 */

.run(function(authManager) {
	
    authManager.redirectWhenUnauthenticated();
    
    authManager.checkAuthOnRefresh();
});

		