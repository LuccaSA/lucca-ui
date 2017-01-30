module lui.userpicker {
	"use strict";
	class LuidUserPicker implements angular.IDirective {
		public static IID: string = "luidUserPicker";
		public restrict = "E";
		public templateUrl = "lui/templates/user-picker/user-picker.html";
		public require = ["ngModel", LuidUserPicker.IID];
		public scope = {
			placeholder: "@",
			onSelect: "&",
			onRemove: "&",
			controlDisabled: "=", // BG: pas '@', sinon cast en string

			showFormerEmployees: "=", // bool, default false

			homonymsProperties: "=", // ISimpleProperty[], properties to handle homonymsProperties, default [department, legalEntity, mail]

			customFilter: "=", // (User) => bool

			appId: "=", // Id of the application users should have access to
			operations: "=", // List of operations Ids users should have access to

			customInfo: "=", // (User) => string
			customInfoAsync: "=", // (User) => ng.IPromise<string>
			displayMeFirst: "=",
			displayAllUsers: "=", // boolean, default false

			customHttpService: "=", // $http
			bypassOperationsFor: "=", // List of users that should be displayed even if they don't have access to the operations
		};
		public controller: string = LuidUserPickerController.IID;
		public static factory(): angular.IDirectiveFactory { return () => { return new LuidUserPicker(); }; }
		public link(
			scope: ILuidUserPickerScope,
			element: angular.IAugmentedJQuery,
			attrs: angular.IAttributes,
			ctrls: [ng.INgModelController, LuidUserPickerController]): void {

			let ngModelCtrl = ctrls[0];
			let userPickerCtrl = ctrls[1];
			userPickerCtrl.setNgModelCtrl(ngModelCtrl);
		}
	}
	angular.module("lui").directive(LuidUserPicker.IID, LuidUserPicker.factory());

	/**
	 * Directive used to call a custom function when the user scroll to the bottom of an element.
	 * Usage: <element on-scroll-bottom="yourCallback()"></element>
	 */
	angular.module("lui").directive("onScrollBottom", () => {
		return {
			restrict: "A",
			scope: { onScrollBottom: "&" },
			link: ($scope: any, element: angular.IAugmentedJQuery): void => {
				element.bind("scroll", (eventArg: JQueryEventObject) => {
					let scrollbarHeight = eventArg.srcElement.scrollHeight - eventArg.srcElement.clientHeight;
					if (Math.abs(scrollbarHeight - eventArg.srcElement.scrollTop) < 2 && !!$scope.onScrollBottom()) {
						$scope.onScrollBottom();
					}
				});
			}
		};
	});
}
