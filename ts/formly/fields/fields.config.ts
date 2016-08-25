module dir.directive {
	"use strict";
	angular.module("lui.formlytemplates")
	.config(["formlyConfigProvider", (formlyConfigProvider: AngularFormly.IFormlyConfig) => {
		formlyConfigProvider.setType({
			name: "text",
			templateUrl: "lui/templates/formly/fields/text.html",
		});
		formlyConfigProvider.setType({
			name: "email",
			templateUrl: "lui/templates/formly/fields/email.html",
		});
		formlyConfigProvider.setType({
			name: "date",
			templateUrl: "lui/templates/formly/fields/date.html",
		});
		formlyConfigProvider.setType({
			name: "select",
			templateUrl: "lui/templates/formly/fields/select.html",
		});
		formlyConfigProvider.setType({
			name: "checkbox",
			templateUrl: "lui/templates/formly/fields/checkbox.html",
		});
		formlyConfigProvider.setType({
			name: "radio",
			templateUrl: "lui/templates/formly/fields/radio.html",
		});
	}]);
}
