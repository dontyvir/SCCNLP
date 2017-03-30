'use strict';

angular.module('sccnlp.common')

.factory('RestClientRelacionLaboral', ['$resource', 'RestClient',

    function ($resource, RestClient) {

        var wrapper = {};
        
        
    	/** Clientes Relación Laboral **/

    	wrapper.getDetalleRelacionLaboral = function(id, _callback_fn,_callback_error) {

    		var _contrato = {
    				idUsuario           : 1,
    				rutEmpresa          : 1,
    				dvEmpresa           : 2,
    				trabajador			: {
    					rut             : 2222222,
    					dv              : "k",
    					pasaporte       : "A222222",
    					nombres         : "Nombre Nombre",
    					apellidoPaterno : "Apellido",
    					apellidoMaterno : "Apellido",
    					idNacionalidad  : 1,
    					fechaNacimiento : '1905/01/21',
    					idEstadoCivil   : 1,
    					idSexo          : 1,
    					domicilio       : {idRegion : 1, idComuna : 1, calle: "Calle", numero: 12345, depto: "234", block: "34"},
    					email           : "user@domain.name",
    					idIsapre        : 1,
    					idAFP           : 1
    				},
    				fechaCelebContrato  : new Date(),
    				idTipoContrato      : 1,
    				fechaInicioContrato : new Date(),
    				fechaTerminoContrato: new Date(),
    				idModalidadPago      : 1,
    	            
    	            labores: []
    	        }
    			
    			for(var i=0;i<2;i++){
    								
    				_contrato.labores.push( {

    					idLabor          : i+1,
    					idFuncion        : i+1,
    					idLugar          : 2,
    					idJornada        : 1,
    					horario          : [{dia: i, horaDesde: new Date(), horaHasta: new Date()}],
    					acuerdoDescanso  : {idSindicato: "1232456", horaDesde: new Date(), horaHasta: new Date()},
    					remuneracionBruta: 999
    					
    				});		
    			}

    		_callback_fn(_contrato);
    		return _contrato;
    	}
    	
       wrapper.consultarRelacionLaboral = function(_rut_empresa, _rut_trabajador, _pasaporte, _fecha_ini_contrato,
    		                               _fecha_fin_contrato, _estado_contrato, _callback_fn, _callback_error){
        	
        	return RestClient.baseResource.save_Array_JSON({serviceName : 'RelacionLab/consultarRelacionLaboral'},{
        		
                rutEmpresa : _rut_empresa,
                rutTrabajador : _rut_trabajador,
                pasaporte : _pasaporte,
                fechaInicioContrato : _fecha_ini_contrato,
                fechaTerminoContrato :_fecha_fin_contrato,
                estadoContrato : _estado_contrato
        		
        	},_callback_fn,_callback_error);
        }
    	
        wrapper.registrarRelacionLaboral = function(data, _callback_fn, _callback_error){
        	
        	return RestClient.baseResource.save_Array_JSON(
        			{serviceName : 'Relacionlab/guardarRelacionLaboral'}, data, _callback_fn, _callback_error);
        }
        
    	wrapper.getTurno = function(_callback_fn,_callback_error){
    		return RestClient.baseResource.query({serviceName : 'RelacionLab/getTurno'},{},_callback_fn,_callback_error);
    	}

    	wrapper.getTipoJornada = function(_callback_fn,_callback_error) {
    		return RestClient.baseResource.query({serviceName : 'RelacionLab/getTipoJornada'},{},_callback_fn,_callback_error);		
    	}
    	
    	wrapper.getFuncion = function(_callback_fn,_callback_error){
    		return RestClient.baseResource.query({serviceName : 'RelacionLab/getFuncion'},{},_callback_fn,_callback_error);
    	}

    	wrapper.getLabor = function(_callback_fn,_callback_error){
    		return RestClient.baseResource.query({serviceName : 'RelacionLab/getLabor'},{},_callback_fn,_callback_error);
    	}
    	
    	wrapper.getTipoContrato = function(_callback_fn,_callback_error){
    		return RestClient.baseResource.query({serviceName : 'RelacionLab/getTipoContrato'},{},_callback_fn,_callback_error);
    	}

    	wrapper.getModalidadPago = function(_callback_fn,_callback_error) {
    		return RestClient.baseResource.query({serviceName : 'RelacionLab/getModalidadPago'},{},_callback_fn,_callback_error);	
    	}
    	
        
        return wrapper;
}]);