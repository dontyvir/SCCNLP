'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.factory('RegistrarContrato', ['$resource', '$filter', 'RestClientRelacionLaboral',
	
    function($resource, $filter, RestClientRelacionLaboral) {

	var wrapper = {};

	wrapper.actualizar = function(userId, trabajador, empleador, contrato, _callback_fn){
		
	}
	
	wrapper.registrar = function(userId, trabajador, empleador, contrato, _callback_fn){
		
		// separación de rut / dv
		
		var splitRutEmpleador =  empleador.rutEmpleador.split("-");
		
		var _rut_trabajador = null;
		var _dv_trabajador = '';
		var _pasaporte = '';
		
		if(trabajador.documentoIdentificador == 'rut') {
			
			var splitRut =  trabajador.numDocIdentificador.split("-");
			_rut_trabajador = splitRut[0];
			_dv_trabajador = splitRut[1];
			
		} else if (trabajador.documentoIdentificador == 'pasaporte'){
			
			_pasaporte = numDocIdentificador;
			
		} else {
			//error !!
		}
		
		// separación de nombres
		
		var _apellido_paterno = "";
		var _apellido_materno = "";
		
		var split_apellidos = trabajador.apellidos.split(" ");
		_apellido_materno = split_apellidos[1];
		_apellido_paterno = split_apellidos[0];
		
		var dateFormat = 'yyyy/MM/dd';
		var timeFormat = 'HH:mm';
		
		var fechaTermContrato = "";
		
		if(contrato.fechaTerminoDelContrato)
			fechaTermContrato = $filter('date')(contrato.fechaTerminoDelContrato, dateFormat);
		
		
		var generarHorario = function(_horariosIn){
			
			if(!_horariosIn)
				return null;
			
			var _horarioOut = {
					dia : null,
					horaDesde : null,
					horaHasta : null,
			};
			
			for(var i=0;i<_horariosIn.length;i++){
				
				var h = _horariosIn[i];
				
				if(h.selected){
					_horarioOut.dia = i;
					_horarioOut.horaDesde = $filter('date')(h.scheduleStart, timeFormat);
					_horarioOut.horaHasta = $filter('date')(h.scheduleEnd, timeFormat);
				}
			}
			
			return _horarioOut;
		}
		
		var generarAcuerdoDescanso = function(_acuerdoIn){
			
			if(!_acuerdoIn)
				return null;
			
			var _acuerdoOut = {
					idSindicato : _acuerdoIn.docId,
					nombreAcuerdo : _acuerdoIn.acuerdo,
					horaDesde : $filter('date')(_acuerdoIn.horaDesde, timeFormat),
					horaHasta : $filter('date')(_acuerdoIn.horaHasta, timeFormat)
			}
			
			return _acuerdoOut;
		}
		
		// objeto a ser enviado
		
		var _contrato = {
			idUsuario           : userId,
			rutEmpresa          : splitRutEmpleador[0],
			dvEmpresa           : splitRutEmpleador[1],
			rutTrabajador       : _rut_trabajador,
			dvTrabajador        : _dv_trabajador,
			pasaporte           : _pasaporte,
			nombres             : trabajador.nombres,
			apellidoPaterno     : _apellido_paterno,
			apellidoMaterno     : _apellido_materno,
			idNacionalidad      : trabajador.nacionalidad.id,
			fechaNacimiento     : $filter('date')(trabajador.fechaDeNacimiento, dateFormat),
			idEstadoCivil       : trabajador.estadoCivil.id,
			idSexo              : trabajador.sexo.id,
			domicilio           : trabajador.domicilio,
			email               : trabajador.email,
			rutAFP              : trabajador.AFPSelected.rut,
			dvAFP               : trabajador.AFPSelected.dv,
			rutISAPRE           : trabajador.ISAPRESelected.rut,
			dvISAPRE            : trabajador.ISAPRESelected.dv,
			fechaCelebContrato  : $filter('date')(contrato.fechaDeCelebracionDelContrato, dateFormat),
			idTipoContrato      : contrato.tipoContratoSelected,
			fechaInicioContrato : $filter('date')(contrato.fechaDeInicioDelContrato, dateFormat),
			fechaTerminoContrato: fechaTermContrato,
			idModalidad         : contrato.modalidadDePagoSelected,
            
            labores: []
    		}
		
		for(var i=0;i<contrato.datosLabores.length;i++){
			
			var datosLabor = contrato.datosLabores[i];
			
			_contrato.labores.push( {

				idLabor          : datosLabor.laborSelect,
				idFuncion        : datosLabor.funcionSelect,
				idLocacion       : datosLabor.lugarPrestacionServicios,
				idJornada        : datosLabor.tipoJornada,
				horario          : generarHorario(datosLabor.horario),
				acuerdoDescanso  : generarAcuerdoDescanso(datosLabor.acuerdoDescanso),
				remuneracionBruta: datosLabor.remunBruta
			});		
		}
		
		var outFormat = [_contrato];
		
		return RestClientRelacionLaboral.registrarRelacionLaboral(outFormat, _callback_fn, function(error){
			console.log(error);
		});
	}

	return wrapper;
}]);

