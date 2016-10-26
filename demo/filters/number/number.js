(function(){
	'use strict';
	angular.module('demoApp')
	.controller('numberCtrl', ['$scope', function($scope){
		$scope.myValue = 12.5;
	}]);
})();
