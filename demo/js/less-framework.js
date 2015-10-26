(function(){
	'use strict';

	var colors = ['none', 'primary', 'secondary', 'success', 'warning', 'error', 'grey', 'light', 'yellow', 'green', 'orange', 'red'];

	angular.module('demoApp')
	.controller('buttonsCtrl', ['$scope', function($scope){
		$scope.colors = colors;
		$scope.styles = ['default', 'flat', 'wired', 'filling'];
		$scope.sizes = ['small', 'default', 'large', 'x-large'];

		$scope.color = '';
		$scope.style = '';
		$scope.size = '';
		$scope.status = '';
		$scope.inverted = false;
		$scope.disabled = false;

	}]);
})();
