'use strict';

angular.
  module('sccnlp.session').
  factory('AuthEmpresa', ['$resource', '$httpParamSerializer',
	  
    function($resource , $httpParamSerializer) {
	  
      //return $resource('http://10.212.129.34/sccnlp/token',{}, {
	  return $resource('/services/rest/auth_empresa.json',{}, {
        get: {
          method: 'GET',
          isArray: false,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: function(data){
        	 return $httpParamSerializer(data);
          }
        }
      });
    }
  ]);