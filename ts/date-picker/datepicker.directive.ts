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
		public empty: boolean;
		public disabled: boolean;
		public selected: boolean;
		public customClass: string;
		constructor(date: moment.Moment) {
			this.date = date;
			this.dayNum = date.date();
		}
	}
	interface IDatePickerScope extends ng.IScope, Lui.Utils.IClickoutsideTriggerScope {
		format: string;
		displayedMonths: string;
		min: any;
		max: any;
		customClass: (date: moment.Moment) => string;

		dayLabels: string[];
		months: Month[];

		selectDay: (day: Day) => void;
		previousMonth: () => void;
		nextMonth: () => void;

		displayStr: string;
		displayFormat: string;

		togglePopover: ($event: ng.IAngularEvent) => void;
	}

	class LuidDatePickerController {
		public static IID: string = "luidDatePickerController";
		public static $inject: Array<string> = ["$scope"];
		private ngModelCtrl: ng.INgModelController;
		private $scope: IDatePickerScope;
		// private format: string;
		private formatter: Lui.Utils.MomentFormatter;
		private displayFormat: string;
		private monthsCnt: number;
		private monthOffset: number = 0;
		// private elt: angular.IAugmentedJQuery;
		// private body: angular.IAugmentedJQuery;
		private popoverController: Lui.Utils.IPopoverController;

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

				this.setViewValue(this.formatter.formatValue(day.date));
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

			$scope.$watch("min", (): void => {
				// revalidate
				this.validate();
				// reassign classes for each day
				let allDays: Day[] = _.chain($scope.months)
					.pluck("weeks")
					.flatten()
					.pluck("days")
					.flatten()
					.value();
				this.assignClasses(allDays, this.getViewValue());
			});
			$scope.$watch("max", (): void => {
				// revalidate
				this.validate();
				// reassign classes for each day
				let allDays: Day[] = _.chain($scope.months)
					.pluck("weeks")
					.flatten()
					.pluck("days")
					.flatten()
					.value();
				this.assignClasses(allDays, this.getViewValue());
			});
		}
		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				let date = this.formatter.parseValue(ngModelCtrl.$viewValue);
				this.monthOffset = 0;
				this.$scope.months = this.constructMonths(date);
				this.$scope.displayStr = this.getDisplayStr(date);
			};
			(<ICalendarValidators>ngModelCtrl.$validators).min = (modelValue: any, viewValue: any) => {
				return !this.formatter.parseValue(viewValue) || !this.formatter.parseValue(this.$scope.min) || this.formatter.parseValue(this.$scope.min).diff(this.formatter.parseValue(viewValue)) <= 0;
			};
			(<ICalendarValidators>ngModelCtrl.$validators).max = (modelValue: any, viewValue: any) => {
				return !this.formatter.parseValue(viewValue) || !this.formatter.parseValue(this.$scope.max) || this.formatter.parseValue(this.$scope.max).diff(this.formatter.parseValue(viewValue)) >= 0;
			};
		}
		public setMonthsCnt(cntStr: string): void {
			this.monthsCnt = parseInt(cntStr, 10) || 1;
		}
		public setFormat(format: string, displayFormat?: string): void {
			this.formatter = new Lui.Utils.MomentFormatter(format);
			if (format !== "moment" && format !== "date") {
				this.displayFormat = displayFormat || format || "L";
			} else {
				this.displayFormat = displayFormat || "L";
			}
		}

		public setPopoverTrigger(elt: angular.IAugmentedJQuery, scope: IDatePickerScope): void {
			this.popoverController = new Lui.Utils.ClickoutsideTrigger(elt, scope);
			scope.togglePopover = ($event: ng.IAngularEvent) => {
				this.togglePopover($event);
			};
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
			return this.formatter.parseValue(this.ngModelCtrl.$viewValue);
		}
		private validate(): void {
			this.ngModelCtrl.$validate();
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
			let week: Week = { days: [] };
			week.days = _.map(_.range(7), (i: number) => {
				let day: Day = new Day(moment(weekStart).add(i, "days"));
				if (day.date.month() !== monthStart.month()) {
					day.empty = true;
				}
				return day;
			});
			this.assignClasses(week.days, selectedDate);
			return week;
		}
		private assignClasses(days: Day[], selectedDate: moment.Moment): void {
			let min: moment.Moment = this.formatter.parseValue(this.$scope.min);
			let max: moment.Moment = this.formatter.parseValue(this.$scope.max);
			_.each(days, (day: Day): void => {
				day.selected = false;
				day.disabled = false;
				if (!!selectedDate && day.date.format("YYYYMMDD") === moment(selectedDate).format("YYYYMMDD") && !day.empty) {
					day.selected = true;
				}
				if (!!min && min.diff(day.date) > 0) {
					day.disabled = true;
				}
				if (!!max && max.diff(day.date) < 0) {
					day.disabled = true;
				}
				if (!!this.$scope.customClass) {
					day.customClass = this.$scope.customClass(day.date);
				}
			});
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
			// this.$scope.popover.isOpen = false;
			// if (!!this.body) {
			// 	this.body.off("click");
			// 	this.elt.off("click");
			// }
			this.popoverController.close();
		}
		private openPopover($event: ng.IAngularEvent): void {
			// this.$scope.popover.isOpen = true;
			// this.body.on("click", () => {
			// 	this.closePopover();
			// 	this.$scope.$digest();
			// });
			// this.elt.on("click", (otherEvent: JQueryEventObject) => {
			// 	otherEvent.stopPropagation();
			// });
			// $event.stopPropagation();
			this.popoverController.open($event);
		}
		private getDisplayStr(date: moment.Moment): string {
			return !!date ? date.format(this.displayFormat) : undefined;
		}
	}

	angular.module("lui.directives").controller(LuidDatePickerController.IID, LuidDatePickerController);
	angular.module("lui.directives").directive(LuidDatePicker.IID, LuidDatePicker.factory());
	angular.module("lui.directives").directive(LuidDatePickerPopup.IID, LuidDatePickerPopup.factory());
}
