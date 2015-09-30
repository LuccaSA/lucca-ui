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

})();