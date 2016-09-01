(function(){
	'use strict';

	angular.module('demoApp')
	.controller('formlyCtrl', ['$scope', '$timeout', '$http', '$httpBackend', function($scope, $timeout, $http, $httpBackend){
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
					label: "Last name",
					required: true,
					requiredMessage: "this is a custom required message just for this field",
					placeholder: "this one has a placeholder"
				},
			},
			{
				key: "picture",
				type: "portrait",
				templateOptions: {
					helper: "@paugam: j'arrive pas a trouver comment empeccher d'appliquer la mixin %lui_input_label_displaced; fields.scss~365, aussi il manque l'asterix de required",
					label: "Picture (required)",
					required: true,
				},
			},
			{
				key: "driverLicense",
				type: "checkbox",
				templateOptions: {
					label: "Driver license",
					helper: "@paugam: le binding marche mais le `checked` est pas appliqué",
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
					label: "Address (disabled)",
					helper: "@paugam: le style pour disabled existe pas encore",
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
			{
				key: "father",
				type: "user",
				templateOptions: {
					label: "Father",
					required: true,
					helper: "@paugam: ici aussi le sizing est pas bon, aussi la border rouge d'invalid ne se met pas au bon endroit a cause de la margin verticale de 2em due a la class dropdown, cf ui-select",
				},
			},
			{
				key: "children",
				type: "user_multiple",
				templateOptions: {
					label: "Children",
					required: true,
					helper: "@paugam: ici aussi le sizing est pas bon, aussi la border rouge d'invalid ne se met pas au bon endroit a cause de la margin verticale de 2em due a la class dropdown, cf ui-select",
				},
			},
			{
				key: "department",
				type: "api_select",
				templateOptions: {
					label: "Department",
					required: true,
					api: "/api/v3/departments",
					helper: "@paugam: memes remarques que pour le select",
					placeholder: "search departments",
				},
			},
			{
				key: "subdepartments",
				type: "api_select_multiple",
				templateOptions: {
					label: "Sous Departments",
					required: true,
					api: "/api/v3/departments",
					placeholder: "search departments",
				},
			},

		];
		$scope.options = { formState: {
			requiredError: "this is the required message for the whole form",
			emailError: "this is not a valid email",
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
		$scope.local = "lucca.local.dev";
		$scope.auth = function(){
			$http.post("https://" + $scope.local + "/auth/userlogin?login=passepartout&password=")
			.success(function(response){
				$scope.authToken = response;
			})
			.error(function(response){
			});
		};
		$scope.auth();
				var rerouteToLocal = function(url){
			if(!$scope.authToken){ alert("You are not authenticated for your local website"); }
			var request = new XMLHttpRequest();

			// we're forced to use a synchronous method here because whenGET().respond(function(){}) does not handle promises
			// http://stackoverflow.com/questions/21057477/how-to-return-a-file-content-from-angulars-httpbackend
			request.open('GET', "https://" + $scope.local + url + "&authToken=" + $scope.authToken, false);
			request.send(null);

			return [request.status, request.response, {}];
		};

		$httpBackend.whenGET(/api\/v3\/.*/i).respond(function(method, url){
			return rerouteToLocal(url);
		});
		$httpBackend.whenPOST(/api\/files/i).respond(function(method, url, data){
			return rerouteToLocal("POST", url, data);
		});
		$httpBackend.whenGET(/\/\/\w*.local\/.*/).passThrough();
		$httpBackend.whenGET(/\/\/\w*.local.dev\/.*/).passThrough();
		$httpBackend.whenPOST(/\/\/\w*.local\/.*/).passThrough();
		$httpBackend.whenPOST(/\/\/\w*.local.dev\/.*/).passThrough();
	}]);
})();
