(function(){
	'use strict';
	angular.module('moment', []).factory('moment', function () { return window.moment; });
	
	angular.module('lui.directives', []);
	angular.module('lui.filters', ['moment']);
	angular.module('lui.services', ['cgNotify']);
	// all the templates in one module
	angular.module('lui.templates.momentpicker', []); // module defined here and used in a different file so every page doesnt have to reference moment-picker.js
	angular.module('lui.templates', ['lui.templates.momentpicker']);

	angular.module('lui', ['lui.directives','lui.services','lui.filters','lui.templates']);
})();
