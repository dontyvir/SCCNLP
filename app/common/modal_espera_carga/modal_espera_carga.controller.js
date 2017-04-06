angular.module('sccnlp.common')

.factory('ModalEsperaCarga', ['$uibModal', function($uibModal){

	function ModalEsperaCarga(){
		
		//Modal
	    var modalInstance = $uibModal.open({

		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'common/modal_espera_carga/modal_espera_carga.view.html',
		      backdrop : 'static'
		    });
	    return modalInstance;
	}
	
	return ModalEsperaCarga;
}])
