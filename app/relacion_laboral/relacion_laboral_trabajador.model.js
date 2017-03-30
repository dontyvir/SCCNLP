'use strict';

angular.module('sccnlp.relacionLaboral')

.factory('Trabajador', function () {
	
	 /** Prototipo para trabajador **/
	
	 function Trabajador(_rut, _dv, _pasaporte, _nombres, _apPat, _apMat, idSexo, _fecNac, _email, _domicilio){

	    	this.sexo = null;
			this.AFP = null;
			this.ISAPRE = null;
			this.domicilio = _domicilio;
			this.email = _email;
			this.nombres = _nombres;
			this.apellidoPaterno = _apPat;
			this.apellidoMaterno = _apMat;
			this.fechaNacimiento = _fecNac;
			this.nacionalidad = {id: null, glosa: null};
			this.estadoCivil = {id : null, glosa: null};
			this.documentoIdentificador = null;
			this.numDocIdentificador = null;
			this.rut = null;
			this.dv = null;
			this.pasaporte = null;
			
			this.loading = false; // flag para elemento en pantalla
						
			this.setSexo = function(id){

		    	if(!id) {
		    		
		    		sexo = {id: null, glosa:null};
		    		
		    	} else {
		    		
					if(id == 2)
						sexo = {id: 2, glosa: "Femenino"};
					
					else if(id == 1)
						sexo = {id: 1, glosa: "Masculino"};
		    	}
			}
			
			this.setPasaporte = function(_pasaporte){
				documentoIdentificador = "pasaporte";
				pasaporte = _pasaporte;
			}
			
			this.setRut = function(_rut,_dv){
				this.rut = _rut;
				this.dv = _dv;
				this.documentoIdentificador = "rut";
				this.numDocIdentificador = _rut+"-"+_dv;
			}
			
			this.getRut = function(){
				if(documentoIdentificador == 'rut')
					return rut+"-"+dv;
				
				return "";
			}
			
			this.getApellidos = function(){
				return apellidoPaterno+" "+apellidoMaterno;
			}
			
			this.setApellidos = function(apellidos){
				var ap = apellidos.split(" ");
				apellidosPaterno = ap[0];
				appellidoMaterno = ap[1];
			}
			
			var _searchById = function(id, list){
				
				if(!id || !list || !list.length)
					return null;
				
				for(var i=0;i<list.length;i++){
					if(list[i].id == id)
						return list[i];
				}
			}
			
			this.setAFP = function (id, AFPList){
				AFP = _searchById(id, AFPList);
			}
			
			this.setISAPRE = function(id, ISAPREList){
				ISAPRE = _searchById(id, ISAPREList);
			}
			
			this.setNacionalidad = function(id, nacList){
				nacionalidad = _searchById(id, nacList);
			}
			
			this.setEstadoCivil = function(id, eCList){
				estadoCivil = _searchById(id, eCList);
			}
			
			
			if(_rut && _rut!="") this.setRut(_rut,_dv);
			else               this.setPasaporte(_pasaporte);
			
			this.setSexo(idSexo);
		}
	
	 return Trabajador;
});