(function () {
	'use strict';
	angular.module("demoApp")
		.controller("newUserPickerCtrl", ["$scope", "$httpBackend", "$http", "$q", function ($scope, $httpBackend, $http, $q) {
			$scope.firstModel = undefined;
			$scope.disableUserPicker = false;
			$scope.onSelectFirstModel = () => { alert("onSelect()"); }
			$scope.onRemoveFirstModel = () => { alert("onRemove()"); }
			$scope.clearFirstModel = () => {
				console.log("firstModel = " + $scope.firstModel);
				$scope.firstModel = undefined;
			}

			$scope.setAppIdAndOperations = (appIdTmp, operationsIdTmp) => {
				$scope.appId = appIdTmp;
				$scope.operations = operationsIdTmp.split(",");
			}
			$scope.resetAppIdAndOperations = () => { $scope.appId = $scope.operations = undefined; }

			$scope.customFilter = (user) => { return user.firstName != "Administrateur"; }

			$scope.getCustomInfo = (user) => {
				if (user.firstName === "Kevin") {
					return "Crepes' king";
				}
				return "";
			}

			$scope.homonymsProperties = [
				{ translationKey: "Site", name: "site.name", icon: "location" },
			];
			$scope.getCustomInfoAsync = (user) => {
				let dfd = $q.defer();
				if (user.firstName === "Paul") {
					dfd.resolve("Show your moves");
				} else {
					dfd.resolve("");
				}
				return dfd.promise;
			}

			$httpBackend.whenGET(/\/\/\w*.local\/.*/).passThrough();
			$httpBackend.whenGET(/\/\/\w*.local.dev\/.*/).passThrough();
			$httpBackend.whenPOST(/\/\/\w*.local\/.*/).passThrough();
			$httpBackend.whenPOST(/\/\/\w*.local.dev\/.*/).passThrough();

			$scope.authUserLogin = "";

			$scope.local = "lucca.local.dev";
			$scope.auth = function () {
				alert("")
				$http.post("https://" + $scope.local + "/auth/userlogin?login=" + $scope.authUserLogin + "&password=")
					.success(function (response) {
						$scope.authToken = response;
						alert("Auth: success! Token = " + response);
					})
					.error(function (response) {
						alert("Auth failed... Is '" + + "Wrong login ?");
					});
			};
			// $scope.auth();

			$httpBackend.whenGET(/api\/v3\/users.*/i).respond(function (method, url) { return rerouteToLocal(method, url); });
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
