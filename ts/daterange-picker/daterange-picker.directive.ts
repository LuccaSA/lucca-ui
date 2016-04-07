/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface ILuidDaterangePickerAttributes extends ng.IAttributes {
		height: number;
	}

	export class LuidDaterangePicker implements angular.IDirective {
		public static factory = (): angular.IDirectiveFactory => {
			let directive = ($filter: angular.IFilterService): angular.IDirective => { return new LuidDaterangePicker($filter); };
			directive.$inject = ["$filter"];
			return directive;
		};

		public static defaultHeight = 20;
		public static IID = "luidDaterangePicker";
		public controller = "luidDaterangePickerController";
		public require = "ngModel";
		public restrict = "AE";
		public scope = { predefinedHeaders: "=" };
		public templateUrl = "lui/templates/daterange-picker/daterange-picker.html";

		constructor($filter: Lui.ILuiFilters) {
			// Constructor code here
			this.filter = $filter;
		};

		public link: angular.IDirectiveLinkFn = (scope: IDaterangePickerScope, element: ng.IAugmentedJQuery, attrs: ILuidDaterangePickerAttributes, ngModelCtrl: ng.INgModelController): void => {
			scope.range = {
				startsOn: moment(ngModelCtrl.$viewValue.startsOn),
				endsOn: moment(ngModelCtrl.$viewValue.endsOn).add(-1, "days"),
			};
			scope.friendly = this.filter("luifFriendlyRange")(<Lui.Period>scope.range, false);

			// ngModelCtrl thingies

			ngModelCtrl.$formatters.push((modelValue: Lui.Directives.DaterangePicker.Model) => {
				// not doing anything here, just for structure
				return modelValue;
			});

			ngModelCtrl.$render = () => {
				scope.range.startsOn = moment(ngModelCtrl.$viewValue.startsOn);
				scope.range.endsOn = moment(ngModelCtrl.$viewValue.endsOn).add(-1, "days");
				scope.friendly = this.filter("luifFriendlyRange")(<Lui.Period>scope.range, false);
			};

			ngModelCtrl.$parsers.push((viewValue: Lui.Directives.DaterangePicker.Model) => {
				// not doing anything here, just for structure
				return viewValue;
			});

			let onScopeChange = (): void => {
				ngModelCtrl.$setViewValue({ startsOn: moment(scope.range.startsOn), endsOn: moment(scope.range.endsOn).add(1, "days") });
				scope.friendly = this.filter("luifFriendlyRange")(<Lui.Period>scope.range, false);
			};

			scope.$watch("range.startsOn", () => {
				onScopeChange();
			});
			scope.$watch("range.endsOn", () => {
				onScopeChange();
			});
		};

		private filter: Lui.ILuiFilters;
	}

	angular.module("lui.directives")
		.directive(LuidDaterangePicker.IID, LuidDaterangePicker.factory());

}
