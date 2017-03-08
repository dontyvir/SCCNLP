angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('RelIndividualCtrl', ['$scope', 'ingIndivMessages',
	
	function($scope, ingIndivMessages) {
	
	$scope.messages = ingIndivMessages;
	
    //  Data en duro

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
    $scope.totalData = Number(0);
    $scope.acuerdoJornadaLaboralValues = [];
    $scope.formRutButtonEnabled = false;
    $scope.gPlace;
    $scope.documentoIdentificador = '';
    $scope.rutConsulta ='';
    
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

    $scope.tableDatosLaboresAsociadasContratoModel = [{laborSelect: '', functionSelect: '', servicePresentationData: '', workingDaySelect: '', paymentDateSelect: '', scheduleData: '', agreementData: '', salaryData: ''},
        {laborSelect: '', functionSelect: '', servicePresentationData: '', workingDaySelect: '', paymentDateSelect: '', scheduleData: '', agreementData: '', salaryData: ''}];

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
//        var isFormValid = true;
//        if (currentTab === 'liTabTwo') {
//            isFormValid = $scope.validateTabTwo();
//            if (isFormValid === true) {
//                $('[href=#' +newTab.charAt(2).toLowerCase() + newTab.slice(3, newTab.length) + ']').tab('show');
//            }
//        }
//
//        if (isFormValid === true) {
//            $scope.setCurrentTab(newTab.charAt(2).toLowerCase() + newTab.slice(3, newTab.length));
//            $('#' + currentTab).removeClass('active');
//            $('#' + newTab).addClass('active');
//        }

    };

    /*
     * Validate the tab 2 form if all mandatory elements are completed by
     * the user
     * @returns {undefined}
     */
    $scope.validateTabTwo = function () {
        var formFull = true;

        if ($scope.rutConsulta === '')
            formFull = false;

        if ($scope.nombreCompletoTrabajadorData === '')
            formFull = false;
        if ($scope.nacionalidadTrabajadorData === '')
            formFull = false;

        if ($scope.lugarDeNacimientoTrabajadorData === '')
            formFull = false;

        if ($scope.fechaDeNacimientoTrabajadorData === '')
            formFull = false;

        if ($scope.estadoCivilTrabajadorData === '')
            formFull = false;

        if ($scope.domicilioData === '')
            formFull = false;

        if ($scope.emailTrabajadorData === '')
            formFull = false;
        if ($scope.documentoIdentificador === 'rut') {
            if ($scope.AFPSelected === '')
                formFull = false;
            if ($scope.ISAPRESelected === '')
                formFull = false;
        }

        if (formFull === false) {
            alert('Complete todos los campos');
            return formFull;
        }
        return formFull;
    };

    /**
     * Clear all values of the main form and the inner forms
     * @returns {undefined}
     */
    $scope.cleanForm = function () {
        $scope.rutEmpleadorValueData = '';
    };

    $scope.validateInfo = function () {
        //:todo Validate fo         
    };

    $scope.updateTotal = function () {
//        $scope.totalData = parseInt(0);
//        for (i in $scope.tableDatosLaboresAsociadasContratoModel) {
//            $scope.totalData = parseInt($scope.totalData) + parseInt($scope.tableDatosLaboresAsociadasContratoModel[i].salaryData);
//        }
    };

    
    /*
     * Initialize the date picker for tab 3
     * @param {type} p_index
     * @returns {undefined}
     */
    $scope.dateOptions = {
    	    formatYear: 'yy',
    	    maxDate: new Date(2020, 5, 22),
    	    minDate: new Date(),
    	    startingDay: 1
    	  };
  
    $scope.dateFormat = 'dd-MM-yyyy';
    
    $scope.popupFecCelebCont = {opened : false};
    $scope.popupFecIniCont   = {opened : false};
    $scope.popupFecTerCont   = {opened : false};
    
    $scope.openDatePicker = function (popup) {
    		popup.opened = true;
    };

    /**
     * Load the information from tab 1. The data is getted from DTPlus
     * @returns {undefined}
     */
    $scope.loadDataFromDTPlus = function () {
        //: TODO connect to DTPlus to fill all the following data

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
    };

    /**
     * This section will search the user information and will load it in the
     * tab 2
     * @param p_rut will receive the rut to search the information and load
     * @returns {undefined}
     */
    $scope.loadDataFromRutService = function (p_rut) {
        //:TODO search the user information
        $scope.nombreCompletoTrabajadorData = 'Fernando Salgado Muñoz';
        $scope.nacionalidadTrabajadorData = 'Chilena';
        $scope.lugarDeNacimientoTrabajadorData = 'Iquique';
        $scope.fechaDeNacimientoTrabajadorData = '04/02/1982';
        $scope.estadoCivilTrabajadorData = 'Casado';
    };

    /**
     * Function to validate the rut if typed in the form. Will validate
     * for each character and will change the variable $scope.formRutButtonEnabled = true
     * to activate the "Buscar" button
     * @param {type} rut
     * @returns {undefined}
     */
    $scope.validateRut = function (rut) {
        var errores = false;
        if ('Undefined' !== rut || '' !== rut) {

            if (/^[0-9]+-[0-9kK]{1}$/.test(rut)) {
                var valor = String(rut).replace('.', '');
                valor = valor.replace('-', '');
                var cuerpo = valor.slice(0, -1);
                var dv = valor.slice(-1).toUpperCase();

                if (cuerpo.length < 7) {
                    errores = true;
                }

                var suma = 0;
                var multiplo = 2;
                var length = cuerpo.length;
                for (var i = 1; i <= cuerpo.length; i++) {
                    var index = multiplo * cuerpo.charAt(length - i);

                    suma = suma + index;

                    if (multiplo < 7) {
                        multiplo = multiplo + 1;
                    } else {
                        multiplo = 2;
                    }

                }

                var dvEsperado = 11 - (suma % 11);

                dv = (dv === 'K') ? 10 : dv;
                dv = (dv === 0) ? 11 : dv;

                if (dvEsperado !== parseInt(dv)) {
                    errores = true;
                }
                if (errores === false) {
                    $scope.formRutButtonEnabled = true;
                }
            } else
                $scope.formRutButtonEnabled = false;
        }

    };

}])