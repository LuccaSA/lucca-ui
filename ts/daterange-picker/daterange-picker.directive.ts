/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface ILuidDaterangePickerAttributes extends ng.IAttributes {
		height: number;
	}

	export class LuidDaterangePicker implements angular.IDirective {

		public static defaultHeight = 20;
		public static IID = "luidDaterangePicker";
		public controller = "luidDaterangePickerController";
		public restrict = "AE";
		public scope = { header: "=", height: "@", datas: "=" };
		public templateUrl = "lui/templates/daterange-picker/daterange-picker.html";

		public static Factory(): angular.IDirectiveFactory {
			let directive = () => { return new LuidDaterangePicker(); };
			directive.$inject = [];
			return directive;
		}

		constructor() {
			// Constructor code here
		};

		public link: ng.IDirectiveLinkFn = (scope: IDaterangePickerScope, element: ng.IAugmentedJQuery, attrs: ILuidDaterangePickerAttributes): void => {

			// link method here

		};
	}

	angular.module("lui.directives")
		.directive(LuidDaterangePicker.IID, LuidDaterangePicker.Factory());

}
