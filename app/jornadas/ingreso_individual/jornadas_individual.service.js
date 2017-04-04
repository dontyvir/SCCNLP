angular.module('sccnlp.jornadas')

.factory('RestClientJornada', ['$resource','IPSERVER',

    function($resource,IPSERVER) {

        var wrapper = {};

        wrapper.jornadaResource = $resource(IPSERVER.DESARROLLO+'api/Jornada/RegistrarJornada', {}, {
            save: {
                method: 'POST',
                isArray : true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }

            }
        });


        wrapper.registrarJornada = function(data, _callback_fn, callback_error) {
            return wrapper.jornadaResource.save({},data,
                _callback_fn, callback_error
            )
        }

        return wrapper;

    }
]);