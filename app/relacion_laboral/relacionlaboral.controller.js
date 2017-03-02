'use strict';

angular.module('sccnlp.ingresoRL')

.controller('RelacionLaboralController', ['$scope', function ($scope) {

    //Variables
    $scope.currentTab = 'tabOne';

    //Buttons
    $scope.BTN_cancelar = 'Cancelar';
    $scope.BTN_continuar = 'Continuar';
    $scope.BTN_limpiar = 'Limpiar';
    $scope.BTN_buscar = 'Buscar';
    $scope.BTN_addLabor = 'Añadir Labor';
    $scope.BTN_finalizar = 'Finalizar';

    // Labels Tab 1
    $scope.tabHeaderOne = 'Paso 1 de 3: Datos de la empresa';
    $scope.datosDelEmpleador = 'Datos del Empleador';
    $scope.rut = 'Rut';
    $scope.email = 'e-mail';
    $scope.domicilio = 'Domicilio';
    $scope.nombreEmpresa = 'Nombre empresa';
    $scope.tipoEmpresa = 'Tipo de empresa';
    $scope.terminoDeVigencia = 'Término de Vigencia';
    $scope.RepresentanteLegal = 'Representante Legal';
    $scope.nombreCompleto = 'Nombre Completo';
    $scope.usuarioQueRegistra = 'Usuario que registra';
    $scope.rutUsuario = 'Rut Usuario';
    $scope.nombreCompletoUsuario = 'Nombre Completo Usuario';
    $scope.cargoEnLaEmpresa = 'Cargo en la Empresa';

    //  Labels Tab 2
    $scope.tabHeaderTwo = 'Paso 2 de 3: Datos del Trabajador';
    $scope.informacionDelTrabajador = 'Información del Trabajador';
    $scope.pasaporteTrabajador = 'Pasaporte';
    $scope.nombreCompletoTrabajador = 'Nombre Completo';
    $scope.nacionalidadTrabajador = 'Nacionalidad';
    $scope.lugarDeNacimientoTrabajador = 'Lugar de Nacimiento';
    $scope.fechaDeNacimientoTrabajador = 'Fecha de Nacimiento';
    $scope.estadoCivilTrabajador = 'Estado Civil';
    $scope.AFPTrabajador = 'AFP';
    $scope.ISAPRETrabajador = 'ISAPRE';
    $scope.mandatoryFields = '* Campos Obligatorios';

    //  Labels Tab 3
    $scope.tabHeaderThree = 'Paso 3 de 3: Condiciones del Contrato';
    $scope.datosDelContrato = 'Datos del contrato';
    $scope.lugarDeCelebracionDelContrato = 'Lugar de celebración del contrato';
    $scope.fechaDeCelebracionDelContrato = 'Fecha de celebración del contrato';
    $scope.tipoDeContrato = 'Tipo de contrato';
    $scope.fechaDeInicioDelContrato = 'Fecha de inicio del contrato';
    $scope.fechaTerminoDelContrato = 'Fecha de término del contrato';
    $scope.diaDePago = 'Día de pago';
    $scope.deCadaMes = ' de cada mes';
    $scope.datosDeLasLaboresAsociadasAlContrato = 'Datos de las labores asociadas al contrato';
    $scope.labor = 'Labor';
    $scope.funcion = 'Función';
    $scope.lugarDePresentacionDelosServicios = 'Lugar de Presentación de los servicios';
    $scope.tipoDeJornada = 'Tipo de Jornada';
    $scope.sistemaDeTurno = 'Sistema de Turno';
    $scope.horario = 'Horario';
    $scope.acuerdoDeDescanso = 'Acuerdo de Descanso';
    $scope.remuneracionBruta = 'Remuneración Bruta (CLP)';
    $scope.total = 'Total';

    //  Data en duro
    $scope.rutEmpleadorValueData = '16.161.785-3';
    $scope.nombreEmpresaEmpleadorData = "everis";
    $scope.tipoEmpresaEmpleadorData = 'Consultoria';
    $scope.domicilioEmpleadorData = 'Alameda';
    $scope.emailEmpleadorData = 'everis@everis.com';
    $scope.terminoDeVigenciaEmpleadorData = '10/12/2018';
    $scope.rutRepresentanteLegalData = '8.478.213-1';
    $scope.nombreCompletoRepresentanteLegalData = 'Guillermo Fredez';
    $scope.rutUsuarioQueRegistraData = '1.789.456-K';
    $scope.nombreCompletoUsuarioQueRegistraData = 'Pablo Muñoz';
    $scope.cargoEnLaEmpresaQueRegistraData = 'Apoderado';

    $scope.NombreCompletoTrabajadorData = 'Fernando Salgado Muñoz';
    $scope.nacionalidadTrabajadorData = 'Chilena';
    $scope.lugarDeNacimientoTrabajadorData = 'Iquique';
    $scope.fechaDeNacimientoTrabajadorData = '04/02/1982';
    $scope.estadoCivilTrabajadorData = 'Casado';
    $scope.AFPSelected = '';
    $scope.ISAPRESelected = '';
    $scope.domicilioData = '';
    $scope.emailTrabajadorData = '';

    $scope.lugarDeCelebracionDelContratoData = '';
    $scope.fechaDeCelebracionDelContratoData = '';
    $scope.tipoContratoSelected = '';
    $scope.fechaDeInicioDelContratoData = '';
    $scope.fechaTerminoDelContratoData = '';
    $scope.diaDePagoSelected = '';
    $scope.totalData = '';
    $scope.acuerdoJornadaLaboralValues = [];


    //getters

    $scope.setCurrentTab = function (currentTab) {
        $scope.currentTab = currentTab;
    };

    $scope.getCurrentTab = function () {
        return $scope.currentTab;
    };

    $scope.compareCurrentTab = function (text) {
        if ($scope.currentTab === text)
            return true;
        return false;
    };

    $scope.getAFP = function () {
        return $scope.AFP;
    };

    $scope.getIsapre = function () {
        return $scope.ISAPRE;
    };

    $scope.getTipoContrato = function () {
        return $scope.tipoContrato;
    };

    $scope.getDiaDePago = function () {
        return $scope.diasDePago;
    };

    $scope.addRow = function () {
        $scope.tableDatosLaboresAsociadasContratoModel.push({value: '', displayName: ''});
    };

    $scope.getTableDatosLaboresAsociadasContratoModel = function () {
        return $scope.tableDatosLaboresAsociadasContratoModel;
    };


    $scope.AFP = [{value: 'AFP1', displayName: 'Modelo'},
        {value: 'AFP2', displayName: 'Habitat'}];

    $scope.ISAPRE = [{value: 'ISAPRE1', displayName: 'COLMENA'},
        {value: 'ISAPRE2', displayName: 'BANMEDICA'}];

    $scope.tipoContrato = [{value: 'Contrato1', displayName: 'TipoContrato1'},
        {value: 'Contrato2', displayName: 'TipoContrato2'}];

    $scope.diasDePago = [{value: '1', displayName: 'Primero'},
        {value: '5', displayName: 'Cinco'}];

    $scope.tableDatosLaboresAsociadasContratoModel = [{laborSelect: '', functionSelect: '', servicePresentationData: 'Hello', workingDaySelect: '', paymentDateSelect: '', scheduleData: '', agreementData: '', salaryData: ''},
        {laborSelect: '', functionSelect: '', servicePresentationData: 'Hola', workingDaySelect: '', paymentDateSelect: '', scheduleData: '', agreementData: '', salaryData: ''}];

    // Funciones de las tabs

    /* changeTabByButton
     * Funcion utilizada para cambiar los tab mediante un boton.
     * Utiliza las propiedades de los tab para cambiar a show/hide
     *
     * Input: 
     *      param1:  ID del actual tab <li>
     *      param2:  ID del nuevo tab <li>
     *      
     */
    $scope.changeTabByButton = function (currentTab, newTab) {
        $scope.setCurrentTab(newTab.charAt(2).toLowerCase() + newTab.slice(3, newTab.length));
        $('#' + currentTab).removeClass('active');
        $('#' + newTab).addClass('active');
    };

    /**
     * Clear all values of the main form and the inner forms
     * @returns {undefined}
     */
    $scope.cleanForm = function () {
        $scope.rutEmpleadorValueData = '';
    };
    
}]);