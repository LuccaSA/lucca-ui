(function(){
	'use strict';
	angular.module("demoApp")
	.controller("translationsCtrl", ["$scope", function($scope){
		$scope.myTrads = {en: "some stuff", fr: "des bidules"};
		$scope.myTradsPipe = "";
		$scope.count = 0

		$scope.requiredModel = [
			{ id: 1, cultureCode: 1033, value: "stuff" },
			{ id: 2, cultureCode: 1036, value: "truc" },
			{ id: 3, cultureCode: 1034, value: "cosa" },
		];

		$scope.changed = function(){
			$scope.count++;
		}
	}]);
})();
