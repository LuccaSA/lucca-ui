(function(){
	'use strict';

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
