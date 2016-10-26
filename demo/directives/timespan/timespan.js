(function(){
	'use strict';

	angular.module('demoApp')
	.controller('timespanCtrl', ['$scope', function($scope){
		$scope.myTimespan = "1.11:00:00";
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
		$scope.myDuration = moment.duration(2, 'hours');
		$scope.myTimespan2 = "02:05:00";
		$scope.min = '0:10';
		$scope.max = '11:00';
	}]);
})();
