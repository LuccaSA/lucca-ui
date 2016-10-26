(function(){
	'use strict';

	angular.module('demoApp')
	.controller('percentageCtrl', ['$scope', function($scope){
		$scope.myValue = 0.1;
		$scope.myCoeff = 1.1;
		$scope.myPrice = 150;
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
	}]);
})();
