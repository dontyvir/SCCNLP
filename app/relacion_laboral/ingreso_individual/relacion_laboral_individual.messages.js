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
	    tabHeaderThree : 'Paso 3 de 3: Condiciones Relación Laboral',
	    datosDelContrato : 'Datos del contrato',
	    lugarDeCelebracionDelContrato : 'Lugar de celebración del contrato',
	    fechaDeCelebracionDelContrato : 'Fecha de celebración del contrato',
	    tipoDeContrato : 'Tipo de contrato',
	    fechaDeInicioDelContrato : 'Fecha de inicio relación laboral',
	    fechaTerminoDelContrato : 'Fecha de término relación laboral',
	    modalidadDePago : 'Modalidad de pago',
	    deCadaMes : ' de cada mes',
	    datosDeLasLaboresAsociadasAlContrato : 'Datos de las labores asociadas al contrato',
	    labor : 'Labor',
	    funcion : 'Función',
	    lugarDePresentacionDelosServicios : 'Lugar',
	    tipoDeJornada : 'Tipo de Jornada',
	    sistemaDeTurno : 'Sistema de Turno',
	    editHorario : 'Editar Acuerdo Horario',
	    horario : 'Horario',
	    acuerdoDeDescanso : 'Acuerdo de Descanso',
	    editAcuerdoDescanso : 'Editar Acuerdo Descanso',
	    edit : 'Editar',
	    ingresar : 'Ingresar',
	    eliminarFila : 'Eliminar Labor',
	    remuneracionBruta : 'Remuneración Bruta (CLP)',
	    total : 'Total',
	    selectElijaOpcion : '-- elija una opción --',
	    estaSeguro : '¿Está seguro?',
	    terminoContratoTooltip: 'La fecha de término debe ser posterior a la fecha de inicio',
	    	
	    // Labels 4
	    tabHeaderFour : 'Finalización del Proceso',
	    datosIngresadosOK : 'Relación laboral ingresada'
	};
});