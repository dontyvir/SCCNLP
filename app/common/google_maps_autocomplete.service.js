angular.module('sccnlp.common')

.factory('GoogleMapsAutoComplete', [function () {

	function GoogleMapsAutoComplete(input_elem, componentForm) {
		

		var addr_fields = {
	        street_number: 'short_name',
	        route: 'long_name',
	        locality: 'long_name',
	        administrative_area_level_1: 'short_name'
	    };

		
	    // inicialización google maps autocompletar
	    
	    var defaultBounds = new google.maps.LatLngBounds(
	    		  new google.maps.LatLng(-17.5372, -69.4837), // frontera con Perú / Bolivia
	    		  new google.maps.LatLng(-55.7499, -67.552)); // Cabo de Hornos

		var options = {
		  bounds: defaultBounds,
		  types: ['address']
		};
	
		var autocomplete = new google.maps.places.Autocomplete(input_elem, options);
		autocomplete.addListener('place_changed', function(){
						
	        // Get the place details from the autocomplete object.
	        var place = autocomplete.getPlace();

	        for (var com in componentForm) {
	          document.getElementById(componentForm[com]).value = '';
	        }

	        // Get each component of the address from the place details
	        // and fill the corresponding field on the form.
	        for (var i = 0; i < place.address_components.length; i++) {
	          var addressType = place.address_components[i].types[0];
	          if (addr_fields[addressType]) {
	            var val = place.address_components[i][addr_fields[addressType]];
	            document.getElementById(componentForm[addressType]).value = val;
	          }
	        }
			
			input_elem.value = '';
	        
		});
		
		return autocomplete;
	}
	
	return GoogleMapsAutoComplete;
}])