'use strict';

/* definición del módulo de autorización */
angular.module('sccnlp.authorization', ['sccnlp.session']);


angular.module('sccnlp')

/**
 * directive para mostrar y ocultar elementos del menu sobre el módulo base
 */

.directive('permission', ['authService', 'sessionService', function(authService, sessionService) {
	
	/** para todos los elementos que tengan el altributo 'permission'(array de strings)
	 *  se ejecuta la función 'link'
	 */ 
	   return {
	       restrict: 'A',
	       scope: {
	          permission: '='
	       },
	 
	       link: function (scope, elem, attrs) {
	    	   
	            scope.$watch(sessionService.isLoggedIn(), function() {
	            	
                    var obj = elem[0];	            	
	            	
	                if (authService.userHasPermission(scope.permission)) {
	                    obj.style.display=null; //TODO: reliability of this
	                } else {
	                	 obj.style.display="none";
	                }
	            });                
	       }
	   }
}])

/**
 * Listener para autorización de vistas según rol del usuario
 */

.run(['$rootScope', '$state', 'authService', function ($rootScope, $state, authService) {
     
    $rootScope.$on('$routeChangeStart', function (event, next) {
    	
        if (!authService.checkPermissionForView(next)){
        	
            event.preventDefault();
            $state.go('main.composite');
        }
    });
  }]);
