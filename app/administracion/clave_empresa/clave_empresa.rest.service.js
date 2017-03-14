'use strict';

angular.
  module('sccnlp.session').
  factory('restClaveEmpresa', ['$resource', '$httpParamSerializer',
	  
    function($resource , $httpParamSerializer) {
	    return $resource('http://localhost:59123/api/Administracion/ObtenerInformacionDeEmpresa',{}, {
      //return $resource('http://localhost/sccnlp/token',{}, {
      //return $resource('http://localhost:59123/token',{}, {

        query: {
          method: 'POST',
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