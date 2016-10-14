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

	angular.module('demoApp')
	.config(['$translateProvider', function($translateProvider) {
		var culture = 'en';
		$translateProvider.use(culture);
		$translateProvider.preferredLanguage(culture);
		$translateProvider.fallbackLanguage(['en', 'fr']);
		moment.locale(culture);
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
	.run(function(luisProgressBar, $rootScope) {
		luisProgressBar.addProgressBar("demo", "grey");
		$rootScope.$on("$routeChangeStart", function() {
			luisProgressBar.startListening();
		});
	});

	angular.module('demoApp')
	.run(function($httpBackend) {
		$httpBackend.whenGET(/animations\//).passThrough();
		$httpBackend.whenGET(/directives\//).passThrough();


		$httpBackend.whenGET('/bogus-progress').respond(200, {});
		$httpBackend.whenGET("http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=l").passThrough();
	});
})();
