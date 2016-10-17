(function(){
	'use strict';
	angular.module('demoApp')
	.controller('calendarCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment().add(-1,'days');
		$scope.myRefDate = moment().add(-2,'days');
		$scope.setToThisWeek = function(){
			$scope.myValue = moment().startOf('week');
		};
		$scope.setToLastWeek = function(){
			$scope.myValue = moment().add(-1,'week');
		};
	}]);
})();
