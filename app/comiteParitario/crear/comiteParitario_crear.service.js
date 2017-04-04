angular.module('sccnlp.comiteParitario')

.factory('RestClientComiteParitario', ['$resource','IPSERVER',

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