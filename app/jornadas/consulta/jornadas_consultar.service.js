angular.module('sccnlp.jornadas')

.factory('RestClientJornadaConsulta', ['$resource', function($resource) {

    var wrapper = {};

    wrapper.jornadaResource = $resource('http://7.212.100.165/sccnlp/api/:serviceName', {}, {
        saveArray: {
            method: 'POST',
            isArray: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        },
        save: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        },

    });


    wrapper.consultarJornada = function(_idEmpresa, _fechaInicioJornada, _horaInicioJornada, _rut, _dv, _pasaporte, _idNave, _idLugar, _fechaTerminoJornada, _horaTerminoJornada, _idSitio, callback_fn, callback_error) {

        return wrapper.jornadaResource.saveArray({
                serviceName: 'Jornada/ConsultarJornada'
            }, {
                idEmpresa: parseInt(_idEmpresa),
                fechainiciojornada: _fechaInicioJornada,
                horainiciojornada: _horaInicioJornada,
                rut: parseInt(_rut),
                dv: _dv,
                pasaporte: _pasaporte,
                idNave: _idNave,
                idEmprLocacion: _idLugar,
                fechafinjornada: _fechaTerminoJornada,
                horaterminojornada: _horaTerminoJornada,
                idSitio: _idSitio
            },
            callback_fn, callback_error)
    }

    wrapper.modificarJornada = function(data, callback_fn, callback_error) {

        return wrapper.jornadaResource.save({
                serviceName: 'Jornada/ModificarJornada'
            },
            data,
            callback_fn, callback_error)

    }
    return wrapper;

}]);