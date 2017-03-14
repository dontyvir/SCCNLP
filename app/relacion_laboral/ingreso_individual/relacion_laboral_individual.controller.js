'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('RelIndividualCtrl', ['$scope', 'ingIndivMessages', '$uibModal', 'RestClient',
	
	function($scope, ingIndivMessages, $uibModal, RestClient) {
	
	$scope.messages = ingIndivMessages;
	
	//tabs
	$scope.tabsActive = 0;
	$scope.tabs = [
		{disable : false}, //tab datos de la empresa
	    {disable : true}, // tab datos del trabajador
	    {disable : true} // tab datos del contrato
	]
	
	// Datos del empleador Model
	
	$scope.empleador = {
			
			rutEmpleador : null,
			nombreEmpresa :null,
			tipoEmpresa : null,
			domicilio : null,
			email : null,
			terminoDeVigencia : null,
			rutRepresentanteLegal : null,
			nombreCompletoRepresentanteLegal :null,
			
			// data de usuario?
			rutUsuarioQueRegistra : null,
			nombreCompletoUsuarioQueRegistraData : null,
			cargoEnLaEmpresaQueRegistraData : null
			
	};
	
    // Datos del trabajador Model
	
	$scope.trabajador = {
		
			loading : false, // flag para elemento en pantalla

			AFPSelected : null,
			ISAPRESelected : null,
			domicilio : null,
			email : null,
			documentoIdentificador : 'rut', // opción por defecto
			numDocIdentificador : null,
			
			nombreCompleto : null,
			nacionalidad : null,
			lugarDeNacimiento : null,
			fechaDeNacimiento : null,
			estadoCivil : null
			
	};
	
	
	// prototipo datos Labores
	
	function DatosLabores(_id) {
		
		this.id = _id,
		this.laborSelect = null;
		this.funcionSelect = null;
		this.lugarPrestacionServicios = null;
		this.sisTurno = null;
		this.horario = null;
		this.acuerdoDescanso = null;
		this.remunBruta = null;
		this.tipoJornada = null;
		
	}
	
	// información del contrato Model
	
	$scope.contrato = {
			
		    lugarDeCelebracionDelContrato : null,
		    fechaDeCelebracionDelContrato : null,
		    tipoContratoSelected : null,
		    fechaDeInicioDelContrato : null,
		    fechaTerminoDelContrato : null,
		    diaDePagoSelected : null,
		    total : 0,
		    datosLabores : [new DatosLabores(0)]
			
	};
	
    /**
     * Variables para recibir listados en combobox
     */
    $scope.AFP = [];
    $scope.ISAPRE = [];
    $scope.tipoContrato = [];
    $scope.diasDePago = [];
    $scope.labores = [];
    $scope.funciones = [];
    $scope.tiposJornada = [];
    $scope.tiposTurno = [];
    
    
    /**
     * Métodos
     */

    $scope.addRow = function () {
    	var id = $scope.contrato.datosLabores.length;
    	$scope.contrato.datosLabores.push(new DatosLabores(id));
    };
    
    $scope.deleteRow = function(rowModel) {
    	
    	var datos = $scope.contrato.datosLabores;
    	
    	datos.splice(rowModel.id, 1); // remove 1 element from index rowModel.id
    	
    	for(var i=rowModel.id;i<datos.length;i++){
    		datos[i].id--;
    	}
    }

    /*
     * Validate the tab 2 form if all mandatory elements are completed by
     * the user
     * @returns {boolean}
     */
    $scope.validateTabTwo = function () {
        return true;
    };

    /**
     * Clear all values of the main form and the inner forms
     * @returns {undefined}
     */
    $scope.cleanForm = function () {
       
    };

    $scope.validateInfo = function () {
     
    };

    $scope.updateTotal = function () {

    	var total = 0;
    	var length = $scope.contrato.datosLabores.length;
    	
    	for(var i=0; i < length; i++) {
    		
    		var remun = $scope.contrato.datosLabores[i].remunBruta;
    		if(remun && !isNaN(remun))
    		total += remun;
    	}
    	
    	$scope.contrato.total = total;
    };

    $scope.dateOptions = {
    	    formatYear: 'yy',
    	    maxDate: new Date(2020, 5, 22),
    	    minDate: new Date(),
    	    startingDay: 1
    	  };
  
    $scope.dateFormat = 'dd/MM/yyyy';
    
    $scope.popupFecNacTrab   = {opened : false};
    $scope.popupFecCelebCont = {opened : false};
    $scope.popupFecIniCont   = {opened : false};
    $scope.popupFecTerCont   = {opened : false};
    
    $scope.openDatePicker = function (popup) {
    		popup.opened = true;
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
    
    var $parentCtl = $scope;
    
    $scope.loadAcuerdoJornadaLaboral = function (datosLaborales) {

	    var modalInstance = $uibModal.open({

	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'relacion_laboral/acuerdo_jornada_laboral/acuerdo_jornada_laboral.modal.view.html',
	      controller: 'AcuerdoJornadaLaboralController',
	      controllerAs: '$ctrl',
	      resolve: {
	          datosLaborales: function () { return datosLaborales; }
	      }
	    });

	    modalInstance.result.then(function (acuerdos_jornada) {
	    	
	    	if(acuerdos_jornada.length == 0)
	    		datosLaborales.horario = null;
	    	else
		    	datosLaborales.horario = acuerdos_jornada;
	    	
	    }, function () {
	    	
	      console.log('Modal dismissed at: ' + new Date());
	    });
    };
    
    $scope.loadAcuerdoDescanso = function (datosLaborales){
    	
	    var modalInstance = $uibModal.open({

		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'relacion_laboral/acuerdo_colectivo_descanso/acuerdo_colectivo_descanso.modal.view.html',
		      controller: 'AcuerdoDescansoController',
		      controllerAs: '$ctrl',
		      resolve: {
		          datosLaborales: function () { return datosLaborales; }
		      }
		    });

		    modalInstance.result.then(function (acuerdos_descanso) {
		    	
		    	if(!acuerdos_descanso)
		    		datosLaborales.acuerdoDescanso = null;
		    	else
		    		datosLaborales.acuerdoDescanso = acuerdos_descanso;
		    	
		    }, function () {
		    	
		      console.log('Modal dismissed at: ' + new Date());
		    });
	    };

	    $scope.printSchedule = function(data){
	    	return data;
	    };
	    
	    $scope.printAgreement = function(data){
	    	return data;
	    };
	    
	    $scope.ingresoContinue = function(tab) {
	    	
	    	if(!tab || tab < 1 || tab > 2)
	    		return;

	    	$scope.tabs[tab].disable = false;
	    	$scope.tabsActive = tab;
	    	
	    };

	    $scope.ingresoSubmit = function() {
	    	
	    	//RegistrarContrato.registrar($scope.trabajador, $scope.empleador, $scope.contrato);

	    }
	    
	    /**
	     * Métodos de carga dinámica de datos
	     */
	    

	    /**
	     * This section will search the user information and will load it in the
	     * tab 2
	     * @param p_rut will receive the rut to search the information and load
	     * @returns {undefined}
	     */
	    $scope.loadDataUsuario = function (p_rut) {
	    	
	        //:TODO search the user information
	        $scope.trabajador.nombreCompleto = 'Fernando Salgado Muñoz';
	        $scope.trabajador.nacionalidad = 'Chilena';
	        $scope.trabajador.lugarDeNacimiento = 'Iquique';
	        $scope.trabajador.fechaDeNacimiento = new Date(1982,1,3);
	        $scope.trabajador.estadoCivil = 'Casado';
	    };
	    
	    $scope.loadEmpleador = function(){
	    	
	        var dat = RestClient.getDatosEmpresa("1","0", function(){
	        	
		        $scope.empleador.rutEmpleador = dat.rutEmpresa+"-"+dat.dvEmpresa;
		        $scope.empleador.nombreEmpresa = dat.razonSocial;
		        $scope.empleador.tipoEmpresa = dat.actividades[dat.idActividadPrincipal].glosaActividad;
		        
		        for(var i=0;i<dat.direcciones.length;i++){
		        	if(dat.direcciones[i].esCasaMatriz)
		    	        $scope.empleador.domicilio = dat.direcciones[i].direccion;
		        }

		        $scope.empleador.rutRepresentanteLegal = dat.representante.rut+"-"+dat.representante.dv;
		        $scope.empleador.nombreCompletoRepresentanteLegal = dat.representante.glosa;	        	

	        });
	    	
	        $scope.empleador.email = '';
	        $scope.empleador.terminoDeVigencia = null;
	        
	        $scope.empleador.rutUsuarioQueRegistra = '1.789.456-K';
	        $scope.empleador.nombreCompletoUsuarioQueRegistra = 'Pablo Muñoz';
	        $scope.empleador.cargoEnLaEmpresaQueRegistra = 'Apoderado';
	    }
	    
	    $scope.init = function() {
	    	
	    	$scope.estadoCivil = RestClient.getEstadoCivil();
	    	
	        $scope.AFP = RestClient.getAFP();

	        $scope.ISAPRE = RestClient.getIsapre();

	        $scope.tipoContrato = RestClient.getTipoContrato();

	        $scope.diasDePago = [];
	        for(var i=1;i<31;i++)
	        	$scope.diasDePago.push(i);
	        
	        $scope.labores = RestClient.getLabor();
	        $scope.funciones = RestClient.getFuncion();
	        $scope.tiposJornada = [{id:1,glosa:"Jornada 1"}];
	        $scope.tiposTurno = RestClient.getTurno();
	        
	        $scope.loadEmpleador();

	    	
	    };
	    
	    // se llaman las funciones de inicialización dinámicas
	    $scope.init();
}])
