angular.module('sccnlp.common')

.factory('RestClient', ['$resource',
	
function($resource) {
	
	var wrapper = {};

	wrapper.baseResource = $resource('http://7.212.100.165/sccnlp/api/:serviceName');
	
	
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
	
	wrapper.getDatosEmpresa = function(_rut, _dv, _callback_fn){
		return wrapper.baseResource.get({serviceName : 'Administracion/getDatosEmpresa/'+_rut+'/'+_dv},{}, _callback_fn);
		
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
	
	wrapper.getDatosUsuario = function(_id_usuario){
		return wrapper.baseResource.query({serviceName : 'Administracion/getDatosUsuario/'+_id_usuario});
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
	
	return wrapper;
	
}]);