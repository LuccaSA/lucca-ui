(function(){
	'use strict';

	angular.module('e2eApp', ['lui']);

	angular.module('e2eApp')
	.controller("luifPlaceholderCtrl",['$scope', function($scope){
		$scope.myValue = "stuff";
		$scope.myPlaceholder = "placeholder";
	}]);

	angular.module('e2eApp')
	.controller("luifDefaultCodeCtrl",['$scope', function($scope){
		$scope.myValue = "stuff";
	}]);

	angular.module('e2eApp')
	.controller("luifNumberCtrl",['$scope', function($scope){
		$scope.myValue = 3.141592;
		$scope.myPrecision = 2;
	}]);
})();