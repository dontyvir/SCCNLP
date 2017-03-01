'use strict';

angular.
  module('sccnlp.session').
  factory('AuthEmpresa', ['$resource',
    function($resource) {
      return $resource('/services/rest/:auth.json', {auth: 'auth_empresa'}, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    }
  ]);