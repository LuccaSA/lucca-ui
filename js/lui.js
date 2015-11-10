(function(){
	'use strict';
	angular.module('moment', []).factory('moment', function () { return window.moment; });
	angular.module('underscore', []).factory('_', function () { return window._; });
	
	angular.module('lui.directives', ['moment', 'underscore', 'ui.select', 'ui.bootstrap']);
	angular.module('lui.filters', ['moment']);
	angular.module('lui.services', []);

	// all the templates in one module
	angular.module('lui.templates.momentpicker', []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module("lui.templates.daterangepicker", []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module('lui.templates', ['lui.templates.momentpicker', "lui.templates.daterangepicker"]);
	
	// all the translations in one module
	angular.module('lui.translates.userpicker', []);
	angular.module('lui.translates.daterangepicker', []);
	angular.module('lui.translates', ['pascalprecht.translate','lui.translates.userpicker','lui.translates.daterangepicker']);
	
	angular.module('lui', ['lui.directives','lui.services','lui.filters','lui.templates','lui.translates']);
})();
