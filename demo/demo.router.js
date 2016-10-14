(function(){
	"use strict";

	angular.module("demoApp.router")
	.config(["$urlRouterProvider", function($urlRouterProvider) {
		$urlRouterProvider.otherwise("/sass");
	}]);

	angular.module("demoApp.router")
	.config(["$stateProvider", function($stateProvider) {
		$stateProvider
		.state("root", {
			url: "",
			abstract: true,
		});

		$stateProvider
		.state("directives", {
			parent: "root",
			url: "/directives",
			views: {
				"header@": {
					templateUrl: "directives/header.html"
				},
				"nav@": {
					templateUrl: "directives/nav.html"
				},
				"content@": {
					templateUrl: "directives/content.html"
				},
			}
		})
	}]);
})();
