angular.module('sccnlp.comiteParitario')

.factory('RestClientComiteParitario', ['$resource',

    function($resource) {

        var wrapper = {};

        wrapper.comiteResource = $resource('http://10.212.129.22/sccnlp/api:serviname', {}, {
            save: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }

            }
        });


        wrapper.RegistrarComite = function(data, _callback_fn, callback_error) {
            return wrapper.comiteResource.save({
                    serviname: '/comite/RegistrarComite'
                }, data,
                _callback_fn, callback_error
            )
        }

        return wrapper;

    }
]);