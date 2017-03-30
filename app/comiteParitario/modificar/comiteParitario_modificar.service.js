angular.module('sccnlp.comiteParitario')

.factory('RestClientComiteParitarioModificar', ['$resource',

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


        wrapper.ModificarComite = function(data, _callback_fn, callback_error) {
            return wrapper.comiteResource.save({
                    serviname: '/comite/ModificarComite'
                }, data,
                _callback_fn, callback_error
            )
        }

        return wrapper;

    }
]);