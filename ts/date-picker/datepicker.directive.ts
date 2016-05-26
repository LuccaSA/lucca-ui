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
			datePickerCtrl.setFormat(scope.format);
			datePickerCtrl.setDisplayFormat(scope.displayFormat);
			datePickerCtrl.setMonthsCnt(scope.displayedMonths);
			datePickerCtrl.setElt(element);
		}
	}

	class Month {
		public date: moment.Moment;
		public currentYear: boolean;
		public weeks: Week[];
		constructor(date: moment.Moment, offset: number) {
			this.date = moment(date).add(offset, "months").startOf("month");
			this.weeks = [];
			this.currentYear = this.date.year() === moment().year();
		}
	}
	class Week {
		public days: Day[];
	}
	class Day {
		public date: moment.Moment;
		public dayNum: number;
		// public classes: string[];
		empty: boolean;
		disabled: boolean;
		selected: boolean;
		constructor(date: moment.Moment) {
			this.date = date;
			this.dayNum = date.date();
			// this.classes = [];
		}
	}
	interface IDatePickerScope extends ng.IScope {
		format: string;
		displayedMonths: string;
		min: any;
		max: any;

		dayLabels: string[];
		months: Month[];

		selectDay: (day: Day) => void;
		previousMonth: () => void;
		nextMonth: () => void;

		displayStr: string;
		displayFormat: string;
		popover: {
			isOpen: boolean;
		};
		togglePopover: ($event: ng.IAngularEvent) => void;
	}
	interface IDatePickerValidators extends ng.IModelValidators {
		min: (modelValue: any, viewValue: any) => boolean;
		max: (modelValue: any, viewValue: any) => boolean;
	}

	class LuidDatePickerController {
		public static IID: string = "luidDatePickerController";
		public static $inject: Array<string> = ["$scope"];
		private ngModelCtrl: ng.INgModelController;
		private $scope: IDatePickerScope;
		private format: string;
		private displayFormat: string;
		private monthsCnt: number;
		private monthOffset: number = 0;
		private elt: angular.IAugmentedJQuery;
		private body: angular.IAugmentedJQuery;

		constructor($scope: IDatePickerScope) {
			this.$scope = $scope;
			this.initDayLabels($scope);
			$scope.selectDay = (day: Day) => {
				// unselect previously selected day
				let allDays: Day[] = _.chain($scope.months)
					.pluck("weeks")
					.flatten()
					.pluck("days")
					.flatten()
					.value();
				(_.findWhere(allDays, { selected: true }) || { selected: true }).selected = false;
				day.selected = true;


				this.monthOffset = -Math.floor(moment.duration(day.date.diff($scope.months[0].date)).asMonths());

				this.setViewValue(this.formatValue(day.date));
				$scope.displayStr = this.getDisplayStr(day.date);

				this.closePopover();
			};
			$scope.popover = { isOpen: false };
			$scope.togglePopover = ($event: ng.IAngularEvent) => {
				this.togglePopover($event);
			};
			$scope.previousMonth = () => {
				this.changeMonths(-1);
			};
			$scope.nextMonth = () => {
				this.changeMonths(1);
			};
		}
		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				let date = this.parseValue(ngModelCtrl.$viewValue);
				this.monthOffset = 0;
				this.$scope.months = this.constructMonths(date);
				this.$scope.displayStr = this.getDisplayStr(date);
			};
			(<IDatePickerValidators>ngModelCtrl.$validators).min = (modelValue: any, viewValue: any) => {
				return !this.parseValue(viewValue) || !this.parseValue(this.$scope.min) || this.parseValue(this.$scope.min).diff(this.parseValue(viewValue)) <= 0;
			};
			(<IDatePickerValidators>ngModelCtrl.$validators).max = (modelValue: any, viewValue: any) => {
				return !this.parseValue(viewValue) || !this.parseValue(this.$scope.max) || this.parseValue(this.$scope.max).diff(this.parseValue(viewValue)) >= 0;
			};

		}
		public setMonthsCnt(cntStr: string): void {
			this.monthsCnt = parseInt(cntStr, 10) || 1;
		}
		public setFormat(format: string): void {
			this.format = format || "moment";
		}
		public setElt(elt: angular.IAugmentedJQuery): void {
			this.elt = elt;
			this.body = angular.element(document.getElementsByTagName("body")[0]);
		}
		public setDisplayFormat(displayFormat: string): void {
			if (this.format !== "moment" && this.format !== "date") {
				this.displayFormat = displayFormat || this.format || "L";
			} else {
				this.displayFormat = displayFormat || "L";
			}
		}
		public changeMonths(offset: number): void {
			this.monthOffset += offset;
			this.$scope.months = this.constructMonths(this.getViewValue());
		}
		public constructMonths(selectedDate: moment.Moment): Month[] {
			return _.map(_.range(this.monthsCnt), (offset: number): Month => {
				return this.constructMonth(selectedDate, offset + this.monthOffset);
			});
		}

		// parse - format
		public parseValue(value: any): moment.Moment {
			switch (this.format) {
				case "moment": return this.parseMoment(value);
				case "date": return this.parseDate(value);
				default: return this.parseString(value);
			}
		}
		public formatValue(value: moment.Moment): any {
			switch (this.format) {
				case "moment": return this.formatMoment(value);
				case "date": return this.formatDate(value);
				default: return this.formatString(value);
			}
		}
		private parseMoment(value: moment.Moment): moment.Moment {
			return !!value ? moment(value) : undefined;
		}
		private parseDate(value: Date): moment.Moment {
			return !!value ? moment(value) : undefined;
		}
		private parseString(value: string): moment.Moment {
			return !!value && moment(value, this.format).isValid() ? moment(value, this.format) : undefined;
		}
		private formatMoment(value: moment.Moment): moment.Moment {
			return moment(value);
		}
		private formatDate(value: moment.Moment): Date {
			return value.toDate();
		}
		private formatString(value: moment.Moment): string {
			return value.format(this.format);
		}

		// init stuff
		private initDayLabels($scope: IDatePickerScope): void {
			$scope.dayLabels = _.map(_.range(7), (i: number): string => {
				return moment().startOf("week").add(i, "days").format("dd");
			});
		}

		// ng-model logic
		private setViewValue(value: any): void {
			this.ngModelCtrl.$setViewValue(value);
		}
		private getViewValue(): moment.Moment {
			return this.parseValue(this.ngModelCtrl.$viewValue);
		}

		// month construction
		private constructMonth(selectedDate: moment.Moment, offset: number): Month {
			let month: Month = new Month(selectedDate, offset);

			let weekStart = moment(month.date).startOf("week");
			while (weekStart.month() === month.date.month() || moment(weekStart).endOf("week").month() === month.date.month()) {
				month.weeks.push(this.constructWeek(weekStart, month.date, selectedDate));
				weekStart.add(1, "week");
			}
			return month;
		}
		private constructWeek(weekStart: moment.Moment, monthStart: moment.Moment, selectedDate: moment.Moment): Week {
			let min: moment.Moment = this.parseValue(this.$scope.min);
			let max: moment.Moment = this.parseValue(this.$scope.max);
			let week: Week = { days: [] };
			week.days = _.map(_.range(7), (i: number) => {
				let day: Day = new Day(moment(weekStart).add(i, "days"));
				if (day.date.month() !== monthStart.month()) {
					day.empty = true;
				}
				if (!!selectedDate && day.date.format("YYYYMMDD") === moment(selectedDate).format("YYYYMMDD") && !day.empty) {
					day.selected = true;
				}
				if (!!min && min.diff(day.date) > 0) {
					day.disabled = true;
				}
				if (!!max && max.diff(day.date) < 0) {
					day.disabled = true;
				}
				return day;
			});
			return week;
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
			this.$scope.popover.isOpen = false;
			if (!!this.body) {
				this.body.off("click");
				this.elt.off("click");
			}
		}
		private openPopover($event: ng.IAngularEvent): void {
			this.$scope.popover.isOpen = true;
			this.body.on("click", () => {
				this.closePopover();
				this.$scope.$digest();
			});
			this.elt.on("click", (otherEvent: JQueryEventObject) => {
				otherEvent.stopPropagation();
			});
			$event.stopPropagation();
		}
		private getDisplayStr(date: moment.Moment): string {
			return !!date ? date.format(this.displayFormat) : undefined;
		}
	}

	angular.module("lui.directives").controller(LuidDatePickerController.IID, LuidDatePickerController);
	angular.module("lui.directives").directive(LuidDatePicker.IID, LuidDatePicker.factory());
	angular.module("lui.directives").directive(LuidDatePickerPopup.IID, LuidDatePickerPopup.factory());
}
