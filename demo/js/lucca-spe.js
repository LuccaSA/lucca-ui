(function(){
	angular.module('demoApp')
	.controller("userPickerCtrl", ["$scope", "$httpBackend", '_', '$http', '$q', 'moment', function($scope, $httpBackend, _, $http, $q, moment) {

		$scope.isChecked = false;
		$scope.getCnt = 0;
		$scope.apiCalls = [];
		$scope.myUser = {};
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
		$httpBackend.whenPOST(/\/\/\w*.local\/.*/).passThrough();

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
	}]);
})();
