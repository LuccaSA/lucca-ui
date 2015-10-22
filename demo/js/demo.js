(function(){
	'use strict';
	var colors = ['none', 'primary', 'secondary', 'success', 'warning', 'error', 'grey', 'light', 'yellow', 'green', 'orange', 'red'];
	
	// we use underscore cuz it's awesome
	// http://underscorejs.org/
	angular.module('underscore', []).factory('_', function () { return window._; });

	angular.module('demoApp',['ui.bootstrap', 'ngRoute']);

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

	angular.module('demoApp')
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/less', {
				templateUrl: 'less.html',
			})
			.otherwise({ redirectTo: '/less'});
	}]);
})();