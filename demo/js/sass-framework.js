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
	}])
	.controller('inputCtrl', ['$scope', function($scope){
		$scope.radioModel1 = "choice1";
		$scope.radioModel2 = "choice1";
		$scope.radioModel3 = "choice1";
		$scope.radioModel4 = "choice1";
		$scope.radioValue2 = "choice2";
	}]);

})();
