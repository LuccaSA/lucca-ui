module lui.userpicker {
	"use strict";

	class OpenOn implements angular.IDirective {
		public static IID: string = "openOn";
		public restrict = "A";
		public require = ["uiSelect"];
		private $timeout: ng.ITimeoutService;

		constructor($timeout: ng.ITimeoutService) {
			this.$timeout = $timeout;
		}

		public static factory(): angular.IDirectiveFactory {
			let directive = ($timeout: ng.ITimeoutService) => {
				return new OpenOn($timeout);
			};
			directive.$inject = ["$timeout"];
			return directive;
		}

		public link(scope: ng.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes & { openOn: string }, ctrls: [any]): void {
			let uiSelectCtrl = ctrls[0];

			if (!!attrs.openOn) {
				scope.$on(attrs.openOn, () => {
					this.$timeout(() => {
						uiSelectCtrl.activate();
					});
				});
			}
		};
	}

	angular.module("lui.translate").directive(OpenOn.IID, OpenOn.factory());
}
