module Lui {
	"use strict";
	interface IFormlyConfig {
		setType(type: { name: string, templateUrl: string }): void;
	}
	angular.module("lui.formly")
	.config(["formlyConfigProvider", (formlyConfigProvider: IFormlyConfig) => {
		formlyConfigProvider.setType({
			name: "text",
			templateUrl: "lui/templates/formly/fields/text.html",
		});
		formlyConfigProvider.setType({
			name: "textarea",
			templateUrl: "lui/templates/formly/fields/textarea.html",
		});
		formlyConfigProvider.setType({
			name: "number",
			templateUrl: "lui/templates/formly/fields/number.html",
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
			name: "daterange",
			templateUrl: "lui/templates/formly/fields/daterange.html",
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
		formlyConfigProvider.setType({
			name: "picture",
			templateUrl: "lui/templates/formly/fields/picture.html",
		});
		formlyConfigProvider.setType({
			name: "portrait",
			templateUrl: "lui/templates/formly/fields/portrait.html",
		});
		formlyConfigProvider.setType({
			name: "user",
			templateUrl: "lui/templates/formly/fields/user.html",
		});
		formlyConfigProvider.setType({
			name: "user_multiple",
			templateUrl: "lui/templates/formly/fields/user-multiple.html",
		});
		formlyConfigProvider.setType({
			name: "api_select",
			templateUrl: "lui/templates/formly/fields/api-select.html",
		});
		formlyConfigProvider.setType({
			name: "api_select_multiple",
			templateUrl: "lui/templates/formly/fields/api-select-multiple.html",
		});
		formlyConfigProvider.setType({
			name: "iban",
			templateUrl: "lui/templates/formly/fields/iban.html",
		});
		formlyConfigProvider.setType({
			name: "department",
			templateUrl: "lui/templates/formly/fields/department.html",
		});
	}]);
}
