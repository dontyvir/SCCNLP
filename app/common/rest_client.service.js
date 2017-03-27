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
	        },
       save_Array_JSON : {
                method: 'POST',
                isArray: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
		}
	});

	wrapper.getIsapre = function() {
		
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getIsapre'});
	}
	
	wrapper.getAFP = function(){ 
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getAFP'});		
	}
	
	wrapper.getNacionalidad = function(){
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getNacionalidad'});
		
	}
	
	wrapper.getFuncion = function(){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getFuncion'});
	}
	
	wrapper.getDatosEmpresa = function(_rut, _callback_fn){
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosEmpresa/'+_rut},{}, _callback_fn);
		
	}
	
	wrapper.getDatosPersona = function(_rut, _pasaporte, _callback_fn) {
		
		if(!_pasaporte)
			_pasaporte = 0;
		
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosPersona/'+_rut+'/'+_pasaporte},{}, _callback_fn);		
	}
	
	wrapper.getLabor = function(){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getLabor'});
	}
	
	wrapper.getTipoContrato = function(){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getTipoContrato'});
	}
	
	wrapper.getEstadoCivil = function(){
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getEstadoCivil'});
	}
	
	wrapper.getDatosUsuario = function(_id_usuario, _callback_fn){
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosUsuario/'+_id_usuario},{}, _callback_fn);
	}
	
	wrapper.getAcuerdoDescanso = function(_rut, _dv){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getAcuerdoDescanso', rutSindicato : _rut, dvSindicato: _dv});
	}
	
	wrapper.getTurno = function(){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getTurno'});
	}
	
	wrapper.getDatosRepresentante = function(_rut, _dv){
		return wrapper.baseResource.query({serviceName : 'Administracion/getDatosRepresentante/'+_rut+'/'+_dv});
	}
	
	wrapper.getTipoJornada = function() {
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getTipoJornada'});		
	}
	
    wrapper.authEmpresa = function (_username, _password, _callback_fn, _callback_error) {

        return wrapper.baseResource.save({serviceName: 'token'}, {

            grant_type: "password",
            username: _username,
            password: _password

        }, _callback_fn, _callback_error);
    }

	wrapper.getDatosPersona = function(_rut, _pasaporte, _callback_fn) {
		
		if(!_pasaporte)
			_pasaporte = 0;
		
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosPersona/'+_rut+'/'+_pasaporte},{}, _callback_fn);		
	}
	
	wrapper.getLabor = function(){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getLabor'});
	}
	
	wrapper.getTipoContrato = function(){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getTipoContrato'});
	}
	
	wrapper.getEstadoCivil = function(){
		return wrapper.baseResource.query({serviceName : 'Mantenedor/getEstadoCivil'});
	}
	
	wrapper.getDatosUsuario = function(_id_usuario, _callback_fn){
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosUsuario/'+_id_usuario},{}, _callback_fn);
	}
	
	wrapper.getAcuerdoDescanso = function(_rut, _dv){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getAcuerdoDescanso', rutSindicato : _rut, dvSindicato: _dv});
	}
	
	wrapper.getTurno = function(){
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getTurno'});
	}
	
	wrapper.getDatosRepresentante = function(_rut, _dv){
		return wrapper.baseResource.query({serviceName : 'Administracion/getDatosRepresentante/'+_rut+'/'+_dv});
	}
	
	wrapper.getTipoJornada = function() {
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getTipoJornada'});		
	}


	wrapper.getLocacion = function(_rutEmpresa, _callback_fn) {
		return wrapper.baseResource.query({serviceName : 'Administracion/getLocacion/'+_rutEmpresa});		
	}
	
	wrapper.getModalidadPago = function() {
		return wrapper.baseResource.query({serviceName : 'RelacionLab/getModalidadPago'});	
	}
	
	wrapper.getTerminoVigencia = function(_idEmpresa, _idPuerto, _callback_fn){
		return wrapper.baseResource.get({serviceName : 'Administracion/getVigencia/'+_idEmpresa+'/'+_idPuerto},{},_callback_fn);			
	}

    wrapper.getModulo = function (_callback_fn, _callback_error) {
        return wrapper.baseResource.query({serviceName: 'Administracion/getModulo'}, {}, _callback_fn, _callback_error);
    };

    wrapper.getPuerto = function (_callback_fn, _callback_error) {
        return wrapper.baseResource.query({serviceName: 'Mantenedor/getPuerto'}, {}, _callback_fn, _callback_error);
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

