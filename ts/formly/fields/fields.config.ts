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
		// formlyConfigProvider.setType({
		// 	name: "date_minmax",
		// 	templateUrl: "lui/templates/formly/fields/date-minmax.html",
		// });
		// formlyConfigProvider.setType({
		// 	name: "user",
		// 	templateUrl: "lui/templates/formly/fields/user.html",
		// });
		// formlyConfigProvider.setType({
		// 	name: "api_select",
		// 	templateUrl: "lui/templates/formly/fields/api-select.html",
		// });
		// formlyConfigProvider.setType({
		// 	name: "picture",
		// 	templateUrl: "lui/templates/formly/fields/picture.html",
		// });
	}]);
}
