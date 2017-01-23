module Lui {
	"use strict";

	// angular.module('lui.filters', []);
	// angular.module('lui.services', ['cgNotify']);
	// angular.module('lui.formly', ['formly']);
	// angular.module('lui.directives', ['pascalprecht.translate', 'ui.select', 'ui.bootstrap', "ngImgCrop", 'lui.filters']);


	// // all the templates in one module
	// angular.module('lui.templates.momentpicker', []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	// angular.module("lui.templates.daterangepicker", []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	// angular.module("lui.templates.translationsinput", []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	// angular.module('lui.templates', ['lui.templates.momentpicker', "lui.templates.daterangepicker", "lui.templates.translationsinput"]);

	// // all the translations in one module
	// angular.module('lui.translates.userpicker', []);
	// angular.module('lui.translates.daterangepicker', []);
	// angular.module('lui.translates.tablegrid', []);
	// angular.module('lui.translates.imagepicker', []);
	// angular.module('lui.translates', ['pascalprecht.translate','lui.translates.userpicker','lui.translates.daterangepicker','lui.translates.tablegrid', 'lui.translates.imagepicker']);

	// angular.module('lui', ['lui.directives','lui.services','lui.filters','lui.templates','lui.translates']);

	angular.module("moment", []).factory("moment", () => moment );
	angular.module("underscore", []).factory("_", () => _ );
	angular.module("iban", []).factory("iban", () => IBAN );

	angular.module("lui", ["ngSanitize", "ui.bootstrap", "ui.select", "moment", "underscore"]);

	angular.module("lui.notify", ["lui", "cgNotify"]);
	angular.module("lui.formly", ["lui", "formly"]);
	angular.module("lui.crop", ["lui", "ngImgCrop"]);
	angular.module("lui.translate", ["lui", "pascalprecht.translate"]);
	angular.module("lui.iban", ["lui", "iban"]);

}
