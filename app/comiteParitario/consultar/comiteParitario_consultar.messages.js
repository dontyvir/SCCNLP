'use strict';

angular.module('sccnlp.comiteParitario')

.factory('comiteParitarioConsultarMessages', function() {
    return {
        consultarComiteParitario: "Consultar Comité Paritario",
        detalleComite: "Detalle Comité Paritario",
        datosEmpresa: "Datos de la Empresa",
        datosComite: "Datos del Comité",

        rutEmpresa: "Rut Empresa",
        nombreRazon: "Nombre razón social",
        rutRepresentante: "Rut representante legal ",
        nombreRepresentanteLegal: "Nombre representante legal",
        rutRepresentanteEmpresa: "Rut representante de la empresa",
        rutRepresentanteTrabajadores: "Rut representante de los trabajadores",
        direccionFaena: "Dirección de faena/agencia/sucursal o permanente",
        comuna: "Comuna",
        region: "Región",
        fechaActoEleccionario: "Fecha acto eleccionario",
        tipoComite: "Tipo de Comité",
        faenaAgenciaSucursal: "faena, agencia o sucursal",
        permanente: "permanente",
        cantidadTrabajadores: "Cantidad de Trabajadores",
        asumeFunciones: "Comité Paritario de Higiene y Seguridad asume las funciones del Comité Paritario de Faena",
        datosRepresentateEmpresa : "Datos Representantes de los Empresa",
        datosRepresentateTrabajadores : "Datos Representantes de los Trabajadores",

        cargo: "Cargo",
        presidente: "Presidente",
        secretario: "Secretario",
        miembroComite: "Miembro del Comité",
        posicionVotacion: "Posición Votación",
        aforado: "Aforado",
        tipo: "Tipo",
        titular: "Titular",
        suplente: "Suplente",
        rut: "Rut",
        nombres: "Nombres",
        apellidoPaterno: "Apellido Paterno",
        apellidoMaterno: "Apellido Materno", 

        BTN_buscar: "Buscar",
        BTN_salir: "Salir",
        BTN_volver: "Volver",
        BTN_exportar : "Exportar a excel"
    };
});