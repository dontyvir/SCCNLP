'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('AcuerdoJornadaLaboralController', ['$scope', '$uibModalInstance', 'labor', 'labores',
	
	function ($scope, $uibModalInstance, labor, labores) {
	
        //Labels correspondientes al acuerdo jornada laboral
	
		$scope.messages = {

		        acuerdoJornadaLaboral : 'Acuerdo Jornada Laboral',
		        diaDeLaSemana : 'Día de la Semana',
		        horaInicio : 'Hora Inicio',
		        horaTermino : 'Hora Término',
		        BTN_limpiar : 'Limpiar',
		        BTN_cancelar : 'Cancelar',
		        BTN_aceptar : 'Aceptar'
		};
        
        // prototipo para clase día de seamana
        
        function DaySchedule(_dayLabel,_id) {
        	this.id = _id;
        	this.selected = false;
        	this.dayLabel = _dayLabel;
        	this.horaDesde = null;
        	this.horaHasta = null;
        	this.tooltipOpen = false;
        }

        $scope.acuerdoJornadaLaboralModel = [
        		
        		new DaySchedule("Lunes",    0),
        		new DaySchedule("Martes",   1),
        		new DaySchedule("Miércoles",2),
        		new DaySchedule("Jueves",   3),
        		new DaySchedule("Viernes",  4),
        		new DaySchedule("Sábado",   5),
        		new DaySchedule("Domingo",  6),
        ];
        
        // mensaje para el tooltip de error
        $scope.tooltipMSG = "";
        $scope.tooltipOpen = false;
        
        // si ya existían datos en el modelo padre, se llenan
        if(labor.horario){
        	
        	var horario = labor.horario;
        	var model = $scope.acuerdoJornadaLaboralModel;
        	
        	for(var i=0;i<horario.length;i++){

        		var id = horario[i].dia;
        		
        		model[id].selected = true;
        		model[id].horaDesde = horario[i].horaDesde;
        		model[id].horaHasta = horario[i].horaHasta;
        	}
        }

        $scope.marcarDias = function(){
        	
        	// marcamos de lunes a viernes
        	for(var i=0;i<5;i++)
        		$scope.acuerdoJornadaLaboralModel[i].selected = true;
        }
        
        $scope.replicarHoras = function(){
        	
        	var _ini = null;
        	var _ter = null;
        	
        	for(var i=0;i<7;i++){
        		var mod = $scope.acuerdoJornadaLaboralModel[i];
        	
        		if(mod.selected) {
        			
        			if(mod.horaDesde){
        				if(!_ini) _ini = mod.horaDesde;
        			}
        			mod.horaDesde = _ini;
        			
        			if(mod.horaHasta){
        				if(!_ter) _ter = mod.horaHasta;
        			}
        			mod.horaHasta = _ter;
        		}
        	}
        		
        }
        
        $scope.horasDia = function(_date_start, _date_end){
        	
			var date_diff = Math.abs(_date_end - _date_start);
			
			return date_diff/(3600 * 1000);
        }
        
        /**
         * Validación del formulario
         */
        $scope.validarForm = function(form){
        	
        	var total_horas_labor = 0;

        	var model = $scope.acuerdoJornadaLaboralModel;
        	
        	$scope.tooltipOpen = false;
        	
        	for(var i=0;i<model.length;i++){
        		
        		model[i].tooltipOpen = false;
        		
        		if(model[i].selected){
        			
        			if(!model[i].horaDesde || !model[i].horaHasta){
        				
        				$scope.tooltipMSG = "Debe ingresar ambas horas";
        				model[i].tooltipOpen = true;
        				return false;
        			}
        			
        			if(model[i].horaDesde.getTime() >= model[i].horaHasta.getTime()){
        				
        				$scope.tooltipMSG = "La hora de inicio debe ser menor a la de término";
        				model[i].tooltipOpen = true;
        				return false;
        			}
        			
        			total_horas_labor += $scope.horasDia(model[i].horaDesde, model[i].horaHasta);
        		}	
        	}
        	
        	var total_horas_semanales = total_horas_labor;
        	
        	// sumamos las horas de todas las labores
        	
        	for(var i=0;i<labores.length;i++){
        		
        		var _lab = labores[i];
        		
        		if(!_lab)
        			continue;
        		
        		if(!_lab.horario)
        			continue;
        		
        		if(_lab.id == labor.id)
        			continue;
        		
        		for(var j=0;j<_lab.horario.length;j++){
        			
        			total_horas_semanales += $scope.horasDia(_lab.horario[j].horaDesde, _lab.horario[j].horaHasta);
        		}
        	}

        	if(total_horas_semanales > 45){
 
        		$scope.tooltipMSG = "El total de horas en todas las labores no puede superar las 45 semanales";
        		$scope.tooltipOpen = true;
        		return false;
        	}
        	
        	if(total_horas_labor <= 0){

        		$scope.tooltipMSG = "Debe asignar horas trabajadas";
        		$scope.tooltipOpen = true;
        		return false;
        	}
        	
        	return true;
        }
        
        /**
         * Se devuelven items seleccionados
         */
        $scope.saveAcuerdoJornadaLaboral = function (form) {
        	
        	if(!$scope.validarForm(form))
        		return;
        	
        	var selectedItems = [];
        	var model = $scope.acuerdoJornadaLaboralModel;
        	
        	for(var i=0;i<model.length;i++){
        		
        		if(model[i].selected)
        			
        			selectedItems.push({dia: i,horaDesde: model[i].horaDesde, horaHasta: model[i].horaHasta});
        	}
        	
        	$uibModalInstance.close(selectedItems);
        };
        
        /**
         * Se limpia el formulario
         */
        $scope.cleanAcuerdoJornadaLaboral = function () {
        	
        	for(var i=0;i<$scope.acuerdoJornadaLaboralModel.length;i++){
        		
        		var jornada = $scope.acuerdoJornadaLaboralModel[i];
        		
        		jornada.selected = false;
        		jornada.horaDesde = null;
        		jornada.horaHasta = null;
        	}
        };
        
        /**
         * se cierra la ventana modal, sin enviar datos
         */
        $scope.dismissModal = function() {
        	
            $uibModalInstance.dismiss('cancel');
        };
    }

])

.factory('loadAcuerdoJornadaLaboral',['$uibModal',function($uibModal){
	
	 function loadAcuerdoJornadaLaboral(labor, labores) {

	    var modalInstance = $uibModal.open({

	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'relacion_laboral/acuerdo_jornada_laboral/acuerdo_jornada_laboral.modal.view.html',
	      controller: 'AcuerdoJornadaLaboralController',
	      controllerAs: '$ctrl',
	      backdrop : 'static',
	      resolve: {
	          labor: function(){ return labor},
	          labores : function(){return labores}
	      }
	    });

	    modalInstance.result.then(function (acuerdos_jornada) {
	    	
	    	if(acuerdos_jornada.length == 0)
	    		labor.horario = null;
	    	else
	    		labor.horario = acuerdos_jornada;
	    	
	    }, function () {
	    	
	      console.log('Modal dismissed at: ' + new Date());
	    });
	}
	 
	 return loadAcuerdoJornadaLaboral;
}])


