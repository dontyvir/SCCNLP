angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.factory('RegistrarContrato', ['$resource',
	
    function($resource) {
	
	 var registrarResource = $resource('http://10.212.129.34/sccnlp/ingresarContrato',{}, {
	        post : {
	          method: 'POST',
	          isArray: false
	        }
	      });
	
	
	var registrar = function(trabajador, empleador, contrato){
		
		// separación de rut / dv
		
		var splitRutEmpleador =  empleador.rutEmpleador.split("-");
		
		var _rut_trabajador = null;
		var _dv_trabajador = '';
		var _pasaporte = '';
		
		if(trabajador.documentoIdentificador == 'rut') {
			
			var splitRut =  trabjador.numDocIdentificador.split("-");
			rut_trabajador = splitRut[0];
			dv_trabajador = splitRut[1];
			
		} else if (trabajador.documentoIdentificador == 'pasaporte'){
			
			pasaporte = numDocIdentificador;
			
		} else {
			//error !!
		}
		
		// separación de nombres
		
		var _nombre_trabajador = "";
		var _apellido_paterno = "";
		var _apellido_materno = "";
		
		var split_nombre = trabajador.nombreCompleto(" ");
		_apellido_materno = split_nombre.splice(split_nombre.length-1,1);
		_apellido_paterno = split_nombre.splice(split_nombre.length-1,1);
		_nombre_trabajador = split_nombre.join(" ");
		
		var dateFormat = 'dd/MM/yyyy';
		
		var fechaTermContrato = "";
		
		if(contrato.fechaTerminoDelContrato)
			fechaTermContrato = $filter('date')(contrato.fechaTerminoDelContrato, dateFormat);
		
		// objeto a ser enviado
		
		var outFormat = {
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
            LugarCelebContrato  : contrato.lugarDeCelebracionDelContrato,
            FechaCelebContrato  : $filter('date')(contrato.fechaDeCelebracionDelContrato, dateFormat),
            IDTipoContrato      : contrato.tipoContratoSelected.value,
            FechaInicioContrato : $filter('date')(contrato.fechaDeInicioDelContrato, dateFormat),
            FechaTerminoContrato: fechaTermContrato,
            DiaPago             : cotrato.diaDePagoSelected,
            ACTIVO              : 1,
            
            Labores: []
    		}
		
		//{ID_Labor:1, ID_Funcion:1, LugarPrestacionServicio:'', ID_Jornada:1, ID_Turno:1, Horario:''}
		
		for(var i=0;i<contrato.datosLabores.length;i++){
			
			datosLabor = contrato.datosLabores[i];
			
			outFormat.Labores.push( {

				ID_Labor               : datosLabor.id,
				ID_Funcion             : datosLabor.funcionSelect.id,
				LugarPrestacionServicio: datosLabor.lugarPrestacionServicios,
				ID_Jornada             : datosLabor.tipoJornada.id,
				ID_Turno               : datosLabor.sisTurno.id,
				Horario                : datosLabor.horario
			});		
		}
	
	}
	
    }
  ]);