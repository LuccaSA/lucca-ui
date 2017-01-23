module lui.cloak {
	"use strict";
	// ==========================================
	// ---- inspired by //http://blogs.infinitesquare.com/b/seb/archives/pourquoi-il-ne-faut-pas-utiliser-ngcloak#.Vwt0saSLSUk
	// ==========================================
	angular.module("lui").directive("luiCloak", [ "$timeout", ($timeout: ng.ITimeoutService) => {
		return {
			restrict: "A",
			link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
				$timeout(() => {
					attrs.$set("luiCloak", undefined);
					element.removeClass("lui-cloak");
				}, 0);
			},
		};
	}, ] );
}
