(function(){
	'use strict';

	// we use underscore cuz it's awesome
	// http://underscorejs.org/
	angular.module('underscore', []).factory('_', function () { return window._; });
	angular.module('moment', []).factory('moment', function () { return window.moment; });

	angular.module('demoApp',['lui', 'ui.bootstrap', 'ngRoute', 'ngSanitize', 'ui.select']);

	angular.module('demoApp')
	.controller('bannerCtrl', ['$scope', '$location', function($scope, $location) {
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

		// $urlRouterProvider.otherwise('/less');

		// $stateProvider
		// .state('less', {
		// 	url: '/less',
		// 	templateUrl: 'less-framework.html'
		// })
		// .state('icons', {
		// 	url: '/icons',
		// 	templateUrl: 'icons.html'
		// })
		// .state('animations', {
		// 	url: '/animations',
		// 	templateUrl: 'animations.html'
		// })
		// .state('nguibs', {
		// 	url: '/nguibs',
		// 	templateUrl: 'nguibs.html'
		// })
		// .state('filters', {
		// 	url: '/filters',
		// 	templateUrl: 'filters.html'
		// })
		// .state('directives', {
		// 	url: '/directives',
		// 	templateUrl: 'directives.html'
		// })
		// .state('luccaSpe', {
		// 	url: '/lucca',
		// 	templateUrl: 'lucca-spe.html'
		// })
	}]);
})();