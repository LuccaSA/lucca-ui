(function(){
	'use strict';

	angular.module('animationApp',['ui.bootstrap']);

	angular.module('animationApp')
	.controller("enterCtrl", ["$scope", function($scope){
		$scope.array = [];
		$scope.add = function(){
			$scope.array.push($scope.animation +  " from " + $scope.direction);
		};
		$scope.direction = "up";
		$scope.animation = "fade in";
	}]);
	angular.module('animationApp')
	.controller("leaveCtrl", ["$scope", function($scope){
		// $scope.fadeOut = ["zero", "one", "two", "three", "four"];
		// $scope.remove = function(){
		// 	$scope.fadeOut.pop();
		// };
		// $scope.direction = "up";
	}]);
	angular.module('animationApp')
	.controller("staticCtrl", ["$scope", "$timeout", function($scope, $timeout){
		$scope.applyBounce = function(){
			$scope.bouncing = "";
			$timeout(function(){$scope.bouncing = "bounce"; }, 5);
		};
		$scope.applyPulse = function(){
			$scope.pulsing = "";
			$timeout(function(){$scope.pulsing = "pulse"; }, 5);
		};

	}]);
})();