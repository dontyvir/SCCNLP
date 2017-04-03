'use strict';

angular.module('sccnlp.relacionLaboral',['sccnlp.common'])

.factory('RepresentanteLegal', function(){
	
	// prototipo representante legal
	
	function RepresentanteLegal(rut,nombre,email){
		this.rut = rut;
		this.nombre = nombre;
		this.email = email;
	}	
	return RepresentanteLegal;
})

.factory('Domicilio', function(){

	// prototipo domicilio
 	
	function Domicilio(idRegion,idComuna,calle,numero,depto,block){
		this.idRegion = idRegion;
		this.idComuna = idComuna;
		this.calle = calle;
		this.numero = numero;
		this.depto = depto;
		this.block = block;
	}
	return Domicilio;
})

.factory('Empleador', function(){
	
	// prototipo empleador Model
	
	function Empleador(_rut, _nombre, _tipo, _domicilio, _terminoVigencia,_representanteLegal,
			_rutUsuario, _nombreUsuario){
		
		this.rut = _rut;
		this.dv = null;
		this.nombreEmpresa = _nombre;
		this.tipoEmpresa = _tipo;
		this.domicilio = _domicilio;
		this.terminoDeVigencia = _terminoVigencia;

		if(_representanteLegal){
			this.rutRepresentanteLegal = _representanteLegal.rut;
			this.nombreCompletoRepresentanteLegal = _representanteLegal.nombre;
			this.emailRepresentanteLegal = _representanteLegal.email;
		} else {
			this.rutRepresentanteLegal = null;
			this.nombreCompletoRepresentanteLegal = null;
			this.emailRepresentanteLegal = null;		
		}

		this.rutUsuarioQueRegistra = _rutUsuario;
		this.nombreCompletoUsuarioQueRegistra = _nombreUsuario;
				
	}
	return Empleador;
})

.factory('Labor', ['DateParser',function(DateParser){
	
	// prototipo datos Labores
	
	function Labor(_id,_idLabor,_idFuncion,_idLugar,_idJornada,_horario,_acuerdoDescanso,_remunBruta, _isLoaded) {
		
		this.id = _id,
		this.idLabor = _idLabor;
		this.idFuncion = _idFuncion;
		this.idLugar = _idLugar;
		this.horario = _horario;
		this.acuerdoDescanso = _acuerdoDescanso;
		this.remuneracionBruta = _remunBruta;
		this.idJornada = _idJornada;
		
		this.acuerdoEmpty = function(){
			return (!this.acuerdoDescanso);
		};
		this.horarioEmpty = function(){
			return (!this.horario);
		};
		this.isLoaded = (_isLoaded)?true:false; // flag para desabilitar campos en la edición

		
		var ac = this.acuerdoDescanso;
		if(ac){
			ac.horaDesde = DateParser.timeToDate(ac.horaDesde);
			ac.horaHasta = DateParser.timeToDate(ac.horaHasta);
		}
		
		if(_horario)
		for(var i=0;i<_horario.length;i++){
			
			var h = this.horario[i];
			h.horaDesde = DateParser.timeToDate(h.horaDesde);
			h.horaHasta = DateParser.timeToDate(h.horaHasta);	
		}
		
	}	
	return Labor;
}])
	
.factory('Contrato', ['Labor','DateParser', function(Labor,DateParser){
	
	// prototipo Contrato
	
	function Contrato(_idContrato,_fechaCeleb,_idTipoContrato,_fechaInicio,_fechaFin,_idModalidadPago,_labores, _isLoaded){

		this.id = _idContrato,
		this.fechaCelebContrato = DateParser.strToDate(_fechaCeleb);
	    this.idTipoContrato = _idTipoContrato;
	    this.fechaInicioContrato = DateParser.strToDate(_fechaInicio);
	    this.fechaTerminoContrato = DateParser.strToDate(_fechaFin);
	    this.idModalidadPago = _idModalidadPago;
	    this.total = 0;
	    this.labores = null;
	    
	    if(_labores){
	    	
	    	this.labores = [];
	    	
	    	for(var i=0;i<_labores.length;i++){
	    		var lab = _labores[i];
	    		this.labores.push(new Labor(i,lab.idLabor,lab.idFuncion,lab.idLocacion,lab.idJornada,lab.horario,
	    				lab.acuerdoDescanso,lab.remuneracionBruta, _isLoaded));
	    		
	    		this.total += lab.remuneracionBruta;
	    	}
	    } else {
	    	
	    	 this.labores = [new Labor(0)];
	    }

	}
	return Contrato;
	
}])
