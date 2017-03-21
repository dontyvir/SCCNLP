'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.factory('RegistrarContrato', ['$resource', '$filter',
	
    function($resource, $filter) {

	var wrapper = {};
	
	wrapper.registrarResource = $resource('http://7.212.100.165/sccnlp/api/Relacionlab/guardarRelacionLaboral',{},{
		save : {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json; charset=utf-8'
	        }
		}
	});

	wrapper.registrar = function(trabajador, empleador, contrato, _callback_fn){
		
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
		
		var _nombre_trabajador = "";
		var _apellido_paterno = "";
		var _apellido_materno = "";
		
		var split_nombre = trabajador.nombreCompleto.split(" ");
		_apellido_materno = split_nombre.splice(split_nombre.length-1,1)[0];
		_apellido_paterno = split_nombre.splice(split_nombre.length-1,1)[0];
		_nombre_trabajador = split_nombre.join(" ");
		
		var dateFormat = 'dd/MM/yyyy';
		
		var fechaTermContrato = "";
		
		if(contrato.fechaTerminoDelContrato)
			fechaTermContrato = $filter('date')(contrato.fechaTerminoDelContrato, dateFormat);
		
		// objeto a ser enviado
		
		var _contrato = {
            IDUsuario           : 1,
            RutEmpresa          : splitRutEmpleador[0],
            DVEmpresa           : splitRutEmpleador[1],
            RutTrabajador       : _rut_trabajador,
            DVTrabajador        : _dv_trabajador,
            Pasaporte           : _pasaporte,
            Nombres             : _nombre_trabajador,
            ApellidoPaterno     : _apellido_paterno,
            ApellidoMaterno     : _apellido_materno,
            IDNacionalidad      : trabajador.nacionalidad.value,
            IDLugarNacimiento   : trabajador.lugarDeNacimiento,
            FechaNacimiento     : $filter('date')(trabajador.fechaDeNacimiento, dateFormat),
            IDEstadoCivil       : trabajador.estadoCivil.value,
            IDSexo              : "",
            Domicilio           : trabajador.domicilio,
            Email               : trabajador.email,
            RutAFP              : trabajador.AFPSelected.rut,
            DVAFP               : trabajador.AFPSelected.dv,
            RutISAPRE           : trabajador.ISAPRESelected.rut,
            DVISAPRE            : trabajador.ISAPRESelected.dv,
            FechaCelebContrato  : $filter('date')(contrato.fechaDeCelebracionDelContrato, dateFormat),
            IDTipoContrato      : contrato.tipoContratoSelected.value,
            FechaInicioContrato : $filter('date')(contrato.fechaDeInicioDelContrato, dateFormat),
            FechaTerminoContrato: fechaTermContrato,
            ModalidadPago       : contrato.modalidadDePagoSelected,
            ACTIVO              : 1,
            
            Labores: []
    		}
		
		//{ID_Labor:1, ID_Funcion:1, LugarPrestacionServicio:'', ID_Jornada:1, ID_Turno:1, Horario:''}
		
		for(var i=0;i<contrato.datosLabores.length;i++){
			
			var datosLabor = contrato.datosLabores[i];
			
			_contrato.Labores.push( {

				ID_Labor               : datosLabor.id,
				ID_Funcion             : datosLabor.funcionSelect.id,
				LugarPrestacionServicio: datosLabor.lugarPrestacionServicios,
				ID_Jornada             : datosLabor.tipoJornada.id,
				ID_Turno				: 1,
				Horario                : datosLabor.horario
			});		
		}
		
		var outFormat = [_contrato];
		
		return wrapper.registrarResource.save({},outFormat, _callback_fn, function(error){
			console.log(error);
		});
	}

	return wrapper;
}]);
