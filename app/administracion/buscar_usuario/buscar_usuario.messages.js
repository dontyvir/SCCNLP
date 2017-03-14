'use strict';

angular.module('sccnlp.buscar_usuario')
//.factory('loginMessages', function(){
.factory('buscar_usuarioMessages', function(){
	return {
				LAB_TITULO : "Buscar Usuarios",
				RUT_PLACEHOLDER: "Ejemplo: 12345678-0",
				LAB_RUT : "Rut:",
				BTN_BUSCAR : "Buscar",
				LAB_NOMBRE : "Nombre",
				HEADER_RUT : "Rut",
				HEADER_NOMBRES: "Nombres",
				HEADER_APELLIDOS: "Apellidos",
				HEADER_MODULOS:"Modulos",
				HEADER_MODIFICAR:"Añadir/Quitar",
				HEADER_VIGENCIA:"Vigencia",
				BTN_CANCELAR:"Cancelar",
				BTN_SALIR:"Salir",
				LAB_TITULO_EDITAR:"Modificar usuario",
				HEADER_MODULO:"Modulo"
	};
});