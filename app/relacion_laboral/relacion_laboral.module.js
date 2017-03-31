'use strict';

angular.module('sccnlp.relacionLaboral',[])

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
	
	function Empleador(rut, nombre, tipo, domicilio, terminoVigencia,representanteLegal,
			rutUsuario, nombreUsuario){
		
		this.rutEmpleador = rut;
		this.nombreEmpresa = nombre;
		this.tipoEmpresa = tipo;
		this.domicilio = domicilio;
		this.terminoDeVigencia = terminoVigencia;

		if(representanteLegal){
			this.rutRepresentanteLegal = representanteLegal.rut;
			this.nombreCompletoRepresentanteLegal = representanteLegal.nombre;
			this.emailRepresentanteLegal = representanteLegal.email;
		} else {
			this.rutRepresentanteLegal = null;
			this.nombreCompletoRepresentanteLegal = null;
			this.emailRepresentanteLegal = null;		
		}

		this.rutUsuarioQueRegistra = rutUsuario;
		this.nombreCompletoUsuarioQueRegistra = nombreUsuario;
				
	}
	return Empleador;
})

.factory('Labor', function(){
	
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
		
		this.acuerdoEmpty = (_acuerdoDescanso)?true:false;
		this.horarioEmpty = (_horario)?true:false;
		this.isLoaded = (_isLoaded)?true:false; // flag para desabilitar campos en la edición
		
	}	
	return Labor;
})
	
.factory('Contrato', ['Labor', function(Labor){
	
	// prototipo Contrato
	
	function Contrato(_fechaCeleb,_idTipoContrato,_fechaInicio,_fechaFin,_idModalidadPago,_labores, _isLoaded){

		this.fechaCelebContrato = _fechaCeleb;
	    this.idTipoContrato = _idTipoContrato;
	    this.fechaInicioContrato = _fechaInicio
	    this.fechaTerminoContrato = _fechaFin;
	    this.idModalidadPago = _idModalidadPago;
	    this.total = 0;
	    this.labores = null;
	    
	    if(_labores && _labores.length > 1){
	    	
	    	this.labores = [];
	    	
	    	for(var i=0;i<_labores.length;i++){
	    		var lab = _labores[i];
	    		this.labores.push(new Labor(i,lab.idLabor,lab.idFuncion,lab.idLugar,lab.idJornada,lab.horario,
	    				lab.acuerdoDescanso,lab.remuneracionBruta, _isLoaded));
	    		
	    		this.total += lab.remuneracionBruta;
	    	}
	    } else {
	    	
	    	 this.datosLabores = [new Labor(0)];
	    }

	}
	return Contrato;
	
}])
