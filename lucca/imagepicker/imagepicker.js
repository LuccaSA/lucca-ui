(function () {
	'use strict';
	angular.module("demoApp")
		.controller("imagepickerCtrl", ["$scope", "$httpBackend", "$http", function ($scope, $httpBackend, $http) {
			$scope.changeCnt = 0;
			$scope.changed = function () {
				$scope.changeCnt++;
			}
		}]);
})();
