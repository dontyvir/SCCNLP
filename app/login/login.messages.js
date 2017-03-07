'use strict';

angular.module('sccnlp.login')

.factory('loginMessages', function(){
	
	return {

		BIENVENIDO_TITLE : "Bienvenido al Sistema de Control de Cumplimiento de la Normativa Laboral Portuaria",
		SIST_DESCR : `
		El nuevo SCCNLP está enfocado en facilitar la operación a los usuarios, dando esta característica tanto al trabajador,
		 empresas y entes fiscalizadores (Dirección del Trabajo y Autoridad Marítima), lo anterior por medio de una 
		 operatoria segura, estable y de fácil uso, donde los actores involucrados no solo tengan una herramienta web
		 de alta disponibilidad sino que también cuenten con otros métodos de integración como servicios web.
		`,
		LOGIN_EMPRESA : "Login Empresa",
		CLAVE_EMPRESA_RUT : "Rut Empresa",
		CLAVE_EMPRESA_RUT_REQ : "Rut es requerido",
		CLAVE_EMPRESA_CLAVE : "Clave Empresa",
		CLAVE_EMPRESA_CLAVE_REQ : "Clave es requerida",
		CLAVE_EMPRESA_BTN : "Ingresar",
		CLAVE_UNICA : "Login con Clave Única"
	};
});