angular.module('sccnlp.jornadas')

.factory('RestClientJornadaMasiva', ['$resource','IPSERVER', function($resource,IPSERVER) {

    var wrapper = {};

    function formDataObject(data) {
        var fd = new FormData();
        angular.forEach(data, function(value, key) {
            fd.append(key, value);
        });
        return fd;
    }


    wrapper.jornadaResource = $resource(IPSERVER.DESARROLLO+'api/:serviceName', {}, {
        save: {
            method: 'POST',
            headers: {
                'Content-Type': undefined,
                enctype: 'multipart/form-data'
            },
            transformRequest: formDataObject
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

        console.log(file);

        return wrapper.jornadaResource.save({
                serviceName: 'Transversal/postFile/'
            }, {
                file
            },
            _callback_fn, _callback_error);
    }

    wrapper.registrarJornadasMasiva = function(file, empresa, callback_fn, callback_error) {

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