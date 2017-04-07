'use strict';

angular.module('sccnlp.relacionLaboral')

.factory('RegistrarContrato', ['$resource', '$filter', 'RestClientRelacionLaboral',
	
    function($resource, $filter, RestClientRelacionLaboral) {

	var wrapper = {};
	
	wrapper.prepararDatos = function(_userId,_rut_empleador,_dv_empleador,_trabajador,_contrato){

		var dateFormat = 'yyyy/MM/dd';
		var timeFormat = 'HH:mm';
		
		// objeto a ser enviado
		
		var _idAFP = null;
		var _idISAPRE = null;
		
		if(_trabajador.ISAPRE && _trabajador.ISAPRE.id)
			_idISAPRE = _trabajador.ISAPRE.id;
		
		if(_trabajador.AFP && _trabajador.AFP.id)
			_idAFP = _trabajador.AFP.id;
		
		var contrato_out = {
	              idContrato: _contrato.id,
	              idUsuario: _userId,
	              rutEmpresa: _rut_empleador,
	              dvEmpresa: _dv_empleador,
	              trabajador:{
	                    rut: _trabajador.rut,
	                    dv: _trabajador.dv,
	                    pasaporte: _trabajador.pasaporte,
	                    nombres: _trabajador.nombres,
	                    apellidoPaterno: _trabajador.apellidoPaterno,
	                    apellidoMaterno: _trabajador.apellidoMaterno,
	                    idNacionalidad: _trabajador.nacionalidad.id,
	                    fechaNacimiento: $filter('date')(_trabajador.fechaNacimiento,dateFormat),
	                    idEstadoCivil: _trabajador.estadoCivil.id,
	                    idSexo: _trabajador.sexo.id,
	                    domicilio       : _trabajador.domicilio,
	                    email: _trabajador.email,
	                    idIsapre: _idISAPRE,
	                    idAFP: _idAFP
	                 },
	              fechaCelebContrato   : $filter('date')(_contrato.fechaCelebContrato,dateFormat),
	              idTipoContrato       : _contrato.idTipoContrato,
	              fechaInicioContrato  :  $filter('date')(_contrato.fechaInicioContrato,dateFormat),
	              fechaTerminoContrato :  $filter('date')(_contrato.fechaTerminoContrato,dateFormat)||"",
	              idModalidad: _contrato.idModalidadPago,
            
            labores: []
    		}
		
		for(var i=0;i<_contrato.labores.length;i++){
			
			var labor = _contrato.labores[i];
			
			var _h_out = [];
			var _ad_out = {idSindicato : labor.acuerdoDescanso.idSindicato,
					       horaDesde   : $filter('date')(labor.acuerdoDescanso.horaDesde,timeFormat),
					       horaHasta   : $filter('date')(labor.acuerdoDescanso.horaHasta,timeFormat)}

			for(var j=0;j<labor.horario.length;j++){
				
				_h_out.push({dia: labor.horario[j].dia,
					         horaDesde: $filter('date')(labor.horario[j].horaDesde,timeFormat),
					         horaHasta: $filter('date')(labor.horario[j].horaHasta,timeFormat)
					        });
			}

			contrato_out.labores.push( {
				idDetalle        : labor.id,
				idLabor          : labor.idLabor,
				idFuncion        : labor.idFuncion,
				idLocacion       : labor.idLugar,
				idJornada        : labor.idJornada,
				horario          : _h_out,
				acuerdoDescanso  : _ad_out,
				remuneracionBruta: labor.remuneracionBruta
			});		
		}
		
		return contrato_out;
	}

	wrapper.actualizar = function(userId,rut_empleador,dv_empleador, trabajador, contrato, _callback_fn){
		
		var _contrato = wrapper.prepararDatos(userId,rut_empleador,dv_empleador,trabajador,contrato);
		var outFormat = [_contrato];
		
		return RestClientRelacionLaboral.actualizarRelacionLaboral(outFormat, _callback_fn, function(error){
			console.log(error);
		});
	}
	
	wrapper.registrar = function(userId,rut_empleador,dv_empleador, trabajador, contrato, _callback_fn){

		var _contrato = wrapper.prepararDatos(userId,rut_empleador,dv_empleador,trabajador,contrato);
		var outFormat = [_contrato];

		return RestClientRelacionLaboral.registrarRelacionLaboral(outFormat, _callback_fn, function(error){
			console.log(error);
		});
	}
	
	wrapper.masivo = function (userId,rut_empleador,dv_empleador,contratos,_callback_fn){
		
		var out_list = [];
		for(var i=0;i<contratos.length;i++){
			out_list.push(
				wrapper.prepararDatos(userId,rut_empleador,dv_empleador,contratos[i].trabajador, contratos[i])
			);
		}
		
		return RestClientRelacionLaboral.registrarRelacionLaboral(out_list, _callback_fn, function(error){
			console.log(error);
		});
		
	}

	return wrapper;
}]);

