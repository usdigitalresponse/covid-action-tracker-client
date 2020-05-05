'use strict';

import Vue from 'vue';
import moment from 'moment';


Vue.filter('date', function(str, format) {
	if (!format) {
		format = 'MMMM Do YYYY';
	}
	return str ? moment(str).format(format) : '';
});

Vue.filter('arrayToString', function(data) {
	if (!data) {
		return '';
	}
	return data.join(', ');
});


Vue.filter('datetime', function(str, format) {
	if (!format) {
		format = 'MMM Do YYYY, h:mm a';
	}
	return str ? moment(str).format(format) : '';
});

Vue.filter('phone', function (phone) {
    return phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
});

Vue.filter('number', function(number, digits) {
	
	if (!number) {
		number = 0;
	}

	if (digits){
		return number.toLocaleString('en-US', {
			minimumIntegerDigits: 2, 
			useGrouping: false
		})
	}

	return number.toLocaleString('en-US');

});
