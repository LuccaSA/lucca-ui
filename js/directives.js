(function(){
	'use strict';

	angular.module('moment', []).factory('moment', function () { return window.moment; });
	angular.module('filterApp',['lui']);

	angular.module('filterApp')
	.controller('timespanCtrl', ['$scope', function($scope){
		$scope.myValue = "1.11:00:00";
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
	}]);

	angular.module('filterApp')
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