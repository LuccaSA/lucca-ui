(function () {
	'use strict';
	angular.module("demoApp")
	.controller("departmentPickerCtrl", ["$scope", function ($scope) {
		$scope.internal = { selectedDepartment: undefined };
	}]);
})();
