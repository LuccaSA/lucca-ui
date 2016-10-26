(function(){
	'use strict';
	angular.module("demoApp")
	.controller("imagepickerCtrl", ["$scope", "$httpBackend", "$http", function($scope, $httpBackend, $http){
			$scope.changeCnt = 0;
		$scope.changed = function() {
			$scope.changeCnt++;
		}

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

		$httpBackend.whenGET(/\/\/\w*.local\/.*/).passThrough();
		$httpBackend.whenGET(/\/\/\w*.local.dev\/.*/).passThrough();
		$httpBackend.whenPOST(/\/\/\w*.local\/.*/).passThrough();
		$httpBackend.whenPOST(/\/\/\w*.local.dev\/.*/).passThrough();
		$httpBackend.whenGET(/api\/v3\/users.*/i).respond(function(method, url){
			return rerouteToLocal(url);
		});
		$httpBackend.whenPOST(/api\/files/i).respond(function(method, url, data){
			return rerouteToLocal("POST", url, data);
		});
		var rerouteToLocal = function(method, url, data){
		if(!$scope.authToken){ alert("You are not authenticated for your local website"); }
		var request = new XMLHttpRequest();

			// we're forced to use a synchronous method here because whenGET().respond(function(){}) does not handle promises
			// http://stackoverflow.com/questions/21057477/how-to-return-a-file-content-from-angulars-httpbackend
			request.open(method, "https://" + $scope.local + url + "?authToken=" + $scope.authToken, false);
			request.send(data);

			return [request.status, request.response, {}];
		};
	}]);
})();
