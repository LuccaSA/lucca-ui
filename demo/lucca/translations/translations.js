(function(){
	'use strict';
	angular.module("demoApp")
	.controller("translationsCtrl", ["$scope", function($scope){
		$scope.myTrads = {en: "some stuff", fr: "des bidules"};
		$scope.count = 0
		$scope.changed = function(){
			$scope.count++;
		}
	}]);
})();
