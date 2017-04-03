angular.module('sccnlp.common')

.factory('GoogleMapsAutoComplete', [function () {

	
	function GoogleMapsAutoComplete(input_elem) {
		
	    // inicialización google maps autocompletar
	    
	    var defaultBounds = new google.maps.LatLngBounds(
	    		  new google.maps.LatLng(-17.5372, -69.4837), // frontera con Perú / Bolivia
	    		  new google.maps.LatLng(-55.7499, -67.552)); // Cabo de Hornos

		var options = {
		  bounds: defaultBounds,
		  types: ['address']
		};
	
		var autocomplete = new google.maps.places.Autocomplete(input_elem, options);
		
		return autocomplete;
	}
	
	return GoogleMapsAutoComplete;
}])