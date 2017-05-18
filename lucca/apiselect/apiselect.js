(function () {
	"use strict";
	angular.module("demoApp")
		.controller("apiselectCtrl", ["$scope", function ($scope) {
			$scope.internal = {};
			$scope.api = "/api/v3/departments";
			$scope.filter = "isactive=true";
			$scope.order = "name,asc";
			$scope.debounce = { debounce: 300 };
		}]);
})();
