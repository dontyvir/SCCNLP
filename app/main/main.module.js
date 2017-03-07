'use strict';

angular.module('sccnlp.main',['ui.router', 'sccnlp.session'])

.config(['$stateProvider', function($stateProvider) {
	
	$stateProvider
	
	.state('main',{
		url : '/',
		abstract : true,
		templateUrl : 'main/composite.view.html',
		data: { requiresLogin: true }
	})

	.state('main.composite',{
		// para los submódulos las url tienen que escribirse sin el / inicial
		url : 'main',
		views : {
			"header" : {
				templateUrl : 'main/main.header.view.html'
			},
			"menu" : {
		    	templateUrl: 'menu/menu.view.html',
			    controller: 'MenuCtrl',
			    controllerAs: 'menu'
			},
            "": {
                templateUrl : 'main/main.default.view.html'
            },
			"footer" : {
				templateUrl : 'main/main.footer.view.html'
			}
		}

	})
	
}])
