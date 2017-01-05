(function(){
	'use strict';

	angular.module('demoApp')
	.controller("enterCtrl", ["$scope", "$timeout", function($scope, $timeout){
		$scope.array = [];
		$scope.add = function(){
			$scope.array.push($scope.animation +  " from " + $scope.direction);
			$scope.showButton = false;
			$timeout(function() {
				$scope.showButton = true;
			}, 1);
		};
		$scope.direction = "up";
		$scope.animation = "fade in";

		$scope.showButton = false;
	}]);
})();
