angular.module('sccnlp.comiteParitario')

.factory('RestClientComiteParitarioConsultar', ['$resource',

    function($resource) {

        var wrapper = {};

        wrapper.comiteResource = $resource('http://10.212.129.22/sccnlp/api:serviname', {}, {
            save: {
                method: 'POST',
                isArray: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }

            }
        });


        wrapper.ConsultarComite = function(_idEmpresa, _trabRutRepre, _trabDvRepre, _emprRutRepre, _emprDvRepre, _callback_fn, callback_error) {
            return wrapper.comiteResource.save({
                    serviname: '/comite/ConsultarComite'
                }, {
                    idEmpresa: _idEmpresa,
                    trabRutRepre: _trabRutRepre,
                    trabDvRepre: _trabDvRepre,
                    emprRutRepre: _emprRutRepre,
                    emprDvRepre: _emprDvRepre
                },
                _callback_fn, callback_error
            )
        }

        wrapper.EliminarComite = function(_idComite, _callback_fn, callback_error) {
            return wrapper.comiteResource.save({
                    serviname: '/comite/EliminarComite'
                }, _idComite,
                _callback_fn, callback_error
            )
        }

        return wrapper;

    }
]);