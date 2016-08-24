(function(){
	'use strict';

	angular.module('demoApp')
	.controller('formlyCtrl', ['$scope', '$timeout', function($scope, $timeout){
		$scope.model = {
			address: "24 rue du champ de l'allouette, Paris 13e",
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
					placeholder: "this one has a placeholder"
				},
			},
			{
				key: "birthdate",
				type: "date",
				templateOptions: {
					label: "Birth date",
					required: true,
				},
			},
			{
				key: "address",
				type: "text",
				templateOptions: {
					label: "Address",
					helper: "this one has an helper message and is disabled",
					disabled: true
				},
			},
			{
				key: "email",
				type: "email",
				templateOptions: {
					label: "Email",
					required: true,
				},
			},

		];
		$scope.options = { formState: {
			requiredMessage: "this is the required message for the whole form",
			emailMessage: "this is not a valid email",
			display: "fitting",
		}};
		$scope.debug = function (form) {
			debugger;
			var fields = extractFields(form);
		}
		var extractFields = function(form) {
			return _.chain(form)
			.keys()
			.map(function(key) {
				if(key.startsWith("$")){
					return undefined;
				} else {
					return form[key];
				}
			})
			.reject(function(field) {
				return !field;
			})
			.value();
		}
		var generatedFields = [];
		$timeout( function () {
			generatedFields = _.map($scope.fields, function(field, index) {
				return $scope.myForm[$scope.myForm.$name + "_" + field.type +"_"+field.key +"_"+index];
			})
		}, 1);

		$scope.invalidFields = function() {
			return _.where(generatedFields, { $invalid: true });
		}
		$scope.nextInvalid = function() {
			var field = _.findWhere(generatedFields, { $invalid: true });
			field.$setTouched();
			// focus an input if possible
			var elt = document.querySelectorAll("input[name='" + field.$name + "'], [name='" + field.$name + "'] ~ input")[0];
			if (!!elt) {
				elt.focus();
			}
		}

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