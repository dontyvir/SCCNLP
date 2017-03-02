'use strict';

angular.module('sccnlp.authorization', ['sccnlp.session']);


// directive para mostrar y ocultar elementos del menu sobre el módulo base

angular.module('sccnlp')
.directive('permission', ['authService', 'sessionService', function(authService, sessionService) {
	   return {
	       restrict: 'A',
	       scope: {
	          permission: '='
	       },
	 
	       link: function (scope, elem, attrs) {
	    	   
	            scope.$watch(sessionService.isLoggedIn(), function() {
	            	
                    var obj = elem[0];	            	
	            	
	                if (Auth.userHasPermission(scope.permission)) {
	                    obj.style.display=null; //TODO: improve
	                } else {
	                	 obj.style.display="none";
	                }
	            });                
	       }
	   }
}])

.run(['$rootScope', '$state', 'authService', function ($rootScope, $state, authService) {
     
    $rootScope.$on('$routeChangeStart', function (event, next) {
    	
        if (!authService.checkPermissionForView(next)){
        	
            event.preventDefault();
            $state.go('main.composite');
        }
    });
  }]);
