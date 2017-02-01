module lui.datepicker {
	"use strict";

	// to auto focus the first date input
	angular.module("lui").directive("autoFocus", () => {
		return { restrict: "A", link: ($scope: any, element: angular.IAugmentedJQuery): void => { element[0].focus(); } };
	});

	class LuidDaterangePicker implements angular.IDirective {
		public static IID: string = "luidDaterangePicker";
		public restrict = "E";
		public templateUrl = "lui/templates/date-picker/daterangepicker.html";
		public require = ["ngModel", "luidDaterangePicker"];
		public scope = {
			format: "@",
			displayFormat: "@",
			minMode: "@",
			min: "=",
			max: "=",
			customClass: "=",
			excludeEnd: "@",
			startProperty: "@",
			endProperty: "@",

			placeholder: "@",

			shortcuts: "=",
			groupedShortcuts: "=",
			disableKeyboardInput: "="
		};
		public controller: string = LuidDaterangePickerController.IID;
		public static factory(): angular.IDirectiveFactory {
			return () => { return new LuidDaterangePicker(); };
		}
		public link(scope: IDaterangePickerScope, element: angular.IAugmentedJQuery, attrs: { ngChange: string }, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			let drCtrl = <LuidDaterangePickerController>ctrls[1];
			drCtrl.setNgModelCtrl(ngModelCtrl);
			drCtrl.setFormat(scope.format, scope.displayFormat);
			drCtrl.setCalendarCnt("2", true);
			drCtrl.setPopoverTrigger(element, scope);
			drCtrl.setExcludeEnd(scope.excludeEnd);
			drCtrl.setProperties(scope.startProperty, scope.endProperty);
			drCtrl.setElement(element);
		}
	}

	interface IDaterangePickerScope extends ng.IScope, popover.IClickoutsideTriggerScope, ICalendarScope {
		format: string;
		excludeEnd: string;
		startProperty: string;
		endProperty: string;

		internal: {
			startDisplayStr?: string;
			endDisplayStr?: string;
		};

		disableKeyboardInput: boolean;

		onStartDisplayStrChanged: ($event?: ng.IAngularEvent) => void;
		onEndDisplayStrChanged: ($event?: ng.IAngularEvent) => void;

		period: Period;

		focusEndInputOnTab: { [key: number]: ($event: ng.IAngularEvent) => void };
		closePopoverOnTab: { [key: number]: ($event: ng.IAngularEvent) => void };

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
		public static $inject: Array<string> = ["$scope", "$filter", "$log"];
		protected $scope: IDaterangePickerScope;
		private formatter: IFormatter<moment.Moment>;
		private ngModelCtrl: ng.INgModelController;
		private $filter: IFilterService;
		private popoverController: popover.IPopoverController;
		private excludeEnd: boolean;
		private startProperty: string;
		private endProperty: string;
		private element: ng.IAugmentedJQuery;

		constructor($scope: IDaterangePickerScope, $filter: IFilterService, $log: ng.ILogService) {
			super($scope, $log);
			this.$scope = $scope;
			this.$filter = $filter;
			$scope.internal = {};

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

			$scope.internal.startDisplayStr = "";
			$scope.internal.endDisplayStr = "";

			$scope.focusEndInputOnTab = { 9: ($event: ng.IAngularEvent): void => { this.$scope.editEnd($event); } };
			$scope.closePopoverOnTab = { 9: ($event: ng.IAngularEvent): void => { this.closePopover(); this.$scope.$apply(); } };

			$scope.selectShortcut = (shortcut: Shortcut) => {
				$scope.period = this.toPeriod(shortcut);
				$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
				this.setViewValue($scope.period);
				this.closePopover();
			};

			$scope.onStartDisplayStrChanged = ($event?: ng.IAngularEvent): void => {
				let displayStr = $scope.internal.startDisplayStr;
				let dateFromStr;
				if (moment(displayStr, $scope.displayFormat).isValid()) {
					dateFromStr = moment(displayStr, $scope.displayFormat);
				} else if (moment(displayStr, $scope.format).isValid()) {
					dateFromStr = moment(displayStr, $scope.format);
				} else {
					return;
				}
				this.selectDate(dateFromStr, false, false);
				this.currentDate = this.$scope.period.start;
				this.start = this.$scope.period.start;
				$scope.calendars = this.constructCalendars();
				this.assignClasses();
			};

			$scope.onEndDisplayStrChanged = ($event?: ng.IAngularEvent): void => {
				let displayStr = $scope.internal.endDisplayStr;
				let dateFromStr;
				if (moment(displayStr, $scope.displayFormat).isValid()) {
					dateFromStr = moment(displayStr, $scope.displayFormat);
				} else if (moment(displayStr, $scope.format).isValid()) {
					dateFromStr = moment(displayStr, $scope.format);
				} else {
					return;
				}
				this.selectDate(dateFromStr, false, false);
				this.currentDate = moment(this.$scope.period.end);
				this.end = this.currentDate;
				$scope.calendars = this.constructCalendars();
				this.assignClasses();
			};

			$scope.editStart = ($event?: ng.IAngularEvent) => {
				if (!!$event) {
					$event.stopPropagation();
				}
				$scope.editingStart = true;

				// rebuild calendar if the start is not currently displayed
				if (!!this.$scope.period.start && moment(this.currentDate).diff(this.$scope.period.start) > 0) {
					this.currentDate = moment(this.$scope.period.start).startOf("month");
					this.$scope.calendars = this.constructCalendars();
					this.assignClasses();
				}
			};
			$scope.editEnd = ($event?: ng.IAngularEvent) => {
				if (!!$event) {
					$event.stopPropagation();
				}
				$scope.editingStart = false;

				// rebuild calendar to have the end in the last displayed mnth
				if (!!this.$scope.period.end && moment(this.currentDate).add(this.calendarCnt, "months").diff(this.$scope.period.end) <= 0) {
					this.currentDate = moment(this.$scope.period.end).add(-this.calendarCnt + 1, "months").startOf("month");
					this.$scope.calendars = this.constructCalendars();
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

		public setElement(element: ng.IAugmentedJQuery): void {
			this.element = element;
		}

		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				if (ngModelCtrl.$viewValue) {
					this.$scope.period = this.getViewValue();
					this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
					this.$scope.internal.startDisplayStr = !!this.$scope.period && !!this.$scope.period[this.startProperty] ? this.formatter.formatValue(moment(this.$scope.period[this.startProperty])) : "";
					this.$scope.internal.endDisplayStr = !!this.$scope.period && !!this.$scope.period[this.endProperty] ? this.formatter.formatValue(moment(this.$scope.period[this.endProperty])) : "";
				} else {
					this.$scope.period = undefined;
					this.$scope.displayStr = undefined;
				}
			};
			ngModelCtrl.$isEmpty = (value: any) => {
				let period: IPeriod = this.toPeriod(value);
				return !period || (!period.start && !period.end);
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
			if (!!this.$scope.customClass) {
				(<ICalendarValidators>ngModelCtrl.$validators).customClass = (modelValue: any, viewValue: any) => {
					let value = this.getViewValue();
					if (!!this.$scope.customClass && !!value) {
						let resStart = true, resEnd = true;
						if (!!value.start) {
							let customClassStart = this.$scope.customClass(value.start, CalendarMode.Days).toLowerCase();
							resStart = customClassStart.indexOf("disabled") === -1 && customClassStart.indexOf("forbidden") === -1;
						}
						if (!!value.end) {
							let customClassEnd = this.$scope.customClass(value.end, CalendarMode.Days).toLowerCase();
							resEnd = customClassEnd.indexOf("disabled") === -1 && customClassEnd.indexOf("forbidden") === -1;
						}
						return resStart && resEnd;
					}
					return true;
				};
			}
		}
		public setProperties(startProperty: string, endProperty: string): void {
			this.startProperty = startProperty || "start";
			this.endProperty = endProperty || "end";
		}
		public setExcludeEnd(excludeEnd: string): void {
			this.excludeEnd = excludeEnd === "true";
		}
		public setFormat(format: string, displayFormat: string): void {
			this.formatter = new formatter.MomentFormatter(format);
			if (format !== "moment" && format !== "date") {
				this.$scope.momentFormat = displayFormat || format || "L";
			} else {
				this.$scope.momentFormat = displayFormat || "L";
			}
		}
		public setPopoverTrigger(elt: angular.IAugmentedJQuery, scope: IDaterangePickerScope): void {
			let onClosing = () => { this.closePopover(); };
			this.popoverController = new popover.ClickoutsideTrigger(elt, scope, onClosing);
			scope.togglePopover = ($event: ng.IAngularEvent) => { this.togglePopover($event); };
		}

		protected selectDate(date: moment.Moment, goToNextState: boolean = true, updateDisplayStrs: boolean = true): void {
			if (this.$scope.editingStart) {
				this.$scope.period.start = date;
				this.start = date;
				if (updateDisplayStrs) { this.$scope.internal.startDisplayStr = date.format(this.$scope.displayFormat); }
				if (goToNextState) { this.$scope.editEnd(); }

				if (!!this.$scope.period.end && this.$scope.period.start.isAfter(this.$scope.period.end)) {
					this.$scope.period.end = undefined;
					this.end = undefined;
				}
				this.assignClasses();
			} else {
				switch (this.minMode) {
					case CalendarMode.Months:
						this.$scope.period.end = date.endOf("month").startOf("day");
						break;
					case CalendarMode.Years:
						this.$scope.period.end = date.endOf("year").startOf("day");
						break;
					default:
						this.$scope.period.end = date;
						if (updateDisplayStrs) { this.$scope.internal.endDisplayStr = date.format(this.$scope.displayFormat); }
				}
				if (!!this.$scope.period.start) {
					if (goToNextState) {
						this.closePopover();
					}
				} else {
					this.$scope.editStart();
				}
			}
		}

		// ng-model logic
		private setViewValue(value: IPeriod): void {
			let period: IPeriod = _.clone(<IPeriod>this.ngModelCtrl.$viewValue);
			if (!value && !period) {
				this.$scope.internal.startDisplayStr = "";
				this.$scope.internal.endDisplayStr = "";
				return this.ngModelCtrl.$setViewValue(undefined);
			}
			period = period || {};
			if (!value) {
				period[this.startProperty] = undefined;
				period[this.endProperty] = undefined;

				this.$scope.internal.startDisplayStr = "";
				this.$scope.internal.endDisplayStr = "";
			} else {
				period[this.startProperty] = !!value.start ? this.formatter.formatValue(moment(value.start)) : undefined;
				period[this.endProperty] = !!value.end ? this.formatter.formatValue(this.excludeEnd ? moment(value.end).add(1, "day") : moment(value.end)) : undefined;

				this.$scope.internal.startDisplayStr = period[this.startProperty];
				this.$scope.internal.endDisplayStr = period[this.endProperty];
			}
			this.ngModelCtrl.$setViewValue(period);
		}
		private getViewValue(): Period {
			return this.toPeriod(this.ngModelCtrl.$viewValue);
		}
		private toPeriod(v: any): Period {
			if (!v) {
				return { start: undefined, end: undefined };
			}
			let iperiod: IPeriod = {};
			iperiod.start = v[this.startProperty];
			iperiod.end = v[this.endProperty];
			let period = new Period(iperiod, this.formatter);
			if (this.excludeEnd && !!period.end) {
				period.end.add(-1, "day");
			}
			return period;
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
			if (!!this.$scope.period.start && !!this.$scope.period.end && this.$scope.period.start.isAfter(this.$scope.period.end)) {
				let tmp = this.$scope.period.start;
				this.$scope.period.start = this.$scope.period.end;
				this.$scope.period.end = tmp;
			}
			this.$scope.direction = "";
			this.setViewValue(this.$scope.period);
			this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
			this.element.removeClass("ng-open");
			this.popoverController.close();
		}
		private openPopover($event: ng.IAngularEvent): void {
			let vv: Period = this.getViewValue();
			this.$scope.period = vv || { start: undefined, end: undefined };
			this.currentDate = (!!vv ? moment(vv.start) : moment()).startOf("month");
			this.$scope.mode = this.minMode;
			this.$scope.direction = "init";
			this.$scope.calendars = this.constructCalendars();
			if (!!vv) {
				this.start = vv.start;
				this.end = vv.end;
			}
			this.min = this.formatter.parseValue(this.$scope.min);
			this.max = this.formatter.parseValue(this.$scope.max);
			this.assignClasses();
			this.$scope.editingStart = true;
			this.element.addClass("ng-open");
			this.popoverController.open($event);
		}
	}

	angular.module("lui").controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);
	angular.module("lui").directive(LuidDaterangePicker.IID, LuidDaterangePicker.factory());
}
