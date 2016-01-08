(function(){
	'use strict';

	angular.module('demoApp')
	.controller("enterCtrl", ["$scope", function($scope){
		$scope.array = [];
		$scope.add = function(){
			$scope.array.push($scope.animation +  " from " + $scope.direction);
		};
		$scope.direction = "up";
		$scope.animation = "fade in";
	}]);
	angular.module('demoApp')
	.controller("leaveCtrl", ["$scope", function($scope){
	}]);
	angular.module('demoApp')
	.controller("staticCtrl", ["$scope", "$timeout", function($scope, $timeout){
		$scope.applyBounce = function(){
			$scope.bouncing = "";
			$timeout(function(){$scope.bouncing = "bounce"; }, 5);
		};
		var upDownToggle = true;
		$scope.applyPulse = function(){
			$scope.pulsing = "";
			$timeout(function(){
				$scope.pulsing = "pulse " + (upDownToggle? "up" : "down"); 
				upDownToggle = !upDownToggle;
			}, 5);
		};

	}]);
})();