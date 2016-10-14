(function(){
	'use strict';

	angular.module("demoApp.router",["ui.router"]);
	angular.module("demoApp",[
		"demoApp.router",
		"lui",
		"ui.bootstrap",
		"ngSanitize",
		"ui.select",
		"ngMockE2E",
		"hljs",
		"lui.formlytemplates",
	]);

	// angular.module('demoApp')
	// .controller('bannerCtrl', ['$scope', '$location', function($scope, $location) {
	// 	$scope.isActive = function(viewLocation) {
	// 		return viewLocation === $location.path();
	// 	};
	// }]);

	angular.module('demoApp')
	.config(['$translateProvider', function($translateProvider) {
		var culture = 'en';
		$translateProvider.use(culture);
		$translateProvider.preferredLanguage(culture);
		$translateProvider.fallbackLanguage(['en', 'fr']);
		moment.locale(culture);
	}])
	// .config(['$routeProvider', function($routeProvider) {
	// 	$routeProvider
	// 		.when('/sass', {
	// 			templateUrl: 'sass-framework.html',
	// 		})
	// 		.when('/icons', {
	// 			templateUrl: 'icons.html'
	// 		})
	// 		.when('/animations', {
	// 			templateUrl: 'animations.html',
	// 		})
	// 		.when('/nguibs', {
	// 			templateUrl: 'nguibs.html',
	// 		})
	// 		.when('/filters', {
	// 			templateUrl: 'filters.html',
	// 		})
	// 		.when('/directives', {
	// 			templateUrl: 'directives/index.html',
	// 		})
	// 		.when('/lucca', {
	// 			templateUrl: 'lucca-spe.html',
	// 		})
	// 		.when('/form', {
	// 			templateUrl: 'form.html',
	// 		})
	// 		.otherwise({ redirectTo: '/sass'});
	// }])
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
		$httpBackend.whenGET('animations.html').passThrough();
		$httpBackend.whenGET(/directives\//).passThrough();
		$httpBackend.whenGET('filters.html').passThrough();
		$httpBackend.whenGET('form.html').passThrough();
		$httpBackend.whenGET('icons.html').passThrough();
		$httpBackend.whenGET('lucca-spe.html').passThrough();
		$httpBackend.whenGET('nguibs.html').passThrough();
		$httpBackend.whenGET('sass-framework.html').passThrough();
		$httpBackend.whenGET('/bogus-progress').respond(200, {});
		$httpBackend.whenGET("http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=l").passThrough();

	});
})();
