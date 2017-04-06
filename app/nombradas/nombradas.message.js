'use strict';

angular.module('sccnlp.nombradas')

.factory('nombradasMessages', function() {

    return {

        ingresoNombradaIndividual : "Ingreso de Nombrada Individual",
        ingresoNombradaMasiva : "Ingreso de Nombrada Masiva",
        modificarNombrada : "Modificar Nombrada",
        tabHeaderOne: "Paso 1: Ingreso de Nombrada",
        tabHeaderTwo: "Paso 2: Resolucion de Nombrada",
        tabHeaderOneMasiva: "Paso 1 de 2: Datos de Nombrada",
        tabHeaderTwoMasiva: "Paso 2 de 2: Resolución de Nombrada",
        fechainicio: "Fecha de Inicio de nombrada",
        fechaTurno: "Fecha y turno de la nombrada",
        turnoNombrada: "Turno de la nombrada",
        lugarTrabajo: "Lugar de Trabajo",
        puerto: "Puerto",
        nave: "Nave",
        sitio: "Sitio",
        lugar: "Lugar",
        posicion : "Posición",
        trabajador: "Trabajador",
        rut: "Rut",
        nombre: "Nombre",
        pasaporte: "Pasaporte",
        rutPasaporte : "Rut o Pasaporte",
        camposObligatorios : "* Campos obligatorios",
        messageValidate : "Este campo no puede estar en vacio",
        selectElijaOpcion : '-- elija una opción --',
        
        // Labels Tab 2
        messageResolucion : "A continuación, puede revisar la resolución de la Autoridad Maritima de acuerdo a los trabajadores incluido en la Nombrada.",
        messageCamposObligatorios: "Este campo no puede quedar en vacio",

        // Nombrada Masiva
        messageInformacionMasiva1: "Estimado empleador, usted puede realizar el ingreso de la Nombrada de forma masiva.",
        messageInformacionMasiva2: "Para realizar esta acción debe subir al sistema el archivo con el formato exactamente igual al ejemplo:",
        seleccionArchivo: "Ingrese su nombrada mediante la selección de un archivo",
        messageModalMasiva : "No ha cargado ningún archivo, por lo que no puede continuar el proceso. Vuelva a intentarlo.",
        messageModalMasivaFormato : "El archivo que ha cargado no tiene formato CSV. Vuelva a intentarlo.",
        messageModalMasivaObligatorio : "Existen datos obligatorios que no han sido ingresados en el archivo cargado, Favor corregir los mismos y cargar nuevamente el archivo",
        messageModalMasivaRut : "Los siguientes RUT´s ingresados en el archivo no son válidos. Favor corregir los mismos y cargar nuevamente el archivo:",
        messageModalMasivaRelacionesLborales : "No existen relaciones laborales vigentes en determinados trabajadores, razón por la cual no se puede generar la carga del archivo. Favor corregir los mismos y cargar nuevamente el archivo.",
        messageModalMasivaFechaInicio :"La fecha y hora de inicio de su nombrada debe ser inferior al inicio de la jornada, razón por la cual no puede ser ingresada la nombrada. Por favor corrija la información y vuelva a ingresar el archivo si corresponde",
        messageModalMasivaConexionMaritima : "En este momento no se tiene enlace de comunicación con la autoridad marítima. Por favor, vuelva a intentarlo más tarde.",

        // Consulta de Nombradas
        consultaNombrada : "Consulta Nombrada",
        idNombrada : "ID Nombrada",
        labor : "Labor",
        estado : "Estado",
        funcion : "Función",

        //modificar nombrada
        tabHeaderOneModificar : "Paso 1 de 2: Modificar Nombrada",

        //Buttons
        BTN_cancelar: "Cancelar",
        BTN_continuar: "Continuar",
        BTN_limpiar: "Limpiar",
        BTN_buscar: "Buscar",
        BTN_addLabor: "Añadir Labor",
        BTN_finalizar: "Salir",
        BTN_AnadirTrabajador: "Añadir Trabajador",
        BTN_Eliminar: "Eliminar",
        BTN_ExportarExcel: "Exportar a Excel",
        BTN_Ejemplo: "Ver Ejemplo",
        BTN_Examinar: "Examinar",
        BTN_Guardar: "Guardar",

    };
});