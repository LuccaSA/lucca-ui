module Lui.Directives {
	"use strict";
	class LuidDatePicker implements angular.IDirective {
		public static IID: string = "luidDatePicker";
		public restrict = "E";
		public templateUrl = "lui/templates/date-picker/datepicker-inline.html";
		public require = ["ngModel", "luidDatePicker"];
		public scope = {
			format: "@",
			displayedMonths: "@",
			min: "=",
			max: "=",
			customClass: "=",
		};
		public controller: string = LuidDatePickerController.IID;
		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidDatePicker();
			};
			return directive;
		}
		public link(scope: IDatePickerScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			let datePickerCtrl = <LuidDatePickerController>ctrls[1];
			datePickerCtrl.setNgModelCtrl(ngModelCtrl);
			datePickerCtrl.setFormat(scope.format);
			datePickerCtrl.setMonthsCnt(scope.displayedMonths);
		}
	}
	class LuidDatePickerPopup implements angular.IDirective {
		public static IID: string = "luidDatePickerPopup";
		public restrict = "E";
		public templateUrl = "lui/templates/date-picker/datepicker-popup.html";
		public require = ["ngModel", "luidDatePickerPopup"];
		public scope = {
			format: "@",
			displayFormat: "@",
			displayedMonths: "@",
			min: "=",
			max: "=",
			customClass: "=",
		};
		public controller: string = LuidDatePickerController.IID;
		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidDatePickerPopup();
			};
			return directive;
		}
		public link(scope: IDatePickerScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			let datePickerCtrl = <LuidDatePickerController>ctrls[1];
			datePickerCtrl.setNgModelCtrl(ngModelCtrl);
			datePickerCtrl.setFormat(scope.format, scope.displayFormat);
			datePickerCtrl.setMonthsCnt(scope.displayedMonths);
			datePickerCtrl.setPopoverTrigger(element, scope);
		}
	}

	interface IDatePickerScope extends ng.IScope, Lui.Utils.IClickoutsideTriggerScope, ICalendarScope {
		format: string;
		displayedMonths: string;

		displayStr: string;
		displayFormat: string;

		togglePopover: ($event: ng.IAngularEvent) => void;
	}

	class LuidDatePickerController extends ACalendarController {
		public static IID: string = "luidDatePickerController";
		public static $inject: Array<string> = ["$scope"];
		protected $scope: IDatePickerScope;
		private ngModelCtrl: ng.INgModelController;
		private displayFormat: string;
		private popoverController: Lui.Utils.IPopoverController;

		constructor($scope: IDatePickerScope) {
			super($scope);
			this.$scope = $scope;
			$scope.selectDay = (day: CalendarDay) => {
				this.setViewValue(day.date);
				$scope.displayStr = this.getDisplayStr(day.date);
				this.selected = day.date;
				this.assignClasses();
				this.closePopover();
			};
			$scope.togglePopover = ($event: ng.IAngularEvent) => {
				this.togglePopover($event);
			};

			$scope.$watch("min", (): void => {
				// revalidate
				this.validate();
				this.selected = this.getViewValue();
				this.assignClasses();
			});
			$scope.$watch("max", (): void => {
				this.validate();
				this.selected = this.getViewValue();
				this.assignClasses();
			});
		}
		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				let date = this.formatter.parseValue(ngModelCtrl.$viewValue);
				this.currentMonth = moment(date).startOf("month");
				this.$scope.months = this.constructMonths();
				this.selected = date;
				this.assignClasses();
				this.$scope.displayStr = this.getDisplayStr(date);
			};
			(<ICalendarValidators>ngModelCtrl.$validators).min = (modelValue: any, viewValue: any) => {
				return !this.formatter.parseValue(viewValue) || !this.formatter.parseValue(this.$scope.min) || this.formatter.parseValue(this.$scope.min).diff(this.formatter.parseValue(viewValue)) <= 0;
			};
			(<ICalendarValidators>ngModelCtrl.$validators).max = (modelValue: any, viewValue: any) => {
				return !this.formatter.parseValue(viewValue) || !this.formatter.parseValue(this.$scope.max) || this.formatter.parseValue(this.$scope.max).diff(this.formatter.parseValue(viewValue)) >= 0;
			};
		}
		public setFormat(format: string, displayFormat?: string): void {
			this.formatter = new Lui.Utils.MomentFormatter(format);
			if (format !== "moment" && format !== "date") {
				this.displayFormat = displayFormat || format || "L";
			} else {
				this.displayFormat = displayFormat || "L";
			}
		}

		public setPopoverTrigger(elt: angular.IAugmentedJQuery, $scope: IDatePickerScope): void {
			this.popoverController = new Lui.Utils.ClickoutsideTrigger(elt, $scope);
			$scope.popover = { isOpen: false };
			$scope.togglePopover = ($event: ng.IAngularEvent) => {
				this.togglePopover($event);
			};
		}

		// ng-model logic
		private setViewValue(value: moment.Moment): void {
			this.ngModelCtrl.$setViewValue(this.formatter.formatValue(value));
		}
		private getViewValue(): moment.Moment {
			return this.formatter.parseValue(this.ngModelCtrl.$viewValue);
		}
		private validate(): void {
			this.ngModelCtrl.$validate();
		}

		// popover logic
		private togglePopover($event: ng.IAngularEvent): void {
			if (this.$scope.popover.isOpen) {
				this.closePopover();
			} else {
				this.openPopover($event);
			}
		}
		private closePopover(): void {
			if (!!this.popoverController) {
				this.popoverController.close();
			}
		}
		private openPopover($event: ng.IAngularEvent): void {
			if (!!this.popoverController) {
				this.popoverController.open($event);
			}
		}
		private getDisplayStr(date: moment.Moment): string {
			return !!date ? date.format(this.displayFormat) : undefined;
		}
	}

	angular.module("lui.directives").controller(LuidDatePickerController.IID, LuidDatePickerController);
	angular.module("lui.directives").directive(LuidDatePicker.IID, LuidDatePicker.factory());
	angular.module("lui.directives").directive(LuidDatePickerPopup.IID, LuidDatePickerPopup.factory());
}
