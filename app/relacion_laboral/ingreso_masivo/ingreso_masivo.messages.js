'use strict',

angular.module('sccnlp.relacionLaboral.ingresoMasivo')

.factory('ingMasMessages', function(){
	
	return {

	    //Buttons
	    BTN_cancelar : 'Cancelar',
	    BTN_continuar : 'Continuar',
	    BTN_limpiar : 'Limpiar',
	    BTN_buscar : 'Buscar',
	    BTN_addLabor : 'Añadir Labor',
	    BTN_finalizar : 'Finalizar',
	    BTN_aceptar : 'Aceptar',

	    // Labels Tab 1
	    tabHeaderOne : 'Paso 1 de 3: Datos de la empresa',
	    datosDelEmpleador : 'Datos del Empleador',
	    rut : 'Rut',
	    email : 'e-mail',
	    domicilio : 'Domicilio',
	    casaMatriz : 'Dirección Casa Matriz',
	    nombreEmpresa : 'Razón Social',
	    tipoEmpresa : 'Giro',
	    terminoDeVigencia : 'Término de Vigencia',
	    representanteLegal : 'Representante Legal',
	    nombreCompleto : 'Nombre Completo',
	    usuarioQueRegistra : 'Usuario que registra',
	    rutUsuario : 'Rut Usuario',
	    nombreCompletoUsuario : 'Nombre Completo Usuario',
	    cargoEnLaEmpresa : 'Cargo en la Empresa',

	    //  Labels Tab 2
	    tabHeaderTwo : 'Paso 2 de 3: Carga de Relaciones Laborales',
	    cargaRelLab : 'Carga de Relaciones Laborales',


	    //  Labels Tab 3
	    tabHeaderThree : 'Paso 3 de 3: Descargar Copia del Registro'
	};
});