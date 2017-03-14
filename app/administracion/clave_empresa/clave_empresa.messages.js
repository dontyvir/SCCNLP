'use strict';

angular.module('sccnlp.clave_empresa')
//.factory('loginMessages', function(){
.factory('clave_empresaMessages', function(){
	return {
		CLAVE_EMPRESA_TITULO : "Crear Clave Empresa",
			CLAVE_EMPRESA_SUBTITULO_EMPRESA: "Datos de la Empresa",
				
				CLAVE_EMPRESA_RUT_PLACEHOLDER: "Ejemplo: 12345678-0",
				CLAVE_EMPRESA_RUT : "Rut empresa*:",
				CLAVE_EMPRESA_RUT_REQ : "Rut empresa es requerido",
				CLAVE_EMPRESA_BTN_BUSCAR : "Buscar",

				CLAVE_EMPRESA_RAZON_SOCIAL : "Razón social*:",
				CLAVE_EMPRESA_RAZON_SOCIAL_CHK: "Debe verificar la razon social",
				
				CLAVE_EMPRESA_DIRECCION_CM : "Dirección casa matriz*:",
				CLAVE_EMPRESA_DIRECCION_CM_REQ: "Direccion es requerido",
				CLAVE_EMPRESA_DIRECCION_CM_CHK: "Debe verificar la direccion de la casa matriz",

				CLAVE_EMPRESA_ACTIV_ECONOMICA : "Principal actividad economica*:",
				CLAVE_EMPRESA_ACTIV_ECONOMICA_REQ: "Actividad economica requerida",
				CLAVE_EMPRESA_ACTIV_ECONOMICA_CHK: "Debe verificar la actividad economica",



			CLAVE_EMPRESA_SUBTITULO_REPRESENTANTE: "Datos del Representante Tributario",

				CLAVE_EMPRESA_RUT_REP_LEGAL : "	Rut",
				CLAVE_EMPRESA_RUT_REP_LEGAL_CHK: "Debe verificar el rut",
				
				CLAVE_EMPRESA_NOMBRE_REP_LEGAL : "Nombre completo",
				CLAVE_EMPRESA_NOMBRE_REP_LEGAL_CHK: "Debe verificar el nombre",

				CLAVE_EMPRESA_FECHANAC_REP_LEGAL : "Fecha de nacimiento",
				CLAVE_EMPRESA_FECHANAC_REP_LEGAL_CHK: "Debe verificar la fecha",

			CLAVE_EMPRESA_BTNCANCELAR: "Cancelar",
			CLAVE_EMPRESA_BTNGENERAR: "Generar"
	};
});