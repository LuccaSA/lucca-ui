(function(){
	'use strict';
	angular.module('demoApp')
	.controller('durationCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment.duration("10:00:00");
	}]);
})();
