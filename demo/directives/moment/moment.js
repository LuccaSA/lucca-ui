(function(){
	'use strict';

	angular.module('demoApp')
	.controller('momentCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment();
		$scope.myStr = "14:00:00";
		$scope.myValue2 = moment().startOf('day').add(14, 'hours');
		$scope.myValue3 = moment().startOf('day').add(14, 'hours');
		$scope.min = moment().startOf('day').add(8, 'hours');
		$scope.max = moment().startOf('day').add(24, 'hours');
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
	}]);
})();
