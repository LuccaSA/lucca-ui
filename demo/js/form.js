(function(){
	'use strict';

	angular.module('demoApp')
	.controller('formlyCtrl', ['$scope', '$timeout', function($scope, $timeout){
		$scope.model = {
			address: "24 rue du champ de l'allouette, Paris 13e",
			email: "this is not a real email address",
		};
		$scope.fields = [
			{
				key: "language",
				type: "select",
				templateOptions: {
					label: "Language (mandatory)",
					choices: [{ key: "en", label: "english" }, { key: "fr", label: "français" }],
					required: true,
					placeholder: "placeholder",
					helper: "@paugam: l'etoile de mandatory n'apparait pas, aussi y'a un margin vertical de 2em du a la classe .dropdown, le placeholder n'a pas la bonne couleur, le sizing est pas bon (fitting)"
				},
			},
			{
				key: "language2",
				type: "radio",
				templateOptions: {
					label: "2nd language",
					choices: [{ key: "en", label: "english" }, { key: "fr", label: "français" }],
					required: true,
					helper: "@paugam: faudrait mettre du style sur le :focus"
				},
			},
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
				key: "driverLicense",
				type: "checkbox",
				templateOptions: {
					label: "Driver license",
					helper: "can you drive ?",
				},
			},
			{
				key: "birthdate",
				type: "date",
				templateOptions: {
					label: "Birth date",
					required: true,
					helper: "@paugam: le sizing est pas bon (fitting)",
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
			var field = _.findWhere(generatedFields, { $invalid: true, $touched: false });
			if (!field) {
				field = _.findWhere(generatedFields, { $invalid: true });
			}
			field.$setTouched();
			// focus an input if possible
			var elt = document.querySelectorAll("input[name='" + field.$name + "'], [name='" + field.$name + "'] input, [name='" + field.$name + "'] a")[0];
			if (!!elt) {
				elt.focus();
			}
			// for ui-selects
			if (field.$name.indexOf("_select_") !== -1) {
				// $timeout( function () {
				// 	elt = document.querySelectorAll("[name='" + field.$name + "'] .ui-select-focusser")[0];
				// 	elt.focus();
				// }, 1);
				// elt = document.querySelectorAll("[name='" + field.$name + "'] .ui-select-focusser")[0];
				// elt.focus();
				// should work but doesn't
				$scope.$broadcast(field.$name);
			}

			// set the scrolltop
			// var namedElt = document.getElementsByName(field.$name)[0];
			// document.documentElement.scrollTop = document.body.scrollTop = namedElt.scrollTop;
			// // document.scrolltop = namedElt.scrolltop;
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