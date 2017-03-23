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
        
        function DaySchedule(_dayLabel) {
        	
        	this.selected = false;
        	this.dayLabel = _dayLabel;
        	this.scheduleStart = null;
        	this.scheduleEnd = null;
        	this.tooltipOpen = false;
        }

        $scope.acuerdoJornadaLaboralModel = [
        		
        		new DaySchedule("Lunes"),
        		new DaySchedule("Martes"),
        		new DaySchedule("Miércoles"),
        		new DaySchedule("Jueves"),
        		new DaySchedule("Viernes"),
        		new DaySchedule("Sábado"),
        		new DaySchedule("Domingo"),
        ];
        
        // mensaje para el tooltip de error
        $scope.tooltipMSG = "";
        $scope.tooltipOpen = false;
        
        // si ya existían datos en el modelo padre, se llenan
        if(labor.horario){
        	
        	var horario = labor.horario;
        	var model = $scope.acuerdoJornadaLaboralModel;
        	
        	for(var i=0;i<horario.length;i++){
        		
        		// a qué día de la semana pertenece el objeto recorrido
        		var m = 0;
        		
        		switch(horario[i].dayLabel){
        		
        			case 'Lunes':
        				m=0;
        			break;
        			case 'Martes':
        				m=1;
        			break;
        			case 'Miércoles':
        				m=2;
        			break;
        			case 'Jueves':
        				m=3;
        			break;
        			case 'Viernes':
        				m=4;
        			break;
        			case 'Sábado':
        				m=5;
        			break;
        			case 'Domingo':
        				m=6;
        			break;
        			
        		}
        		
        		model[m] = horario[i];
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
        			
        			if(mod.scheduleStart){
        				if(!_ini) _ini = mod.scheduleStart;
        			}
        			mod.scheduleStart = _ini;
        			
        			if(mod.scheduleEnd){
        				if(!_ter) _ter = mod.scheduleEnd;
        			}
        			mod.scheduleEnd = _ter;
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
        			
        			if(!model[i].scheduleStart || !model[i].scheduleEnd){
        				
        				$scope.tooltipMSG = "Debe ingresar ambas horas";
        				model[i].tooltipOpen = true;
        				return false;
        			}
        			
        			if(model[i].scheduleStart.getTime() >= model[i].scheduleEnd.getTime()){
        				
        				$scope.tooltipMSG = "La hora de inicio debe ser menor a la de término";
        				model[i].tooltipOpen = true;
        				return false;
        			}
        			
        			total_horas_labor += $scope.horasDia(model[i].scheduleStart, model[i].scheduleEnd);
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
        		
        		if(lab.id == labor.id)
        			continue;
        		
        		for(var j=0;j<_lab.horario.length;j++){
        			
        			total_horas_semanales += $scope.horasDia(_lab.horario[j].scheduleStart, _lab.horario[j].scheduleEnd);
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
        	
        	for(var i=0;i<$scope.acuerdoJornadaLaboralModel.length;i++){
        		
        		if($scope.acuerdoJornadaLaboralModel[i].selected)
        			
        			selectedItems.push($scope.acuerdoJornadaLaboralModel[i]);
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
        		jornada.scheduleStart = null;
        		jornada.scheduleEnd = null;
        	}
        };
        
        /**
         * se cierra la ventana modal, sin enviar datos
         */
        $scope.dismissModal = function() {
        	
            $uibModalInstance.dismiss('cancel');
        };
    }

]);