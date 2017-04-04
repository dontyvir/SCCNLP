angular.module('sccnlp.comiteParitario')

.factory('RestClientComiteParitarioConsultar', ['$resource','IPSERVER',

    function($resource,IPSERVER) {

        var wrapper = {};

        wrapper.comiteResource = $resource(IPSERVER.DESARROLLO+'api:serviname', {}, {
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

            }
        });

        wrapper.ConsultarComite = function(_idEmpresa, _trabRutRepre, _trabDvRepre, _emprRutRepre, _emprDvRepre, _callback_fn, callback_error) {
            return wrapper.comiteResource.saveArray({
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
                }, {
                    idComite: _idComite
                },
                _callback_fn, callback_error
            )
        }

        return wrapper;

    }
]);