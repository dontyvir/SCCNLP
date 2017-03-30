angular.module('sccnlp.jornadas')

.factory('RestClientJornada', ['$resource',

    function($resource) {

        var wrapper = {};

        wrapper.jornadaResource = $resource('http://7.212.100.165/sccnlp/api/Jornada/RegistrarJornada', {}, {
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