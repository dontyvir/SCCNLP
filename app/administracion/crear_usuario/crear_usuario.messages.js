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
                                USUARIO_HEADER_PUERTOS:"Puertos",
				USUARIO_HEADER_MODIFICAR:"Añadir/Quitar",
				USUARIO_HEADER_ELIMINAR:"Eliminar",
				USUARIO_BTN_CANCELAR:"Cancelar",
				USUARIO_BTN_GUARDAR:"Guardar",
                                MESSAGE_RUT_NOT_FOUND_EXCEPTION: "El RUT ingresado en la busqueda no se encuentra en registro Civil",
                                ADD_REMOVE_MODULOS: "Añadir/Quitar modulo/s",
                                ACEPTAR_BTN:    "Aceptar",
                                CANCELAR_BTN:   "Cancelar",
                                ADD_REMOVE_PUERTOS: "Añadir/Quitar puertos/s",
                                MANDATORY:  "* Campos Obligatorios",
                                MESSAGE_WARNING_DELETE: "¿Está seguro eliminar el registro?",
                                MESSAGE_WARNING_RUT: "El RUT ingresado no es válido. Vuelva a intentarlo.",
                                MESSAGE_WARNING_REG_CIVIL:  "En este momento no se tiene enlace con el registro civil. Por favor, vuelva a intentarlo mas tarde.",
                                MESSAGE_WARNING_PERSONA_NO_ENCONTRADA:  "Persona no encontrada en sistema",
                                MESSAGE_WARNING_GUARDADO_EXITOSO:  "Se ha guardado exitosamente",
                                MESSAGE_WARNING_GUARDADO_FALLIDO:  "No se ha podido guardar correctamente. Por favor, intente nuevamente",
                                PLACEHOLDER_MODULOS: "Ingrese valores a los modulos",
                                PLACEHOLDER_PUERTOS: "Ingrese valores a los puertos"
                                
	};
});