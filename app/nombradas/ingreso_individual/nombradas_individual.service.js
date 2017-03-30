angular.module('sccnlp.nombradas')

.factory('RestClientNombrada', ['$resource',

    function($resource) {

        var wrapper = {};

        wrapper.baseResource = $resource('http://10.212.129.28/sccnlp/api/:serviceName');

        wrapper.guardarNombradas = function(data, _callback_fn, callback_error) {
            return wrapper.baseResource.save({
                    serviceName: '/Nombradas/guardarNombradas/'
                }, {
                    data
                },
                _callback_fn, callback_error
            )
        }

        wrapper.getDatosTrabajador = function(_idEmpresa, _rut, _dv, _pasaporte, _callback_fn, callback_error) {
            return wrapper.baseResource.save({
                serviceName: '/RelacionLab/getDatosTrabajador/'
            }, {
                idEmpresa: _idEmpresa,
                rutTrabajador: _rut,
                dvTrabajador: _dv,
                pasaporteTrabajador: _pasaporte
            }, _callback_fn, callback_error)

        }
        return wrapper;

    }
]);