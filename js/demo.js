(function(){
	'use strict';

	angular.module('underscore', []).factory('_', function () { return window._; });
	angular.module('moment', []).factory('moment', function () { return window.moment; });

	angular.module('demoApp',['lui', 'ui.bootstrap', 'ngRoute', 'ngSanitize', 'ui.select', 'ngMockE2E', 'hljs']);

	angular.module('demoApp')
	.controller('bannerCtrl', ['$scope', '$location', function($scope, $location) {
		$scope.isActive = function(viewLocation) {
			return viewLocation === $location.path();
		};
	}]);

	angular.module('demoApp')
	.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
		$routeProvider
			.when('/sass', {
				templateUrl: 'sass-framework.html',
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
			.otherwise({ redirectTo: '/sass'});

		var culture = 'en';
		$translateProvider.use(culture);
		$translateProvider.preferredLanguage(culture);
		$translateProvider.fallbackLanguage(['en', 'fr']);
		// moment.locale(culture);
	}])
	.config(function($httpProvider) {
		$httpProvider.interceptors.push("luiHttpInterceptor");
	})
	.config(function(luisConfigProvider, $uibModalProvider) {
		luisConfigProvider.setConfig({
			parentTagIdClass: "demo",
			startTop: 60,
			prefix: "lui",
			canDismissConfirm: true,
		});
	});

	angular.module('demoApp')
	.run(function($httpBackend, luisNotify, luisProgressBar, $rootScope, moment, luisConfig) {
		moment.locale("fr");
		luisProgressBar.addProgressBar("demo", "grey");
		$rootScope.$on("$routeChangeStart", function() {
			luisProgressBar.startListening();
		});
		$httpBackend.whenGET('sass-framework.html').passThrough();
		$httpBackend.whenGET('icons.html').passThrough();
		$httpBackend.whenGET('animations.html').passThrough();
		$httpBackend.whenGET('nguibs.html').passThrough();
		$httpBackend.whenGET('filters.html').passThrough();
		$httpBackend.whenGET('directives.html').passThrough();
		$httpBackend.whenGET('lucca-spe.html').passThrough();
		$httpBackend.whenGET('/bogus-progress').respond(200, {});
		$httpBackend.whenGET("http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=l").passThrough();

	});
})();
