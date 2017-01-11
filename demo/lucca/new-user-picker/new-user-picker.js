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

			// $scope.appId = 107;
			// $scope.operations = [1, 2];

			$scope.setAppIdAndOperations = (appIdTmp, operationsIdTmp) => {
				$scope.appId = appIdTmp;
				$scope.operations = operationsIdTmp.split(",");
			}

			// $scope.bypassOperationsFor = [471, 403];

			$scope.resetAppIdAndOperations = () => { $scope.appId = $scope.operations = undefined; }

			$scope.customFilter = (user) => { return user.firstName !== "Administrateur"; }
			$scope.getCustomInfo = (user) => { return user.id % 2 === 0 ? "custom info" : ""; }
			$scope.getCustomInfoAsync = (user) => {
				let dfd = $q.defer();
				dfd.resolve(user.id % 3 === 0 && user.id % 2 !== 0 ? "custom async" : "");
				return dfd.promise;
			}
			$scope.homonymsProperties = [
				{ translationKey: "Site", name: "site.name", icon: "location" },
			];
		}]);
})();
