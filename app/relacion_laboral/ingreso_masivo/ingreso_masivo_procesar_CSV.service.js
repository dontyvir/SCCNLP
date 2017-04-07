'use strict';

angular.module('sccnlp.relacionLaboral.ingresoMasivo')

.factory('procesarCSV', ['Contrato','Labor','DateParser','Domicilio','validateRut','Trabajador',
	     function(Contrato,Labor,DateParser,Domicilio,validateRut,Trabajador){
	
	
	/** formato de columnas **/
	var csvHeaders= ["Rut Trabajador","Dv Trabajador","Num pasaporte","Nombres","Apellido Paterno","Apellido Materno","idNacionalidad",
		             "Fecha Nacimiento","idEstado Civil","idModalidadPago","idSexo","Domicilio idRegion","Domicilio idComuna","Domicilio calle",
		             "domicilio numero","domicilio block","domicilio depto","Email","idAFP","idISAPRE","Fecha Celebración Contrato","idTipo Contrato",
		             "Fecha Inicio Contrato","Fecha Termino Contrato","IdModalidad Contrato","id Labor","Labor idFuncion","Labor idLocacion",
		             "Labor idTipoJornada","Labor horario Lunes Desde","Labor horario Lunes Hasta","Labor horario Martes Desde",
		             "Labor horario Martes Hasta","Labor horario Miercoles Desde","Labor horario Miercoles Hasta","Labor horario Jueves Desde",
		             "Labor horario Jueves Hasta","Labor horario Viernes Desde","Labor horario Viernes Hasta","Labor horario Sábado Desde",
		             "Labor Horario Sábado Hasta","Labor Horario Domingo Desde","Labor Horario Domingo Hasta","Labor RSU Sindicato",
		             "Labor acuerdo Descanso Hora Desde","Labor acuerdo Descanso Hora Hasta","Labor Remuneracion Bruta"];
	 
	
	
	/** mensajes de validación **/
	
	var validacionMSG = {
			invalidID : 'número id inválido',
			invalidHora : 'valor horario incorrecto, el formato sportado es : "HH:mm"',
			invalidDate : 'formato de fecha incorrecto, el formato soportado es : dd/MM/yyyy',
			invalidEmail : 'dirección de correo electrónico inválida',
			invalidRut : 'rut inválido',
			invalidText : 'el valor ingresado no corresponde a una cadena de texto válida',
			obligatorio : 'el campo es obligatorio',
			noDocId    : 'no se proporciona rut ni pasaporte para el trabajador',
			dvMalo    : 'dígito verificador o rut inválido',
			faltaHorario : 'no se encontró un horario válido para la labor',
			contratoErrores : 'contrato con errores, descartando labor',
			filaMalformada : 'la fila no contiene la cantidad de columnas requeridas'
	};
	
	/** objeto con la metadata de la validación **/
	
	function Validacion(_i,_j,_errorMSG){
		this.i = _i;
		this.j = _j;
		this.errorMSG = _errorMSG||null;
	}
	
	function Horario(_dia,_horaDesde,_horaHasta){
		this.dia = _dia;
		this.horaDesde = _horaDesde;
		this.horaHasta = _horaHasta;
	}
	
	function registrarError(i,j,errorMSG,validaciones){
		validaciones.push(new Validacion(i,csvHeaders[j],errorMSG));
	}
	

	function validarId(id,i,j,validaciones,obligatorio){
		
		if(obligatorio && !id ){
			registrarError(i,j,validacionMSG.obligatorio,validaciones);			
		}		

		id = parseInt(id);
		
		if(typeof id != 'number'){
			registrarError(i,j,validacionMSG.invalidID,validaciones);
			return false;
		}
		
		return id;
	}

	var validarNum = validarId;
	
	function validarHora(hora,i,j,validaciones,obligatorio){
		
		if(obligatorio && (!hora || hora == "")){
			registrarError(i,j,validacionMSG.obligatorio,validaciones);			
		}
		
		var h_obj = DateParser.timeToDate(hora);
		
		if(typeof h_obj != 'object'){
			registrarError(i,j,validacionMSG.invalidHora,validaciones);
			return null;
		}
		return h_obj;
	}
	
	function validarFecha(fecha,i,j,validaciones,obligatorio){
		
		if(obligatorio && (!fecha || fecha == "")){
			registrarError(i,j,validacionMSG.obligatorio,validaciones);
		}
		
		var h_obj = DateParser.strToDate(fecha);
		
		if(typeof h_obj != 'object'){
			registrarError(i,j,validacionMSG.invalidDate,validaciones);
			return null;
		}
		
		return h_obj;
	}
	
	function validarEmail(email,i,j,validaciones,obligatorio){
		
		// regex de validación de formato email
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		if(!re.test(email)){
			registrarError(i,j,validacionMSG.invalidEmail,validaciones);
			return null;
		}
		return email;
	}
	
	function validarDocId(_rut,_dv,_pasaporte,i,validaciones){
		
		if((!_rut || _rut == "") && (!_pasaporte && _pasaporte == "")){
			registrarError(i,2,validacionMSG.noDocId,validaciones);
			return false;
		}
		
		if(!validateRut.validate(_rut+"-"+_dv)){
			registrarError(i,1,validacionMSG.dvMalo,validaciones);
			return false;
		}
		
		return true;
	}
	
	function validarStr(str,i,j,validaciones,obligatorio){
		
		if(obligatorio && (!str || str == "")){
			registrarError(i,j,validacionMSG.obligatorio,validaciones);
			return null;
		}
		
		if(typeof str != 'string'){
			registrarError(i,j,validacionMSG.invalidText,validaciones);
			return null;
		}
		
		return str;
	}

	function buscarContrato(_rut,_pasaporte,contratos,_i,validaciones){
		for(var i=0;i<contratos.length;i++){
			
			var c = contratos[i];
			
			if(c.trabajador.rut == _rut || c.trabajador.pasaporte == _pasaporte){
				// contrato anterior encontrado
				
				for(var j=0;j<validaciones.length;j++){
					if(validaciones[j].i == _i){ // contrato anterior con errores
						registrarError(_i,0,validacionMSG.contratoErrores,validaciones);
						return null;
					}
				}
				return c;
			}
		}
		return null;
	}
	
	function procesarCSV(data){
		
		var d = data;
		var contratos = [];
		var validaciones = [];
		var v = validaciones;
		
		var contrato = new Contrato();
		contrato.labores = [];
		
		//saltamos la primera fila
		
		for(var i=1;i<d.length;i++){
			
			var c = d[i];
			
			if(c.length <= 1){ // fila vacía
				continue;
			} else if(c.length < 47){ // fila con menos campos
				registrarError(i, 0, validacionMSG.filaMalformada, v);
				continue;
			}
			
			var rutTrab        = c[0];
			var dvTrab         = c[1];
			var pasaporte      = c[2];
			
			if(!validarDocId(rutTrab,dvTrab,pasaporte,i,v)){
				continue; // no se procesa esta fila
			}
			
			var prevContrato = buscarContrato(rutTrab,pasaporte,contratos,i,v);
			if(prevContrato){
				contrato = prevContrato;
				
			} else if(v.length > 0 && v[v.length-1].i == i){ // buscar contrato retornó contrato anterior erróneo
				continue;
			}		
			// labor
			var idLabor = validarId(c[25],i,25,v,true);
			var idFuncion = validarId(c[26],i,26,v,true);
			var idLocacion = validarId(c[27],i,27,v,true);
			var idTipoJornada = validarId(c[28],i,28,v,true);
			
			var horario = [];
			
			// acuerdo Jornada

			/**
			var hLunDesde = c[29];
			var hLunHasta = c[30];
			var hMarDesde = c[31];
			var hMarHasta = c[32];
			var hMieDesde = c[33];
			var hMieHasta = c[34];
			var hJueDesde = c[35];
			var hJueHasta = c[36];
			var hVieDesde = c[37];
			var hVieHasta = c[38];
			var hSabDesde = c[39];
			var hSabHasta = c[40];
			var hDomDesde = c[41];
			var hDomHasta = c[42];
			
			**/
			
			for(var j=29;j<=42;j+=2){
				
				if((!c[j]||c[j] == "") && (!c[j+1] || c[j+1] == ""))
					continue;
				
				var dia = (j-29)/2;
				var horaDesde = validarHora(c[j], i, j, v, true);
				var horaHasta = validarHora(c[j+1], i, j+1, v, true);
				
				if(!horaDesde || !horaHasta)
					continue;
				
				horario.push(new Horario(dia,horaDesde,horaHasta));
			}
			
			if(horario.length < 1){
				registrarError(i, 42, validacionMSG.faltaHorario, v);
				continue;
			}
		
			// acuerdo descanso
			
			var rsuSind = validarStr(c[43],i,43,v,true);
			var acuerdoDescansoDesde = validarHora(c[44],i,44,v,true);
			var acuerdoDescansoHasta = validarHora(c[45],i,45,v,true);
			
			var remunBruta = validarNum(c[46],i,46,v,true);
			
			// si el último error registrado pertenece a esta fila
			if(v.length > 0 && v[v.length-1].i == i){
				continue;
			}
			
			//Labor(_id,_idLabor,_idFuncion,_idLugar,_idJornada,_horario,_acuerdoDescanso,_remunBruta, _isLoaded)
			contrato.labores.push(new Labor(
					contrato.labores.length+1,
					idLabor,idFuncion,idLocacion,
					idTipoJornada,horario,
					{idSindicato: rsuSind, horaDesde: acuerdoDescansoDesde, horaHasta : acuerdoDescansoHasta},
					remunBruta, true));
			
			// si es que había un contraro previo registrado, se agrega la labor solamente
			if(prevContrato){
				contrato.total += remunBruta;
				continue;
			}
			
			// ---fin proceso labor---
			
			// Trabajador
			var nombres        = validarStr  (c[3],i,3,v,true);
			var apPat          = validarStr  (c[4],i,4,v,true);
			var apMat          = validarStr  (c[5],i,5,v,true);
			var idNacionalidad = validarId   (c[6],i,6,v,true);
			var fecNac         = validarFecha(c[7],i,7,v,true);
			var idEstadoCivil  = validarId   (c[8],i,8,v,true);
			var idModalidadPago= validarId   (c[9],i,9,v,true);
			var idSexo         = validarId   (c[10],i,10,v,true);
			
			// Domicilio
			var idRegion       = validarId(c[11],i,11,v,true);
			var idComuna       = validarId(c[12],i,12,v,true);
			var calle          = validarStr(c[13],i,13,v,true);
			var numero         = validarNum(c[14],i,14,v,true);
			var depto          = validarNum(c[16],i,16,v,true);
			var block          = validarStr(c[15],i,15,v,true);

			// si el último error registrado pertenece a esta fila
			if(v.length > 0 && v[v.length-1].i == i){
				continue;
			}
			
			//Domicilio(idRegion,idComuna,calle,numero,depto,block,nomComuna)
			var domicilio = new Domicilio(idRegion,idComuna,calle,numero,depto,block);

			var email = validarEmail(c[17],i,17,v,false);
			var idAFP = validarId(c[18],i,18,v,false);
			var idISAPRE = validarId(c[19],i,19,v,false);
			var fechaCeleb = validarFecha(c[20],i,20,v,true);
			var idTipoContrato = validarId(c[21],i,21,v,true);
			var fecInicContrato  = validarFecha(c[22],i,22,true);
			var fecTerContrato = validarFecha(c[23],i,23,false);
			var idModalidadContrato = validarId(c[24],i,24,true);
					
			//Trabajador(_rut, _dv, _pasaporte, _nombres, _apPat, _apMat, idSexo, _fecNac, _email, _domicilio)
			var trabajador = new Trabajador(rutTrab,dvTrab,pasaporte,nombres,apPat,apMat,idSexo,fecNac,email,domicilio)
			trabajador.nacionalidad = {id:idNacionalidad, glosa:null};
			trabajador.AFP = {id:idAFP, glosa:null};
			trabajador.ISAPRE = {id:idISAPRE, glosa:null};
			trabajador.estadoCivil = {id:idEstadoCivil, glosa:null};
			
			
			/**
			 * 
			 * Contrato(_idContrato,_fechaCeleb,_idTipoContrato,_fechaInicio,_fechaFin,_idModalidadPago,_labores, _isLoaded)
			 */
			contrato.fechaCelebContrato = fechaCeleb;
		    contrato.idTipoContrato = idTipoContrato
		    contrato.fechaInicioContrato = fecInicContrato
		    contrato.fechaTerminoContrato = fecTerContrato
		    contrato.idModalidadPago = idModalidadPago;
		    contrato.total = remunBruta;
		    contrato.trabajador = trabajador;
			
			contratos.push(contrato);
		}
		
		var results = {contratos: contratos, validaciones : validaciones, valid : null};
		
		if(validaciones.length == 0)
			 results.valid = true;
		else results.valid = false;
		
		return results;
	}
	return procesarCSV;
}])