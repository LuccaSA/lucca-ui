(function(){
	'use strict';
	angular.module('demoApp')
	.controller('momentCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = "2015-10-01";
		$scope.myFormat = "MMMM Do";
		$scope.setToDate = function(){
			$scope.myValue = new Date();
		};
		$scope.setToMoment = function(){
			$scope.myValue = moment().startOf('week');
		}
	}]);
})();
