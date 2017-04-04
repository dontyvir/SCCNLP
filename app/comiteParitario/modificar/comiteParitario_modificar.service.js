angular.module('sccnlp.comiteParitario')

.factory('RestClientComiteParitarioModificar', ['$resource','IPSERVER',

    function($resource,IPSERVER) {

        var wrapper = {};

        wrapper.comiteResource = $resource(IPSERVER.DESARROLLO+'api:serviname', {}, {
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