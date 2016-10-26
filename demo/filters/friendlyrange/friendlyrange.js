(function(){
	'use strict';
	angular.module('demoApp')
	.controller('friendlyrangeCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myBlock = { start: moment().startOf('month'), end: moment().add(1,'month').startOf('month') };
		$scope.form = { start: moment().startOf('month') };
		$scope.until = { end: moment().startOf('month') };
	}]);
})();
