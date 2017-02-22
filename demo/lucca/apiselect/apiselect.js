(function () {
	"use strict";
	angular.module("demoApp")
		.controller("apiselectCtrl", ["$scope", function ($scope) {
			$scope.internal = {};
			$scope.api = "/api/v3/axissections";
			$scope.filter = "active=true&axisId=5";
		}]);
})();
