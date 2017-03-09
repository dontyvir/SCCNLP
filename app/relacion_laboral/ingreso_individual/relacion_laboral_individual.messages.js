'use strict',

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.factory('ingIndivMessages', function(){
	
	return {

	    //Variables
	    currentTab : 'tabOne',

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
	    nombreEmpresa : 'Nombre empresa',
	    tipoEmpresa : 'Tipo de empresa',
	    terminoDeVigencia : 'Término de Vigencia',
	    representanteLegal : 'Representante Legal',
	    nombreCompleto : 'Nombre Completo',
	    usuarioQueRegistra : 'Usuario que registra',
	    rutUsuario : 'Rut Usuario',
	    nombreCompletoUsuario : 'Nombre Completo Usuario',
	    cargoEnLaEmpresa : 'Cargo en la Empresa',

	    //  Labels Tab 2
	    tabHeaderTwo : 'Paso 2 de 3: Datos del Trabajador',
	    informacionDelTrabajador : 'Información del Trabajador',
	    pasaporteTrabajador : 'Pasaporte',
	    nombreCompletoTrabajador : 'Nombre Completo',
	    nacionalidadTrabajador : 'Nacionalidad',
	    lugarDeNacimientoTrabajador : 'Lugar de Nacimiento',
	    fechaDeNacimientoTrabajador : 'Fecha de Nacimiento',
	    estadoCivilTrabajador : 'Estado Civil',
	    AFPTrabajador : 'AFP',
	    ISAPRETrabajador : 'ISAPRE',
	    mandatoryFields : '* Campos Obligatorios',

	    //  Labels Tab 3
	    tabHeaderThree : 'Paso 3 de 3: Condiciones del Contrato',
	    datosDelContrato : 'Datos del contrato',
	    lugarDeCelebracionDelContrato : 'Lugar de celebración del contrato',
	    fechaDeCelebracionDelContrato : 'Fecha de celebración del contrato',
	    tipoDeContrato : 'Tipo de contrato',
	    fechaDeInicioDelContrato : 'Fecha de inicio del contrato',
	    fechaTerminoDelContrato : 'Fecha de término del contrato',
	    diaDePago : 'Día de pago',
	    deCadaMes : ' de cada mes',
	    datosDeLasLaboresAsociadasAlContrato : 'Datos de las labores asociadas al contrato',
	    labor : 'Labor',
	    funcion : 'Función',
	    lugarDePresentacionDelosServicios : 'Lugar de Presentación de los servicios',
	    tipoDeJornada : 'Tipo de Jornada',
	    sistemaDeTurno : 'Sistema de Turno',
	    horario : 'Horario',
	    acuerdoDeDescanso : 'Acuerdo de Descanso',
	    remuneracionBruta : 'Remuneración Bruta (CLP)',
	    total : 'Total'
	    
	};
});