(function () {
	'use strict';
	angular.module("demoApp")
		.controller("redirectRequestsCtrl", ["$scope", "$httpBackend", "$http", "$q", "$rootScope",
			function ($scope, $httpBackend, $http, $q, $rootScope) {
				$scope.local = "lucca.local.dev";
				$scope.authUserLogin = "passepartout";
				$scope.auth = function (disp) {
					disp = !!disp ? disp : false;
					$http.post("https://" + $scope.local + "/auth/userlogin?login=" + $scope.authUserLogin + "&password=")
						.success(function (response) {
							$rootScope.globalConnected = true;
							$scope.authToken = response;
							if (disp) alert("Auth: success! Token = " + response);
						})
						.error(function (response) {
							$rootScope.globalConnected = false;
							$scope.authToken = undefined;
							if (disp) alert("Auth failed... Is '" + $scope.authUserLogin + "' a wrong login ?");
						});
				};
				$scope.auth(false);

				$httpBackend.whenGET(/\/\/\w*.local\/.*/).passThrough();
				$httpBackend.whenGET(/\/\/\w*.local.dev\/.*/).passThrough();
				$httpBackend.whenGET(/api\/v3\/users.*/i).respond(function (method, url) { return rerouteToLocal(method, url); });
				$httpBackend.whenGET(/api\/v3\/.*/i).respond(function (method, url) { return rerouteToLocal(method, url); });

				$httpBackend.whenPOST(/\/\/\w*.local\/.*/).passThrough();
				$httpBackend.whenPOST(/\/\/\w*.local.dev\/.*/).passThrough();
				$httpBackend.whenPOST(/api\/files/i).respond(function (method, url, data) { return rerouteToLocal("POST", url, data); });

				var rerouteToLocal = function (method, url, data) {
					if (!$scope.authToken) { alert("You are not authenticated on your local website. Log in and come back."); }
					var request = new XMLHttpRequest();

					// we're forced to use a synchronous method here because whenGET().respond(function(){}) does not handle promises
					// http://stackoverflow.com/questions/21057477/how-to-return-a-file-content-from-angulars-httpbackend
					request.open(method, "https://" + $scope.local + url + "&authToken=" + $scope.authToken, false);
					request.send(data);
					return [request.status, request.response, {}];
				};
			}]);
})();
