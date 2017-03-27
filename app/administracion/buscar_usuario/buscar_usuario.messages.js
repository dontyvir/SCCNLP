'use strict';

angular.module('sccnlp.buscar_usuario')
//.factory('loginMessages', function(){
        .factory('buscar_usuarioMessages', function () {
            return {
                LAB_TITULO: "Buscar Usuarios",
                RUT_PLACEHOLDER: "Ejemplo: 12345678-0",
                LAB_RUT: "Rut:",
                BTN_BUSCAR: "Buscar",
                LAB_NOMBRE: "Nombre",
                HEADER_RUT: "Rut",
                HEADER_NOMBRES: "Nombres",
                HEADER_APELLIDOS: "Apellidos",
                HEADER_MODULOS: "Modulos",
                HEADER_PUERTOS: "Puertos",
                HEADER_VIGENCIA: "Vigencia",
                BTN_CANCELAR: "Cancelar",
                BTN_SALIR: "Salir",
                LAB_TITULO_EDITAR: "Modificar usuario",
                HEADER_MODULO: "Modulo",
                ADD_REMOVE_MODULOS: "Añadir/Quitar modulo/s",
                ADD_REMOVE_PUERTOS: "Añadir/Quitar puertos/s",
                EXPORTAR_EXCEL_BTN: "Exportar a Excel",
                GUARDAR_BTN: "Guardar",
                CANCELAR_BTN: "Cancelar",
                USUARIO_HEADER_MODULOS: "Modulos",
                USUARIO_HEADER_PUERTOS: "Puertos",
                MESSAGE_WARNING_RUT: "El RUT ingresado no es válido. Vuelva a intentarlo.",
                MESSAGE_WARNING_NO_SERVICE: "En este momento no se tiene enlace con el servicio. Por favor, vuelva a intentarlo mas tarde.",
                MESSAGE_WARNING_PERSONA_NO_ENCONTRADA: "Los criterios de búsqueda ingresados, no tienen resultados asociados. Vuelva a intentarlo.",
                TEXT_SI: "SI",
                TEXT_NO: "NO",
                ACEPTAR_BTN: 'OK',
                LABEL_VIGENCIA: 'Vigencia',
                MESSAGE_GUARDADO_EXITOSO : "Guardado Exitosamente",
                USUARIO_HEADER_RUT : "Rut",
                USUARIO_HEADER_NOMBRES: "Nombres",
                USUARIO_HEADER_APELLIDOS: "Apellidos",
                USUARIO_HEADER_ELIMINAR:"Eliminar"
            };
        });