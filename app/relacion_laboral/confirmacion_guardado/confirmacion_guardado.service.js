'use strict';

angular.module('sccnlp.relacionLaboral')

.factory('ConfirmacionGuardado', ['$uibModal', function ($uibModal) {
	
	function ConfirmacionGuardado(_title, _message){
		
		return $uibModal.open({

		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'relacion_laboral/confirmacion_guardado/confirmacion_modificar.modal.view.html',
		      controller: 'ConfirmacionGuardadoCtrl',
		      controllerAs: '$ctrl',
		      backdrop : 'static',
		      resolve : {
		    	  title   : function(){return _title;},
		    	  message : function(){return _message;}
		      }
		    });
	}
	
	return ConfirmacionGuardado;
}])

.factory('RecordatorioLegal', ['$uibModal', function ($uibModal) {
	
	function RecordatorioLegal(){
		
		return $uibModal.open({

		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'relacion_laboral/confirmacion_guardado/recordatorio_legal.modal.view.html',
		      controller: 'ConfirmacionGuardadoCtrl',
		      controllerAs: '$ctrl',
		      backdrop : 'static',
		      resolve : {
		    	  title   : function(){return null;},
		    	  message : function(){return null;}
		      }
		    });
	}
	
	return RecordatorioLegal;
}])