module Lui.Directives {
	"use strict";
	class LuidUserPickerMultiple implements angular.IDirective {
		public static IID: string = "luidUserPickerMultiple";
		public restrict = "E";
		public templateUrl = "lui/templates/user-picker/user-picker.multiple.html";
		public require = ["ngModel", LuidUserPickerMultiple.IID];
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
		public static factory(): angular.IDirectiveFactory { return () => { return new LuidUserPickerMultiple(); }; }
		public link(
			scope: ILuidUserPickerScope,
			element: angular.IAugmentedJQuery,
			attrs: angular.IAttributes,
			ctrls: [ng.INgModelController, LuidUserPickerController]): void {

			let ngModelCtrl = ctrls[0];
			let userPickerCtrl = ctrls[1];
			userPickerCtrl.setNgModelCtrl(ngModelCtrl, true);
		}
	}
	angular.module("lui.directives").directive(LuidUserPickerMultiple.IID, LuidUserPickerMultiple.factory());
}
