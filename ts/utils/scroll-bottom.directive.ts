module lui.scroll {
	"use strict";
	/**
	 * Directive used to call a custom function when the user scroll to the bottom of an element.
	 * Usage: <element luid-on-scroll-bottom="yourCallback()"></element>
	 */
	angular.module("lui").directive("luidOnScrollBottom", () => {
		return {
			restrict: "A",
			scope: { luidOnScrollBottom: "&" },
			link: ($scope: any, element: angular.IAugmentedJQuery): void => {
				element.bind("scroll", (eventArg: JQueryEventObject) => {
					let target: Element = eventArg.target || (event.srcElement as Element);
					let scrollbarHeight = target.scrollHeight - target.clientHeight;
					if (Math.abs(scrollbarHeight - target.scrollTop) < 2 && !!$scope.luidOnScrollBottom) {
						$scope.luidOnScrollBottom();
					}
				});
			}
		};
	});
}
