(function(){
	'use strict';
	angular.module('demoApp')
	.controller('placeholderCtrl', ['$scope', function($scope){
		$scope.myValue = "not empty";
		$scope.myPlaceholder = "dynamic placeholder";
	}]);
})();
