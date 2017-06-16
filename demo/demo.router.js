(function(){
	"use strict";
	var tabs = [
	"sass",
	"grid",
	"icons",
	"animations",
	"nguibs",
	"filters",
	"directives",
	"lucca",
	"form",
	];


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
		_.each(tabs, function(tab) {
			$stateProvider
			.state(tab, {
				parent: "root",
				url: "/" + tab,
				views: {
					"header@": {
						templateUrl: tab + "/header.html",
						controller: function($scope, dependencies) {
							$scope.dependencies = dependencies;
						}
					},
					"nav@": {
						templateUrl: tab + "/nav.html"
					},
					"content@": {
						templateUrl: tab + "/content.html"
					},
				}
			});
		});
	}]);
})();
