angular.module('sccnlp.nombradas')

.factory('RestClientNombrada', ['$resource', 'RestClient',

    function($resource, RestClient) {

        var wrapper = {};

        wrapper.guardarNombradas = function(data, _callback_fn) {

            return RestClient.baseResource.save_Array_JSON({
                    serviceName: 'Nombradas/guardarNombradas'
                }, data,
                _callback_fn,
                function(error) {
                    console.log(error);
                })
        }

        wrapper.getDatosTrabajador = function(_idEmpresa, _rut, _pasaporte, _callback_fn, callback_error) {

            if (!_rut)
                _rut = 0

            return RestClient.baseResource.get({
                serviceName: 'RelacionLab/getDatosTrabajador/' + _idEmpresa + '/' + _rut + '/' + _pasaporte
            }, {}, _callback_fn, callback_error)

        }

        return wrapper;

    }
]);