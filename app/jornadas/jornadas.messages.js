'use strict',

angular.module('sccnlp.jornadas')

.factory('jornadasMessages', function() {

    return {

        camposObligatorios: "* Campos Obligatorios",
        consultarjornadas: "Consultar Jornada",

        //-- JORNADA INDIVIDUAL ------
        ingresoIndividual: "Ingreso de Jornada Individual",
        tabHeaderOne: "Paso 1 de 2: Ingreso de Jornada",
        tabHeaderTwo: "Paso 2 de 2: Descargar copia de Registro",
        camposObligatoriosIngresar: "* Campos Obligatorios. El Lugar NO es obligatorio en caso de seleccionar un Nave",


        //--JORNADA INDIVIDUAL TAB 1 -----
        rut: "Rut",
        pasaporte: "Pasaporte",
        messageRegistroJornada: "A continuación, puede descargar el resultado del registro de Jornadas:",

        //---- JORNADA MASIVA -------------
        ingresoMasivo: "Ingreso de jornada Masiva",
        tabHeaderOneMasiva: "Paso 1 de 2: Datos de Jornada",
        messageJornadaMasiva: "Estimado empleador, usted puede realizar el ingreso de las Jornadas de forma masiva.",
        messageJornadaMasiva2: "Para realizar esta acción debe subir al sistema el archivo con el formato exactamente igual al ejemplo:",
        
        //----- CONSULTAR JORNADA ----------
        fechaInicioJornada : "Fecha inicio jornada",
        fechaInicioDescanso : "Fecha Inicio descanso",
        nave : "Nave",
        lugar : "Lugar",
        sitio : "Sitio",
        fechaTerminoJornada: "Fecha termino de jornada",
        fechaTerminDescanso: "Fecha termino de descanso",
        //--- BOTONES ----
        BTN_AnadirTrabajador: "Añadir Trabajador",
        BTN_limpiar: "limpiar",
        BTN_cancelar: "Cancelar",
        BTN_continuar: "Continuar",
        BTN_exportar: "Exportar a Excel",
        BTN_salir: "Salir",
        BTN_Ejemplo: "Ver ejemplo",
        BTN_buscar : "Buscar",
        BTN_salir : "Salir"

    };
});