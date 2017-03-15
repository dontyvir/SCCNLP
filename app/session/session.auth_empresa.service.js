'use strict';

angular.
  module('sccnlp.session').
  factory('AuthEmpresa', ['$resource', '$httpParamSerializer',

    function($resource , $httpParamSerializer) {

	return $resource('http://7.212.100.165/sccnlp/token',{}, {

        save: {
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
