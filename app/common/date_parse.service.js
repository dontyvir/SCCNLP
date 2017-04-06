'use strict';

angular.module('sccnlp.common')

.factory('DateParser', [ function () {
	
	var wrapper = {};
	
	var regexTime = /^([01]\d|2[0-3]):?([0-5]\d?)(:([0-5]\d?))?$/;
	
	wrapper.timeToDate = function(time){
		
		if(typeof time != 'string')
			return time;
		
		if(time.match(regexTime)){
			var split = time.split(":");
			var date = new Date();
			date.setHours(parseInt(split[0]),parseInt(split[1]),0,0,0);
			return date;
		}
		
		return time;
	}
	
	wrapper.strToDate = function(dateStr){
		if(typeof dateStr != 'string')
			return dateStr;
		
		return new Date(dateStr);
	}
	return wrapper;
}])