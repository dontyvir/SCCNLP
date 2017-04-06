'use strict';

angular.module('sccnlp.relacionLaboral')

.factory('LoadDataTrabajador', ['Trabajador', function (Trabajador) {

}])

.factory('LoadDataContrato', ['Contrato', function (Contrato) {
	
	
}])

.factory('LoadDataEmpleador', ['Empleador','sessionService','RestClient', function (Empleador,sessionService,RestClient) {
	
	function LoadDataEmpleador(_callback_fn){
		
		var ud = sessionService.getUserData();

		var empleador = new Empleador();
		
        RestClient.getDatosEmpresa(ud.rutEmpresa,ud.dvEmpresa,ud.puerto.id, function(data){

    		var ed = data;
    		var domicilio = ed.direcciones[ed.idCasaMatriz];
    		empleador.rut = ed.rutEmpresa;
    		empleador.dv = ed.dvEmpresa;
    		empleador.nombreEmpresa = ed.razonSocial;
    		empleador.tipoEmpresa = ed.actividades[ed.idActividadPrincipal].glosaActividad;
    		empleador.domicilio = domicilio.calle+" "+domicilio.numero; //TODO: dirección
    		empleador.terminoDeVigencia = (ed.fechaVigencia)?new Date(ed.fechaVigencia):null;
    		empleador.representanteLegal = ed.representante;
        
    		if(typeof _callback_fn == 'function')
    			_callback_fn();
        });

   	 	RestClient.getDatosUsuario(ud.id, function(data){

	 		if(data.rut) 
	 			empleador.rutUsuarioQueRegistra = data.rut+"-"+data.dv;
	 		else
	 			empleador.rutUsuarioQueRegistra = data.pasaporte;
	 		
		        empleador.nombreCompletoUsuarioQueRegistra = data.nombres+" "+data.apellidoPaterno+" "+data.apellidoMaterno;
   	 	});

		
		return empleador;
	}
     
    return LoadDataEmpleador;
}])