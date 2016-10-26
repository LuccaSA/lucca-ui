(function(){
	'use strict';
	angular.module('demoApp')
	.controller('defaultcodeCtrl', ['$scope', function($scope){
		$scope.myValue = "With spaces and numb3rs";
	}]);
})();
