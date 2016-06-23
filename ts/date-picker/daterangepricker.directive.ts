module Lui.Directives {
	"use strict";

	class LuidDaterangePicker implements angular.IDirective {
		public static IID: string = "luidDaterangePicker";
		public restrict = "E";
		public templateUrl = "lui/templates/date-picker/daterangepicker.html";
		public require = ["ngModel", "luidDaterangePicker"];
		public scope = {
			format: "@",
			displayFormat: "@",
			// displayedMonths: "@",
			min: "=",
			max: "=",
			customClass: "=",
			excludeEnd: "@",
			startProperty: "@",
			endProperty: "@",
		};
		public controller: string = LuidDaterangePickerController.IID;
		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidDaterangePicker();
			};
			return directive;
		}
		public link(scope: IDaterangePickerScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			let drCtrl = <LuidDaterangePickerController>ctrls[1];
			drCtrl.setNgModelCtrl(ngModelCtrl);
			drCtrl.setFormat(scope.format, scope.displayFormat);
			drCtrl.setMonthsCnt("2");
			// datePickerCtrl.setMonthsCnt(scope.displayedMonths);
			drCtrl.setPopoverTrigger(element, scope);
			drCtrl.setExcludeEnd(scope.excludeEnd);
			drCtrl.setProperties(scope.startProperty, scope.endProperty);
		}
	}

	interface IDaterangePickerScope extends ng.IScope, Lui.Utils.IClickoutsideTriggerScope, ICalendarScope {
		format: string;
		excludeEnd: string;
		startProperty: string;
		endProperty: string;

		period: Lui.Period;

		editingStart: boolean;
		editStart: ($event?: ng.IAngularEvent) => void;
		editEnd: ($event?: ng.IAngularEvent) => void;

		displayStr: string;
		displayFormat: string;
		momentFormat: string;
		fromLabel: string;
		toLabel: string;
		togglePopover($event: ng.IAngularEvent): void;
		clear($event: ng.IAngularEvent): void;
	}


	class LuidDaterangePickerController extends CalendarController {
		public static IID: string = "luidDaterangePickerController";
		public static $inject: Array<string> = ["$scope", "$filter"];
		protected $scope: IDaterangePickerScope;
		private formatter: Lui.Utils.IFormatter<moment.Moment>;
		private ngModelCtrl: ng.INgModelController;
		private $filter: Lui.ILuiFilters;
		private popoverController: Lui.Utils.IPopoverController;
		private excludeEnd: boolean;
		private startProperty: string;
		private endProperty: string;

		constructor($scope: IDaterangePickerScope, $filter: Lui.ILuiFilters) {
			super($scope);
			this.$scope = $scope;
			this.$filter = $filter;

			switch (moment.locale()) {
				case "fr":
					$scope.fromLabel = "Du";
					$scope.toLabel = "Au";
					break;
				default: // en
					$scope.fromLabel = "From";
					$scope.toLabel = "To";
					break;
			}
			$scope.selectDay = (day: CalendarDay) => {
				if ($scope.editingStart || (!!$scope.period.start && day.date.isBefore($scope.period.start))) {
					$scope.period.start = day.date;
					this.start = day.date;
					$scope.editEnd();
					if (!!$scope.period.end && $scope.period.start.isAfter($scope.period.end)) {
						$scope.period.end = undefined;
						this.end = undefined;
					}
					this.assignClasses();
				} else if (!$scope.editingStart && !!$scope.period.start) {
					$scope.period.end = day.date;
					this.closePopover();
				} else {
					$scope.period.end = day.date;
					$scope.editStart();
				}
			};
			$scope.editStart = ($event?: ng.IAngularEvent) => {
				if (!!$event) {
					$event.stopPropagation();
				}
				$scope.editingStart = true;

				// rebuild calendar if the start is not currently displayed
				if (!!this.$scope.period.start && moment(this.currentMonth).diff(this.$scope.period.start) > 0) {
					this.currentMonth = moment(this.$scope.period.start).startOf("month");
					this.$scope.months = this.constructMonths();
					this.assignClasses();
				}
			};
			$scope.editEnd = ($event?: ng.IAngularEvent) => {
				if (!!$event) {
					$event.stopPropagation();
				}
				$scope.editingStart = false;

				// rebuild calendar to have the end in the last displayed mnth
				if (!!this.$scope.period.end && moment(this.currentMonth).add(this.monthsCnt, "months").diff(this.$scope.period.end) <= 0) {
					this.currentMonth = moment(this.$scope.period.end).add(-this.monthsCnt + 1, "months").startOf("month");
					this.$scope.months = this.constructMonths();
					this.assignClasses();
				}
			};
			$scope.onMouseEnter = (day: CalendarDay, $event?: ng.IAngularEvent) => {
				if (!$scope.editingStart && !this.$scope.period.end) {
					this.end = day.date;
					this.assignClasses();
				}
			};
			$scope.onMouseLeave = (day: CalendarDay, $event?: ng.IAngularEvent) => {
				if (!$scope.editingStart && !this.$scope.period.end) {
					this.end = undefined;
					this.assignClasses();
				}
			};
			$scope.popover = { isOpen: false };
			$scope.clear = ($event: ng.IAngularEvent) => {
				$scope.period.start = undefined;
				$scope.period.end = undefined;
				this.setViewValue(undefined);
				this.closePopover();
				$event.stopPropagation();
			};
		}
		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				if (ngModelCtrl.$viewValue) {
					this.$scope.period = this.getViewValue();
					this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
				} else {
					this.$scope.period = undefined;
					this.$scope.displayStr = undefined;
				}
			};
			(<ICalendarValidators>ngModelCtrl.$validators).min = (modelValue: any, viewValue: any) => {
				let start = this.getViewValue().start;
				let min = this.formatter.parseValue(this.$scope.min);
				return !start || !min || min.diff(start) <= 0;
			};
			(<ICalendarValidators>ngModelCtrl.$validators).max = (modelValue: any, viewValue: any) => {
				let end = this.getViewValue().end;
				let max = this.formatter.parseValue(this.$scope.max);
				return !end || !max || max.diff(end) >= 0;
			};
		}
		public setProperties(startProperty: string, endProperty: string): void {
			this.startProperty = startProperty || "start";
			this.endProperty = endProperty || "end";
		}
		public setExcludeEnd(excludeEnd: string): void {
			this.excludeEnd = excludeEnd === "true";
		}
		public setFormat(format: string, displayFormat: string): void {
			this.formatter = new Lui.Utils.MomentFormatter(format);
			if (format !== "moment" && format !== "date") {
				this.$scope.momentFormat = displayFormat || format || "L";
			} else {
				this.$scope.momentFormat = displayFormat || "L";
			}
		}
		public setPopoverTrigger(elt: angular.IAugmentedJQuery, scope: IDaterangePickerScope): void {
			let onClosing = () => {
				this.closePopover();
			};
			this.popoverController = new Lui.Utils.ClickoutsideTrigger(elt, scope, onClosing);
			scope.togglePopover = ($event: ng.IAngularEvent) => {
				this.togglePopover($event);
			};
		}

		// ng-model logic
		private setViewValue(value: Lui.Period): void {
			let period: Lui.IPeriod = <Lui.IPeriod>this.ngModelCtrl.$viewValue || {};
			if (!value || !value.start || !value.end) {
				period[this.startProperty] = undefined;
				period[this.endProperty] = undefined;
			} else {
				period[this.startProperty] = this.formatter.formatValue(moment(value.start));
				period[this.endProperty] = this.formatter.formatValue(this.excludeEnd ? moment(value.end).add(1, "day") : moment(value.end));
			}
			this.ngModelCtrl.$setViewValue(period);
		}
		private getViewValue(): Lui.Period {
			if (!!this.ngModelCtrl.$viewValue) {
				let iperiod: Lui.IPeriod = {};
				iperiod.start = this.ngModelCtrl.$viewValue[this.startProperty];
				iperiod.end = this.ngModelCtrl.$viewValue[this.endProperty];
				let period = new Lui.Period(iperiod, this.formatter);
				if (this.excludeEnd) {
					period.end.add(-1, "day");
				}
				return period;
			}
			return { start: undefined, end: undefined };
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
			this.$scope.direction = "";
			if (!!this.$scope.period.start && !!this.$scope.period.end) {
				this.setViewValue(this.$scope.period);
				this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
			} else {
				this.$scope.period = this.getViewValue();
				this.$scope.displayStr = "";
			}
			this.popoverController.close();
		}
		private openPopover($event: ng.IAngularEvent): void {
			let vv: Lui.Period = this.getViewValue();
			this.$scope.period = vv || { start: undefined, end: undefined };
			this.currentMonth = (!!vv ? moment(vv.start) : moment()).startOf("month");
			this.$scope.months = this.constructMonths();
			if (!!vv) {
				this.start = vv.start;
				this.end = vv.end;
			}
			this.min = this.formatter.parseValue(this.$scope.min);
			this.max = this.formatter.parseValue(this.$scope.max);
			this.assignClasses();
			this.$scope.editingStart = true;
			this.popoverController.open($event);
		}
	}

	angular.module("lui.directives").controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);
	angular.module("lui.directives").directive(LuidDaterangePicker.IID, LuidDaterangePicker.factory());
}
