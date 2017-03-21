'use strict';

angular.
  module('sccnlp.session').
  factory('restClaveEmpresa', ['$resource', '$httpParamSerializer',
	  
    function($resource , $httpParamSerializer) {
	    return $resource('http://localhost:59123/api/Administracion/getDatosEmpresa/:RUT/:DV',{RUT:'@RUT',DV:'@DV'}, {
      //return $resource('http://localhost/sccnlp/token',{}, {
      //return $resource('http://localhost:59123/token',{}, {
        query:{
                method: 'GET',
                isArray: false,
                headers: { 'Content-Type': 'application/json' },
                transformRequest: function(data){ return $httpParamSerializer(data); }
        },
        save:{
                url:'http://localhost:59123/api/Administracion/crearClaveEmpresa/',
                method: 'POST',
                isArray: false,
                headers: { 'Content-Type': 'application/json' },
                transformRequest: function(data){ return $httpParamSerializer(data); }
        }
      });
    }
  ]);