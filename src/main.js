// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//import $ from 'jquery-slim';
//var $jq = jQuery.noConflict(true);

//import $ from 'jquery-slim';

/*
import jQuery from 'jquery-slim';
var $ = jQuery.noConflict();
*/
//import 'popper.js';
//import 'bootstrap';

//var bootstrapButton = $.fn.button.noConflict() // return $.fn.button to previously assigned value
//$.fn.bootstrapBtn = bootstrapButton            // give $().bootstrapBtn the Bootstrap functionality

//require("@/assets/images/user-img-placeholder.png")

//var {insert name here} = JQuery.noConflict()
//import bootstrap from 'bootstrap';

//$.noConflict(true);

import Vue from 'vue';
import App from './App';
import Logger from './utils/Logger';
import './filters.js';
import * as VueGoogleMaps from 'vue2-google-maps'
import VueMq from 'vue-mq'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


Vue.use(VueMq, {
	breakpoints: { 
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200
	},
	defaultBreakpoint: 'sm'
});


Vue.use(VueGoogleMaps, {	
	load: {
		key: 'AIzaSyDPraGs0H2AgOZNacdILy0WTPgfFWDZ9fc',
		libraries: '', // drawing,visualization
	}
})

Vue.use(Logger, { level: 'debug' });

Vue.config.productionTip = false;

(function($) {

	// https://code.jquery.com/jquery-3.4.1.min.js
	// $.getScript() 
	// $.getScript("ajax/test.js", function(data, textStatus, jqxhr) {
	// 	 console.log(data); //data returned
	//	 console.log(textStatus); //success
	//	 console.log(jqxhr.status); //200
	//	 console.log('Load was performed.');
	//	});
	// alert($.fn.jquery);

	$('.actionTrackerVuePlugin').each( function() {
		
		let view = $(this).attr("view");
				
		new Vue({
			el: this,
			//el: `#ActionTracker_${view}`,
			template: `<App ref='${view}'/>`,
			components: { App }
		});

	});

} (jQuery));