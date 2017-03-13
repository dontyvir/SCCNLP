'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('AcuerdoDescansoController', ['$scope', '$uibModalInstance', 'datosLaborales',
	
	function ($scope, $uibModalInstance, datosLaborales) {
	
//  Labels correspondientes al acuerdo jornada laboral
	$scope.messages = {
			
		    acuerdoColectivoDescanso : 'Acuerdo Colectivo Descanso',
		    rutSindicato : 'Rut Sindicato',
		    ingreseRut : 'Ingrese Rut del Sindicato',
		    nombreSindicato : 'Nombre Sindicato',
		    representanteLegalSindicato : 'Representante Legal',
		    acuerdo : 'Acuerdo',
		    BTN_buscar : 'Buscar',
		    BTN_limpiar : 'Limpiar',
		    BTN_cancelar : 'Cancelar',
		    BTN_guardar : 'Guardar'
	};
	
	//prototipo acuerdoDescanso
	
	function AcuerdoDescanso(_rut, _nombre,_repLegal, _acuerdo){
		
		this.rutSindicato = _rut;
		this.nombreSindicato = _nombre,
		this.representanteLegalSindicato = _repLegal;
		this.acuerdo = _acuerdo;
	};
	
	//listado de acuerdos
	//TODO: implement dynamic loading
	$scope.acuerdos = [new AcuerdoDescanso("123456-7", "Syn1","Rep1","Acuerdo1"),
		               new AcuerdoDescanso("234567-8", "Syn2", "Rep2","Acuerdo2")];
	
	// init de Modelo
	if(datosLaborales.acuerdoDescanso)
		$scope.acuerdoDescanso = datosLaborales.acuerdoDescanso;
	else
		$scope.acuerdoDescanso = new AcuerdoDescanso('','','','');

	/**
	 * Funciones modales
	 */
    $scope.clearSelected = function () {
    	
    	$scope.acuerdoDescanso = new AcuerdoDescanso('','','','');
    }
    
    $scope.dismissModal = function () {
    	
    	 $uibModalInstance.dismiss('cancel');
    }

    $scope.saveAcuerdoColectivoDescanso = function () {
    	
    	$uibModalInstance.close($scope.acuerdoDescanso);
    };
	
}]);