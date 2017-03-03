'use strict';

angular.module('sccnlp.authorization')

/**
 * Servicio de autorización de vistas
 */

.factory('authService', function($rootScope, sessionService, $q){
	
	var auth = {};
	
    auth.checkPermissionForView = function(view) {
        if (!view.requiresAuthentication) {
            return true;
        }
         
        return userHasPermissionForView(view);
    };
    
    var userHasPermissionForView = function(view){
        if(!sessionService.isLoggedIn()){
            return false;
        }
         
        if(!view.permissions || !view.permissions.length){
            return true;
        }
         
        return auth.userHasPermission(view.permissions);
    };
    
    auth.userHasPermission = function(permissions){
    	    	
        if(!sessionService.isLoggedIn()){
            return false;
        }
         
        var found = false;
        angular.forEach(permissions, function(permission, index){
        	        	
            if (sessionService.getUserData().permissions.indexOf(permission) >= 0){
                found = true;
                return;
            }
        });
         
        return found;
    };
    
    return auth;
});

