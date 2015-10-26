(function(){
	'use strict';

	angular.module('demoApp')
	.controller('timespanCtrl', ['$scope', function($scope){
		$scope.myValue = "1.11:00:00";
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
	}]);

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

	angular.module('demoApp')
	.controller('momentCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment();
		$scope.myStr = "14:00:00";
		$scope.myValue2 = moment().startOf('day').add(14, 'hours');
		$scope.myValue3 = moment().startOf('day').add(14, 'hours');
		$scope.min = moment().startOf('day').add(8, 'hours');
		$scope.max = moment().startOf('day').add(26, 'hours');
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
	}]);

})();