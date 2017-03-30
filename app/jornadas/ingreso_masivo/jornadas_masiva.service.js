angular.module('sccnlp.jornadas')

.factory('RestClientJornadaMasiva', ['$resource', function($resource) {

    var wrapper = {};

    function formDataObject(data) {
        var fd = new FormData();
        angular.forEach(data, function(value, key) {
            fd.append(key, value);
        });
        return fd;
    }


    wrapper.jornadaResource = $resource('http://7.212.100.165/sccnlp/api/:serviceName', {}, {
        save: {
            method: 'POST',
            isArray: false,
            transformRequest: formDataObject,
            headers: {
                'Content-Type': undefined,
                enctype: 'multipart/form-data'
            }

        },
        saveArray: {
            method: 'POST',
            isArray: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }

        },

    });

    wrapper.postFile = function(file, _callback_fn, _callback_error) {

        return wrapper.jornadaResource.save({
                serviceName: 'Jornada/postFile'
            }, {
                file
            },
            _callback_fn, _callback_error);
    }

    wrapper.registrarJornadas = function(file, empresa, callback_fn, callback_error) {

        return wrapper.jornadaResource.saveArray({
                serviceName: 'Jornada/RegistrarJornadas'
            }, {
                idEmpresa: parseInt(empresa),
                nombreArchivo: file
            },
            callback_fn, callback_error)
    }

    return wrapper;

}]);