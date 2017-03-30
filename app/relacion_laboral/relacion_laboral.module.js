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
	
	function Labor(_id, idLabor, idFuncion,idLugar,horario,acuerdoDescanso,remunBruta,idJornada) {
		
		this.id = _id,
		this.laborSelect = idLabor;
		this.funcionSelect = idFuncion;
		this.lugarPrestacionServicios = idLugar;
		this.horario = horario;
		this.acuerdoDescanso = acuerdoDescanso;
		this.remunBruta = remunBruta;
		this.tipoJornada = idJornada;
		
		this.acuerdoEmpty = (!acuerdoDescanso);
		this.horarioEmpty = (!horario);
		
	}	
	return Labor;
})
	
.factory('Contrato', ['Labor', function(Labor){
	
	// prototipo Contrato
	
	function Contrato(fechaCeleb,tipo,fechaInicio,fechaFin,idFormaPago,labores){

		this.fechaDeCelebracionDelContrato = fechaCeleb;
	    this.tipoContratoSelected = tipo;
	    this.fechaDeInicioDelContrato = fechaInicio
	    this.fechaTerminoDelContrato = fechaFin;
	    this.diaDePagoSelected = idFormaPago;
	    this.total = 0;
	    this.datosLabores = null;
	    
	    if(labores && labores.length > 1){
	    	
	    	this.datosLabores = [];
	    	
	    	for(var i=0;i<labores.length;i++){
	    		var lab = labores[i];
	    		this.datosLabores.push(new Labor(i,lab.idLabor,lab.idLocacion,lab.horario,lab.acuerdoDescanso,
	    				lab.remuneracionBruta,lab.idJornada));
	    	}
	    } else {
	    	
	    	 this.datosLabores = [new Labor(0)];
	    }

	}
	return Contrato;
}])
	

	
