(function(){
	'use strict';

	angular.module('demoApp')
	.controller('keydownCtrl', ['$scope', function($scope){
		$scope.enterCnt = 0;
		$scope.escCnt = 0;
		$scope.zCnt = 0;
		$scope.arrows = [];

		var enterPressed = function(){
			$scope.enterCnt++;
			$scope.$apply();
		};
		var escPressed = function(){
			$scope.escCnt++;
			$scope.$apply();
		};
		var zPressed = function(){
			$scope.zCnt++;
			$scope.$apply();
		};

		var leftPressed = function(){ $scope.arrows.push("left"); $scope.$apply(); };
		var upPressed = function(){ $scope.arrows.push("up"); $scope.$apply(); };
		var rightPressed = function(){ $scope.arrows.push("right"); $scope.$apply(); };
		var downPressed = function(){ $scope.arrows.push("down"); $scope.$apply(); };

		$scope.myMappings = { 13: enterPressed, 27: escPressed, 90: zPressed, 37: leftPressed, 38: upPressed, 39: rightPressed, 40: downPressed };
	}]);
})();
