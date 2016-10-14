(function(){
	'use strict';

	angular.module('demoApp')
	.controller('ibanCtrl', ['$scope', function($scope){
		$scope.iban = "FR7630004000031234567890143";
	}]);

})();