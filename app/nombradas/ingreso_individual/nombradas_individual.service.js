angular.module('sccnlp.nombradas')

.factory('RestClientNombrada', ['$resource', 'IPSERVER',

    function($resource, IPSERVER) {

        var wrapper = {};

        wrapper.baseResource = $resource(IPSERVER.DESARROLLO+'/api/:serviceName');

        wrapper.guardarNombradas = function(data, _callback_fn, callback_error) {
            return wrapper.baseResource.save({
                    serviceName: '/Nombradas/guardarNombradas/'
                }, {
                    data
                },
                _callback_fn, callback_error
            )
        }

        wrapper.getDatosTrabajador = function(_idEmpresa, _rut, _pasaporte, _callback_fn, callback_error) {

            if (_rut) 
                _data = _rut
            if (_pasaporte)
                _data = _pasaporte

            return wrapper.baseResource.save({
                serviceName: '/RelacionLab/getDatosTrabajador/' + _idEmpresa + '/' + _data}, {}, _callback_fn, callback_error)

        }
        return wrapper;

    }
]);