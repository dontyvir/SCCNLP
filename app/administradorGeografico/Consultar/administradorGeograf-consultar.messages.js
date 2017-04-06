'use strict';

angular.module('sccnlp.administradorGeograf-consultar')

        .factory('administradorGeografConsultarMessages', function () {

            return {
                CONSULTAR_LOCACIONES: "Consultar Locaciones",                
                RUT_EMPRESA:    "Rut empresa",
                NOMBRE_EMPRESA: "Nombre empresa",
                DIRECCION_CASA_MATRIZ:  "Dirección casa matriz",
                DIRECCION_CASA_MATRIZ_header:  "Dirección Casa Matriz",
                PUERTO: "Puerto",
                POSICION:  "Posición",
                LUGAR:  "Lugar",
                BUSCAR_BTN: "Buscar",
                EXPORTAR_EXCEL_BTN: "Exportar a Excel",
                MODIFICAR:   "Modificar",
                ELIMINAR:   "Eliminar",
                SALIR_BTN:    "Salir",
                CANCELAR_BTN:   "Cancelar",
                GUARDAR_BTN:    "Guardar",
                MODIFICAR_LOCACION: "Modificar Locación",
                OK_BTN: "OK",
                MESSAGE_CON_DIRECTMAR:  "En este momento no se tiene enlace de comunicacion con la autoridad marítima. Por favor, vuelva a intentarlo más tarde",
                MESSAGE_CON_GMAPS:  "En este momento no se tiene enlace de comunicacion con Google Maps. Por favor, vuelva a intentarlo más tarde.",
                MESSAGE_CONFIRM_DELETE: "Usted ha seleccionado eliminar la locación. ¿Confirma que desea continuar?"
            };
        });