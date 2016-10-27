(function(){
	'use strict';

	angular.module('demoApp')
	.controller('dayblockCtrl', ['$scope', function($scope){
		$scope.myDate = new Date();
		$scope.palette = "";
		$scope.sizing = "";
	}]);
})();
