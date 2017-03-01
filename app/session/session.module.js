'use strict';

/* Módulo para manejar la autenticación y la sessión del sistema */

angular.module('sccnlp.session',
		[ 'ngResource', 'angular-jwt', 'ui.router', 'LocalStorageModule' ])

.config(function Config($httpProvider, jwtOptionsProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/main');
	
    jwtOptionsProvider.config({
    
	  unauthenticatedRedirector: ['$state', function($state) {
	        $state.go('login');
	  }],
    	
      tokenGetter: ['options', 'sessionService','jwtHelper', function(options, sessionService, jwtHelper) {
    	  
    	  // por cada request http se envía el token de autenticación
    	  
    	   if (options && options.url.substr(options.url.length - 5) == '.html')
    		   return null; // excepción para no enviar autenticación a las plantillas html

    	   var token = sessionService.getIdToken();
    	   return token;
      }]
    });
    
    $httpProvider.interceptors.push('jwtInterceptor');
})

// activar el redireccionado
.run(function(authManager) {
	
    authManager.redirectWhenUnauthenticated();
    authManager.checkAuthOnRefresh();
});

		