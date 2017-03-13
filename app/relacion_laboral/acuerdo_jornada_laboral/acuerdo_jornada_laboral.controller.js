'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('AcuerdoJornadaLaboralController', ['$scope', '$uibModalInstance', 'datosLaborales',
	
	function ($scope, $uibModalInstance, datosLaborales) {
	
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
        
        // si ya existían datos en el modelo padre, se llenan
        if(datosLaborales.horario){
        	
        	var horario = datosLaborales.horario;
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

        /**
         * Se devuelven items seleccionados
         */
        $scope.saveAcuerdoJornadaLaboral = function () {
        	
        	var selectedItems = [];
        	
        	for(var i in $scope.acuerdoJornadaLaboralModel){
        		
        		if($scope.acuerdoJornadaLaboralModel[i].selected)
        			
        			selectedItems.push($scope.acuerdoJornadaLaboralModel[i]);
        	}
        	
        	$uibModalInstance.close(selectedItems);
        };
        
        /**
         * Se limpia el formulario
         */
        $scope.cleanAcuerdoJornadaLaboral = function () {
        	
        	for(var i in $scope.acuerdoJornadaLaboralModel){
        		
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