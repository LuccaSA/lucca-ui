(function(){
	'use strict';

	// we use underscore cuz it's awesome
	// http://underscorejs.org/
	angular.module('underscore', []).factory('_', function () { return window._; });
	angular.module('moment', []).factory('moment', function () { return window.moment; });

	angular.module('demoApp',['lui', 'ui.bootstrap', 'ngRoute', 'ngSanitize', 'ui.select', 'ngMockE2E']);

	angular.module('demoApp')
	.controller('bannerCtrl', ['$scope', '$location', function($scope, $location) {
		// Code from http://stackoverflow.com/questions/12295983/set-active-tab-style-with-angularjs
		$scope.isActive = function(viewLocation) {
			return viewLocation === $location.path();
		};
	}]);

	angular.module('demoApp')
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/less', {
				templateUrl: 'less-framework.html',
			})
			.when('/icons', {
				templateUrl: 'icons.html'
			})
			.when('/animations', {
				templateUrl: 'animations.html',
			})
			.when('/nguibs', {
				templateUrl: 'nguibs.html',
			})
			.when('/filters', {
				templateUrl: 'filters.html',
			})
			.when('/directives', {
				templateUrl: 'directives.html',
			})
			.when('/lucca', {
				templateUrl: 'lucca-spe.html',
			})
			.otherwise({ redirectTo: '/less'});
	}]);

	angular.module('demoApp')
	.run(function($httpBackend) {
		$httpBackend.whenGET('less-framework.html').passThrough();
		$httpBackend.whenGET('icons.html').passThrough();
		$httpBackend.whenGET('animations.html').passThrough();
		$httpBackend.whenGET('nguibs.html').passThrough();
		$httpBackend.whenGET('filters.html').passThrough();
		$httpBackend.whenGET('directives.html').passThrough();
		$httpBackend.whenGET('lucca-spe.html').passThrough();
	});
})();