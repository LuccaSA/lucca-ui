(function(){
	'use strict';

	angular.module('demoApp')
	.controller('formlyCtrl', ['$scope', function($scope){
		$scope.model = {
			text1: "lol",
		};
		$scope.fields = [
			{
				key: "firstName",
				type: "text",
				templateOptions: {
					label: "first name",
					required: true,
				},
			},
			{
				key: "lastName",
				type: "text",
				templateOptions: {
					label: "last name",
					required: true,
					requiredMessage: "this is a custom required message just for this field",
				},
			},
		];
		$scope.options = { formState: {
			requiredMessage: "this is the required message for the whole form",
			// display: "inline",
			// display: "fitting",
		}};

		_.each($scope.fields, function(field) {
			field.expressionProperties = field.expressionProperties || {};
			_.each($scope.options.formState, function(val, key) {
				if (!_.contains(_.keys(field.templateOptions), key)) {
					field.expressionProperties['templateOptions.'+ key] = 'formState.' + key;
				}
			});
		});
	}]);
})();