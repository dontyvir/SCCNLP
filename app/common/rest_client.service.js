angular.module('sccnlp.common')

        .factory('RestClient', ['$resource', '$httpParamSerializer',

            function ($resource, $httpParamSerializer) {

                var wrapper = {};

	wrapper.baseResource = $resource('http://7.212.100.165/sccnlp/api/:serviceName',{},{

		save : {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/x-www-form-urlencoded'
	        },
	        transformRequest : function(data){
	        	return $httpParamSerializer(data);
	        }
		},
        save_Array_JSON : {
                method: 'POST',
                isArray: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        }
	});

	/** autenticación login empresa */
	
    wrapper.authEmpresa = function (_username, _password, _callback_fn, _callback_error) {

        return wrapper.baseResource.save({serviceName: 'token'}, {

            grant_type: "password",
            username: _username,
            password: _password

        }, _callback_fn, _callback_error);
    }
	
	/** Clientes Mantenedor **/
	
	wrapper.getIsapre = function(_callback_fn,_callback_error) {
		
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getIsapre'},{},_callback_fn,_callback_error);
	}
	
	wrapper.getAFP = function(_callback_fn,_callback_error){ 
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getAFP'},{},_callback_fn,_callback_error);		
	}

	wrapper.getNave = function() {
		
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getNave'});
	}
	wrapper.getComunasByIdRegion = function(id_region, _callback_fn,_callback_error) {
		
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getComunasByIdRegion/'+id_region},{},_callback_fn,_callback_error);
	}
	
	wrapper.getRegion = function(_callback_fn,_callback_error){
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getRegion'},{},_callback_fn,_callback_error);
		
	}
	wrapper.getNacionalidad = function(_callback_fn,_callback_error){
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getNacionalidad'},{},_callback_fn,_callback_error);
	}
	wrapper.getEstado = function(){
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getEstado'});
	}
	
    wrapper.getPuerto = function (_callback_fn, _callback_error) {
        return wrapper.baseResource.query({serviceName: 'Mantenedor/getPuerto'}, {}, _callback_fn, _callback_error);
    }
    
	wrapper.getEstadoCivil = function(_callback_fn,_callback_error){
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getEstadoCivil'},{},_callback_fn,_callback_error);
	}

	wrapper.getDatosEmpresa = function(_rut, _callback_fn){
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosEmpresa/'+_rut},{}, _callback_fn);
		
	}
	
	wrapper.getDatosPersona = function(_rut, _dv, _pasaporte, _callback_fn, _callback_error) {
		
		if(!_pasaporte)
			_pasaporte = 0;

		if(!_rut)
			_rut = {};

		if(!_dv)
			_dv = {};
		
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosPersona/'+_rut+'/'+_dv+'/'+_pasaporte},{}, _callback_fn, _callback_error);		
	}

	/** Clientes Administración **/
	
    
	wrapper.getDatosUsuario = function(_id_usuario, _callback_fn){
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosUsuario/'+_id_usuario},{}, _callback_fn);
	}
	
	wrapper.getDatosRepresentante = function(_rut, _dv){
		return wrapper.baseResource.query({serviceName : 'Administracion/getDatosRepresentante/'+_rut+'/'+_dv});
	}
    
	wrapper.getLocacion = function(_rutEmpresa,_callback_fn,_callback_error) {
		return wrapper.baseResource.query({serviceName : 'Administracion/getLocacion/'+_rutEmpresa},{},_callback_fn,_callback_error);		
	}
    
	wrapper.getTerminoVigencia = function(_idEmpresa, _idPuerto, _callback_fn,_callback_error){
		return wrapper.baseResource.get({serviceName : 'Administracion/getVigencia/'+_idEmpresa+'/'+_idPuerto},{},
				                         _callback_fn,_callback_error);			
	}

    wrapper.getModulo = function (_callback_fn, _callback_error) {
        return wrapper.baseResource.query({serviceName: 'Administracion/getModulo'}, {}, _callback_fn, _callback_error);
    };
    
    wrapper.saveNewUser = function (_userlist, _callback_fn, _callback_error) {

        return wrapper.baseResource.save_Array_JSON({serviceName: 'Administracion/guardarUsuarios'}, _userlist, _callback_fn, _callback_error);
    };

    wrapper.getConsultarUsuarios = function (_empresa, _rut, _nombre, _vigencia, _callback_fn, _callback_error) {
        
        if(_rut !== '')
            _rut = parseInt(_rut);
        
        return wrapper.baseResource.save_Array_JSON({serviceName: 'Administracion/consultarUsuarios',idEmpresa: parseInt(_empresa), rut: _rut, nombres: _nombre, vigencia: _vigencia}, {}, _callback_fn, _callback_error);
    };


    wrapper.modifyUser = function (_userlist, _callback_fn, _callback_error) {

        return wrapper.baseResource.save_Array_JSON({serviceName: 'Administracion/modificarUsuario'}, _userlist, _callback_fn, _callback_error);
    };
	
	return wrapper;
	
}]);
