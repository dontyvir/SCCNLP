'use strict',

angular.module('sccnlp.relacionLaboral.consulta')

.factory('consultaMessages', function(){
	
	return {
		
		rut : 'Rut',
		rutOPasaporte : 'Rut o pasaporte',
		nombres : 'Nombres',
		apellidos : 'Apellidos',
		pasaporteTrabajador : 'Pasaporte',
		fechaDeInicioDelContrato : 'Fecha inicio del contrato',
		fechaTerminoDelContrato : 'Fecha término del contrato',
		estadoContrato : 'Estado del contrato',
		selectElijaOpcion : '-- elija opción --',
		BTN_limpiar : 'Limpiar',
		BTN_buscar : 'Buscar',
		eliminarFila : 'Eliminar',
		labor : 'Labor',
		funcion : 'Funcion',
		lugar : 'Lugar',
		jornada : 'Jornada',
		horario : 'horario',
		modificar : 'Modificar',
		eliminar : 'Eliminar',
		tipoDeContrato : 'Tipo de contrato',
		remuneracionBruta : 'Remuneración Bruta [CLP]',
		BTN_exportar : 'Exportar a Excel',
		tabHeaderOne : 'Búsqueda',
		tabHeaderTwo : 'Datos del Trabajador',
		tabHeaderThree : 'Datos del Contrato',
		tabHeaderFour : 'Finalización'
			

	};
});