'use strict';

angular.module('sccnlp.crear_usuario')
//.factory('loginMessages', function(){
.factory('crear_usuarioMessages', function(){
	return {
		USUARIO_TITULO : "Crear Usuarios",
				USUARI0_RUT_PLACEHOLDER: "Ejemplo: 12345678-0",
				USUARIO_RUT : "Rut*:",
				USUARIO_RUT_REQ:"Rut requerido",
				USUARIO_BTN_AGREGAR : "Añadir Usuario",
				USUARIO_HEADER_RUT : "Rut",
				USUARIO_HEADER_NOMBRES: "Nombres",
				USUARIO_HEADER_APELLIDOS: "Apellidos",
				USUARIO_HEADER_MODULOS:"Modulos",
				USUARIO_HEADER_MODIFICAR:"Añadir/Quitar",
				USUARIO_HEADER_ELIMINAR:"Eliminar",
				USUARIO_BTN_CANCELAR:"Cancelar",
				USUARIO_BTN_GUARDAR:"Guardar"
	};
});