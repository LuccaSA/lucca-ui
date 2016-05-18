(function(){
	angular.module('demoApp')
	.controller("userPickerCtrl", ["$scope", "$httpBackend", '_', '$http', '$q', 'moment', function($scope, $httpBackend, _, $http, $q, moment) {

		$scope.showMultipleUserPicker = false
		$scope.isChecked = false;
		$scope.getCnt = 0;
		$scope.apiCalls = [];
		$scope.myUser = {};
		$scope.myUsers = [];
		$scope.local = "lucca.local";
		$scope.authToken;
		$scope.customFilter = 'hasShortName'; // contains the custom filter selected

		$scope.yearOfArrivalAsync = function(user) {
			var dfd = $q.defer();
			$http.get("/api/v3/users/" + user.id + "?fields=dtContractStart")
			.success(function(response){
				var year = moment(response.data.dtContractStart).year();
				dfd.resolve(year);
			})
			.error(function(response){
				dfd.reject(response.Message)
			})
			return dfd.promise;
		}
		$scope.firstNameLength = function(user) {
			return user.firstName.length;
		}

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

		$httpBackend.whenGET(/api\/v3\/users.*/i).respond(function(method, url){
			return rerouteToLocal(url);
		});
		
		$httpBackend.whenGET(/\/\/\w*.local\/.*/).passThrough();
		$httpBackend.whenGET(/\/\/\w*.local.dev\/.*/).passThrough();
		$httpBackend.whenPOST(/\/\/\w*.local\/.*/).passThrough();
		$httpBackend.whenPOST(/\/\/\w*.local.dev\/.*/).passThrough();

		/* Custom filters */
		$scope.hasShortName = function(user) {
			return user.firstName.length <= 6;
		};

		$scope.beginsWithConsonant = function(user) {
			var vowels = "aeiouy";
			var beginsWithConsonant = true;

			_.each(vowels, function(vowel) {
				if (user.firstName[0].toLowerCase() === vowel) {
					beginsWithConsonant = false;
				}
			});
			return beginsWithConsonant;
		};

		$scope.nameContainsT = function(user) {
			return _.contains(user.firstName.toLowerCase() + user.lastName.toLowerCase(), 't') ;
		}
	}]);

	angular.module("demoApp")
	.controller("translationsCtrl", ["$scope", function($scope){
		$scope.myTrads = {en: "some stuff", fr: "des bidules"};
		$scope.count = 0
		$scope.changed = function(){
			$scope.count++;
		}
	}]);
	angular.module("demoApp")
	.controller("notifyCtrl", ["$scope", "luisNotify", function($scope, luisNotify){
		$scope.message = "this is a notification";
		$scope.details = "open console with f12 to witness the logging";
		$scope.notifyError = function(message, details) {
			luisNotify.error(message, details);
		};
		$scope.notifyWarning = function(message, details) {
			luisNotify.warning(message, details);
		};
		$scope.notifySuccess = function(message, details) {
			luisNotify.success(message, details);
		};
		$scope.message2 = "are you really sure?";
		$scope.notifyAlert = function(message) {
			luisNotify.alert(message)
			.then(function (hasConfirmed) {
				if (hasConfirmed) {
					$scope.confirmationMessage = "the user clicked ok";
				} else {
					$scope.confirmationMessage = "the user clicked cancel";
				}
			}, function() {
				$scope.confirmationMessage = "the user clicked outside";
			});
		};
		$scope.notifyConfirm = function(message) {
			luisNotify.confirm(message)
			.then(function (hasConfirmed) {
				if (hasConfirmed) {
					$scope.confirmationMessage = "the user clicked ok";
				} else {
					$scope.confirmationMessage = "the user clicked cancel";
				}
			}, function() {
				$scope.confirmationMessage = "the user clicked outside";
			});
		};
	}]);

		angular.module('demoApp')
		.controller('tableGridCtrl', ['$scope', function ($scope) {
			$scope.people = [];
			_.each(_.range(5000), function (index) {
				$scope.people[0 + 5 * index] = {
					id: 0 + 5 * index,
					name: "john cena",
					adress: "1234 avenue john cena",
					phone: "0123456789",
					mail: "john.cena@john.cena.com"
				};
				$scope.people[1 + 5 * index] = {
					id: 1 + 5 * index,
					name: "hubert robert",
					adress: "cette adresse est vraiment très très très très très très longue !",
					phone: "0607080910",
					mail: "hrobert@yahoo.fr"
				};
				$scope.people[2 + 5 * index] = {
					id: 2 + 5 * index,
					name: "George Monck",
					adress: "10 downing street",
					phone: "0123456789",
					mail: "g.monck@britishgovernment.co.uk"
				};
				$scope.people[3 + 5 * index] = {
					id: 3 + 5 * index,
					name: "Marie Pogz",
					adress: "4 place pigalle",
					phone: "0607080910",
					mail: "m.pogz@yopmail.com"
				};
				$scope.people[4 + 5 * index] = {
					id: 4 + 5 * index,
					name: "Obi Wan Kenobi",
					adress: "Jedi Temple, Coruscant",
					phone: "0123456789",
					mail: "owkenobi@theforce.com"
				};
			});

			$scope.people2 = [];
			_.each(_.range(5), function (index) {
				$scope.people2[0 + 5 * index] = {
					id: 0 + 5 * index,
					name: "john cena",
					adress: "1234 avenue john cena",
					phone: "0123456789",
					mail: "john.cena@john.cena.com"
				};
				$scope.people2[1 + 5 * index] = {
					id: 1 + 5 * index,
					name: "hubert robert",
					adress: "cette adresse est vraiment très très très très très très longue !",
					phone: "0607080910",
					mail: "hrobert@yahoo.fr"
				};
				$scope.people2[2 + 5 * index] = {
					id: 2 + 5 * index,
					name: "George Monck",
					adress: "10 downing street",
					phone: "0123456789",
					mail: "g.monck@britishgovernment.co.uk"
				};
				$scope.people2[3 + 5 * index] = {
					id: 3 + 5 * index,
					name: "Marie Pogz",
					adress: "4 place pigalle",
					phone: "0607080910",
					mail: "m.pogz@yopmail.com"
				};
				$scope.people2[4 + 5 * index] = {
					id: 4 + 5 * index,
					name: "Obi Wan Kenobi",
					adress: "Jedi Temple, Coruscant",
					phone: "0123456789",
					mail: "owkenobi@theforce.com"
				};
			});

			$scope.headerTree = {
				node: null,
				children: [
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.TEXT,
							fixed: true,
							label: "id",
							width: 20,
							getValue: function (someone) { return someone.id; },
							getOrderByValue: function (someone) { return someone.id; },
							getStyle: function (someone) { return someone.id % 2 ===0 ? 'green' : ''; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "right",
						},
						children: [],
					},
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.SELECT,
							fixed: false,
							label: "name",
							width: 20,
							getFilterValue: function (someone) { return someone.name; },
							getValue: function (someone) { return "<span>" + someone.name + "</span>"; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "left",
						},
						children: [],
					},
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.TEXT,
							fixed: false,
							label: "adress",
							width: 20,
							getValue: function (someone) { return someone.adress; },
							getOrderByValue: function (someone) { return someone.adress; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "left",
						},
						children: [],
					},
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.TEXT,
							fixed: false,
							label: "contacts",
							width: 20,
							getValue: function (someone) { return; },
							getOrderByValue: function (someone) { return; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "right",
						},
						children: [
							{
								node: {
									filterType: Lui.Directives.FilterTypeEnum.MULTISELECT,
									fixed: false,
									label: "phone",
									width: 20,
									getValue: function (someone) { return someone.phone; },
									getOrderByValue: function (someone) { return someone.phone; },
									colspan: null,
									hidden: false,
									rowspan: null,
									textAlign: "right",
								},
								children: [],
							},
							{
								node: {
									filterType: Lui.Directives.FilterTypeEnum.TEXT,
									fixed: false,
									label: "mail",
									width: 20,
									getValue: function (someone) { return someone.mail; },
									getOrderByValue: function (someone) { return someone.mail; },
									colspan: null,
									hidden: false,
									rowspan: null,
									textAlign: "center",
								},
								children: [],
							},
						],
					},
				]
			};

			$scope.headerTree2 = {
				node: null,
				children: [
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.TEXT,
							fixed: false,
							label: "id",
							width: 20,
							getValue: function (someone) { return someone.id; },
							getOrderByValue: function (someone) { return someone.id; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "right",
						},
						children: [],
					},
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.SELECT,
							fixed: false,
							label: "name",
							width: 20,
							getFilterValue: function (someone) { return someone.name; },
							getValue: function (someone) { return "<span>" + someone.name + "</span>"; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "left",
						},
						children: [],
					},
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.TEXT,
							fixed: false,
							label: "adress",
							width: 20,
							getValue: function (someone) { return someone.adress; },
							getOrderByValue: function (someone) { return someone.adress; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "left",
						},
						children: [],
					},
					{
						node: {
							filterType: Lui.Directives.FilterTypeEnum.TEXT,
							fixed: false,
							label: "mail",
							width: 20,
							getValue: function (someone) { return someone.mail; },
							getOrderByValue: function (someone) { return someone.mail; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "center",
						},
						children: [],
					},
				]
			};

			$scope.alertRow = function(row) {
				alert(JSON.stringify(row));
			}

			$scope.numberOfRow = function(data) {
				return _.filter(data, function(d) {
					return d._luiTableGridRow.isInFilteredDataset;
				}).length;
			}

		}]);

})();
