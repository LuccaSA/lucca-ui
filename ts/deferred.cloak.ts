// ==========================================
// ---- inspired by //http://blogs.infinitesquare.com/b/seb/archives/pourquoi-il-ne-faut-pas-utiliser-ngcloak#.Vwt0saSLSUk
// ==========================================

angular.module("lui.directives").directive("deferredCloak", [ "$timeout", ($timeout: ng.ITimeoutService) => {
	return {
		restrict: "A",
		link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void => {
			$timeout(() => {
				attrs.$set("deferredCloak", undefined);
				element.removeClass("deferred-cloak");
			}, 0);
		},
	};
}, ] );
