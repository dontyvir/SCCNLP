'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('AcuerdoDescansoController', ['$scope', '$uibModalInstance', '_acuerdoActivo',
	
	function ($scope, $uibModalInstance, _acuerdoActivo) {
	
//  Labels correspondientes al acuerdo jornada laboral
	$scope.messages = {
			
		    acuerdoColectivoDescanso : 'Acuerdo Colectivo de Descanso',
		    rutSindicato : 'Rut / R.S.U. Sindicato',
		    ingreseRut : 'Ingrese Rut del Sindicato',
		    nombreSindicato : 'Nombre Sindicato',
		    representanteLegalSindicato : 'Representante Legal',
		    acuerdo : 'Nombre del acuerdo',
		    BTN_buscar : 'Buscar',
		    BTN_limpiar : 'Limpiar',
		    BTN_cancelar : 'Cancelar',
		    BTN_guardar : 'Guardar',
		    horaDesde : 'Hora Desde',
		    horaHasta : 'Hora Hasta',
		    selectElijaOpcion : '-- elija opción --',
		    validacionHoras : 'Hora Hasta debe ser posterior a Hora Desde'
	};
	
	//prototipo acuerdoDescanso
	
	function AcuerdoDescanso(_idSindicato, _hora_desde, _hora_hasta){
		
		this.id = null;
		this.idSindicato = (_idSindicato)?_idSindicato:''; // rut o R.S.U. del sindicato
		this.horaDesde = (_hora_desde)?_hora_desde:null;
		this.horaHasta = (_hora_hasta)?_hora_hasta:null;
	};

	$scope.validacionHoraOpen = false;
	$scope.acuerdoModal = null;

	$scope.validarHora = function() {
		
		var ac = $scope.acuerdoModal;
		
		if(ac.horaDesde && ac.horaHasta 
		   && ac.horaDesde.getTime() > ac.horaHasta.getTime()){
			
			$scope.validacionHoraOpen = true;
			return false;
		}

		$scope.validacionHoraOpen = false;
		return true;
	}
	
	/**
	 * Funciones modales
	 */
    $scope.clearSelected = function () {
    	
    	$scope.acuerdoModal = new AcuerdoDescanso();
    }
    
    $scope.dismissModal = function (form) {
    	 
    	 $uibModalInstance.dismiss('cancel');
    }

    $scope.saveAcuerdoColectivoDescanso = function (form) {

    	if(form && form.$invalid){
    		return;
    	}
    	
    	if(!$scope.validarHora())
    		return;
    	
    	var _acuerdo = new AcuerdoDescanso(
    			$scope.acuerdoModal.idSindicato,
    			$scope.acuerdoModal.horaDesde,
    			$scope.acuerdoModal.horaHasta
    	);
    	
    	$uibModalInstance.close(_acuerdo);
    };
	
	// init de Modelo
	if(_acuerdoActivo)
		$scope.acuerdoModal = angular.copy(_acuerdoActivo);
	
}])

.factory('loadAcuerdoDescanso',['$uibModal',function($uibModal){
	
   function loadAcuerdoDescanso(datosLaborales){
    	
	    var modalInstance = $uibModal.open({

		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'relacion_laboral/acuerdo_colectivo_descanso/acuerdo_colectivo_descanso.modal.view.html',
		      controller: 'AcuerdoDescansoController',
		      controllerAs: '$ctrl',
		      backdrop : 'static',
		      resolve: {
		    	  _acuerdoActivo: function () { return datosLaborales.acuerdoDescanso; }
		      }
		    });

		    modalInstance.result.then(function (acuerdo_descanso) {
		    	
		    	if(!acuerdo_descanso)
		    		datosLaborales.acuerdoDescanso = null;
		    	else
		    		datosLaborales.acuerdoDescanso = acuerdo_descanso;
		    	
		    }, function () {
		    	
		      console.log('Modal dismissed at: ' + new Date());
		    });
	    };
	
	return loadAcuerdoDescanso;
}])