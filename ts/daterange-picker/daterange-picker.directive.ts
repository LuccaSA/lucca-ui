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
		public require = "ngModel";
		public restrict = "AE";
		public scope = { header: "=", height: "@", datas: "=" };
		public templateUrl = "lui/templates/daterange-picker/daterange-picker.html";
		private filter: Lui.ILuiFilters;

		public static Factory(): angular.IDirectiveFactory {
			let directive = ($filter) => { return new LuidDaterangePicker($filter); };
			directive.$inject = ["$filter"];
			return directive;
		}

		constructor($filter: Lui.ILuiFilters) {
			// Constructor code here
			this.filter = $filter;
		};

		public link: ng.IDirectiveLinkFn = (scope: IDaterangePickerScope, element: ng.IAugmentedJQuery, attrs: ILuidDaterangePickerAttributes, ngModelCtrl: ng.INgModelController): void => {

			scope.range = new Lui.Period(ngModelCtrl.$viewValue.startsOn, ngModelCtrl.$viewValue.endsOn);
			scope.friendly = this.filter("luifFriendlyRange")(scope.range, true);

			// ngModelCtrl thingies

			ngModelCtrl.$formatters.push((modelValue) => {
				// not doing anything here, just for structure
				return modelValue;
			});

			ngModelCtrl.$render = () => {
				scope.range.startsOn = ngModelCtrl.$viewValue.startsOn;
				scope.range.endsOn = ngModelCtrl.$viewValue.endsOn;
				scope.friendly = this.filter("luifFriendlyRange")(scope.range, true);
			};

			ngModelCtrl.$parsers.push((viewValue) => {
				// not doing anything here, just for structure
				return viewValue;
			});

			scope.$watch("range", () => {
				ngModelCtrl.$setViewValue({ startsOn: scope.range.startsOn, endsOn: scope.range.endsOn });
			});

		};
	}

	angular.module("lui.directives")
		.directive(LuidDaterangePicker.IID, LuidDaterangePicker.Factory());

}
