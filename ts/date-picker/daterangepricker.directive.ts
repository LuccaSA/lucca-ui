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
			// min: "=",
			// max: "=",
			// customClass: "=",
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
			let datePickerCtrl = <LuidDaterangePickerController>ctrls[1];
			datePickerCtrl.setNgModelCtrl(ngModelCtrl);
			datePickerCtrl.setFormat(scope.format);
			datePickerCtrl.setDisplayFormat(scope.displayFormat);
			datePickerCtrl.setMonthsCnt("1");
			// datePickerCtrl.setMonthsCnt(scope.displayedMonths);
			// datePickerCtrl.setElt(element);
		}
	}

	class Month {
		public date: moment.Moment;
		public currentYear: boolean;
		public weeks: Week[];
		constructor(date: moment.Moment) {
			this.date = moment(date).startOf("month");
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
		public start: boolean;
		public end: boolean;
		public inBetween: boolean;
		public customClass: string;
		constructor(date: moment.Moment) {
			this.date = date;
			this.dayNum = date.date();
		}
	}
	interface IDaterangePickerScope extends ng.IScope {
		format: string;
		// displayedMonths: string;
		// min: any;
		// max: any;
		// customClass: (date: moment.Moment) => string;

		period: Lui.Period;

		editingStart: boolean;
		editStart: ($event?: ng.IAngularEvent) => void;
		editEnd: ($event?: ng.IAngularEvent) => void;

		dayLabels: string[];
		months: Month[];

		selectDay: (day: Day) => void;
		onMouseEnter: (day: Day, $event?: ng.IAngularEvent) => void;
		onMouseLeave: (day: Day, $event?: ng.IAngularEvent) => void;
		previousMonth: () => void;
		nextMonth: () => void;

		displayStr: string;
		displayFormat: string;
		momentFormat: string;
		popover: {
			isOpen: boolean;
		};
		togglePopover: ($event: ng.IAngularEvent) => void;
	}
	// interface IDatePickerValidators extends ng.IModelValidators {
	// 	min: (modelValue: any, viewValue: any) => boolean;
	// 	max: (modelValue: any, viewValue: any) => boolean;
	// }

	class LuidDaterangePickerController {
		public static IID: string = "luidDaterangePickerController";
		public static $inject: Array<string> = ["$scope", "$filter"];
		private ngModelCtrl: ng.INgModelController;
		private $scope: IDaterangePickerScope;
		private $filter: Lui.ILuiFilters;
		private format: string;
		// private displayFormat: string;
		private monthsCnt: number;
		private monthOffset: number = 0;
		// private elt: angular.IAugmentedJQuery;
		// private body: angular.IAugmentedJQuery;

		constructor($scope: IDaterangePickerScope, $filter: Lui.ILuiFilters) {
			this.$scope = $scope;
			this.$filter = $filter;
			this.initDayLabels($scope);
			$scope.selectDay = (day: Day) => {
				if ($scope.editingStart || !!$scope.period.start && day.date.isBefore($scope.period.start)) {
					$scope.period.start = day.date;
					$scope.editEnd();
					if (!!$scope.period.end && $scope.period.start.isAfter($scope.period.end)) {
						$scope.period.end = undefined;
					}
					this.assignInBetween(this.extractDays(), $scope.period.start, $scope.period.end);
				} else {
					$scope.period.end = day.date;
					this.closePopover();
				}
				// unselect previously selected day
				// let allDays: Day[] = _.chain($scope.months)
				// 	.pluck("weeks")
				// 	.flatten()
				// 	.pluck("days")
				// 	.flatten()
				// 	.value();
				// (_.findWhere(allDays, { selected: true }) || { selected: true }).selected = false;
				// day.selected = true;


			// 	this.monthOffset = -Math.floor(moment.duration(day.date.diff($scope.months[0].date)).asMonths());

			// 	this.setViewValue(this.formatValue(day.date));
			// 	$scope.displayStr = this.getDisplayStr(day.date);

			// 	this.closePopover();
			};
			$scope.editStart = ($event?: ng.IAngularEvent) => {
				if (!!$event) {
					$event.stopPropagation();
				}
				$scope.editingStart = true;
			};
			$scope.editEnd = ($event?: ng.IAngularEvent) => {
				if (!!$event) {
					$event.stopPropagation();
				}
				$scope.editingStart = false;
			};
			$scope.onMouseEnter = (day: Day, $event?: ng.IAngularEvent) => {
				if (!$scope.editingStart && !this.$scope.period.end) {
					let days = this.extractDays();
					this.assignInBetween(days, this.$scope.period.start, day.date);
				}
			}
			$scope.onMouseLeave = (day: Day, $event?: ng.IAngularEvent) => {
				let days = this.extractDays();
				this.assignInBetween(days, this.$scope.period.start, $scope.period.end);
			}
			$scope.popover = { isOpen: false };
			$scope.togglePopover = ($event: ng.IAngularEvent) => {
				this.togglePopover($event);
			};
			// $scope.previousMonth = () => {
			// 	this.changeMonths(-1);
			// };
			// $scope.nextMonth = () => {
			// 	this.changeMonths(1);
			// };

			// $scope.$watch("min", (): void => {
			// 	// revalidate
			// 	this.validate();
			// 	// reassign classes for each day
			// 	let allDays: Day[] = _.chain($scope.months)
			// 		.pluck("weeks")
			// 		.flatten()
			// 		.pluck("days")
			// 		.flatten()
			// 		.value();
			// 	this.assignClasses(allDays, this.getViewValue());
			// });
			// $scope.$watch("max", (): void => {
			// 	// revalidate
			// 	this.validate();
			// 	// reassign classes for each day
			// 	let allDays: Day[] = _.chain($scope.months)
			// 		.pluck("weeks")
			// 		.flatten()
			// 		.pluck("days")
			// 		.flatten()
			// 		.value();
			// 	this.assignClasses(allDays, this.getViewValue());
			// });
		}
		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				if (ngModelCtrl.$viewValue){
					this.$scope.period = this.getViewValue();
					this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
				} else {
					this.$scope.period = undefined;
					this.$scope.displayStr = undefined;
				}
				// let date = this.parseValue(ngModelCtrl.$viewValue);
				// this.monthOffset = 0;
				// this.$scope.months = this.constructMonths(date);
				// this.$scope.displayStr = this.getDisplayStr(date);
			};
			// (<IDatePickerValidators>ngModelCtrl.$validators).min = (modelValue: any, viewValue: any) => {
			// 	return !this.parseValue(viewValue) || !this.parseValue(this.$scope.min) || this.parseValue(this.$scope.min).diff(this.parseValue(viewValue)) <= 0;
			// };
			// (<IDatePickerValidators>ngModelCtrl.$validators).max = (modelValue: any, viewValue: any) => {
			// 	return !this.parseValue(viewValue) || !this.parseValue(this.$scope.max) || this.parseValue(this.$scope.max).diff(this.parseValue(viewValue)) >= 0;
			// };
		}
		public setMonthsCnt(cntStr: string): void {
			this.monthsCnt = parseInt(cntStr, 10) || 1;
		}
		public setFormat(format: string): void {
			this.format = format || "moment";
		}
		// public setElt(elt: angular.IAugmentedJQuery): void {
		// 	this.elt = elt;
		// 	this.body = angular.element(document.getElementsByTagName("body")[0]);
		// }
		public setDisplayFormat(displayFormat: string): void {
			if (this.format !== "moment" && this.format !== "date") {
				this.$scope.momentFormat = displayFormat || this.format || "L";
			} else {
				this.$scope.momentFormat = displayFormat || "L";
			}
		}
		// public changeMonths(offset: number): void {
		// 	this.monthOffset += offset;
		// 	this.$scope.months = this.constructMonths(this.getViewValue());
		// }
		public constructMonths(start: moment.Moment): Month[] {
			return _.map(_.range(this.monthsCnt), (offset: number): Month => {
				return this.constructMonth(moment(start).add(offset, "months").startOf("month"));
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
		private initDayLabels($scope: IDaterangePickerScope): void {
			$scope.dayLabels = _.map(_.range(7), (i: number): string => {
				return moment().startOf("week").add(i, "days").format("dd");
			});
		}

		// ng-model logic
		private setViewValue(value: Lui.Period): void {
			let period: Lui.IPeriod = <Lui.IPeriod>this.ngModelCtrl.$viewValue;
			if (!value || !value.start || !value.end) {
				period.start = undefined;
				period.end = undefined;
			} else {
				period.start = this.formatValue(moment(value.start));
				period.end = this.formatValue(moment(value.end));
			}
			this.ngModelCtrl.$setViewValue(period);
		}
		private getViewValue(): Lui.Period {
			if (!!this.ngModelCtrl.$viewValue) {
				let format = this.format;
				if (format === "moment" || format === "date") {
					format = undefined;
				}
				return new Lui.Period(<Lui.IPeriod>this.ngModelCtrl.$viewValue, format);
			}
			return { start: undefined, end: undefined };
		}
		private validate(): void {
			this.ngModelCtrl.$validate();
		}

		// month construction
		private constructMonth(monthStart: moment.Moment): Month {
			let month: Month = new Month(monthStart);

			let weekStart = moment(month.date).startOf("week");
			while (weekStart.month() === month.date.month() || moment(weekStart).endOf("week").month() === month.date.month()) {
				month.weeks.push(this.constructWeek(weekStart, month.date));
				weekStart.add(1, "week");
			}
			return month;
		}
		private constructWeek(weekStart: moment.Moment, monthStart: moment.Moment): Week {
			let week: Week = { days: [] };
			week.days = _.map(_.range(7), (i: number) => {
				let day: Day = new Day(moment(weekStart).add(i, "days"));
				if (day.date.month() !== monthStart.month()) {
					day.empty = true;
				}
				return day;
			});
			// this.assignClasses(week.days, selectedDate);
			return week;
		}
		private assignClasses(): void {
			// let min: moment.Moment = this.parseValue(this.$scope.min);
			// let max: moment.Moment = this.parseValue(this.$scope.max);
			let days = this.extractDays();
			let period: Lui.Period = this.$scope.period;
			this.assignInBetween(days, period.start, period.end);
			_.each(days, (day: Day): void => {
				// if (!!min && min.diff(day.date) > 0) {
				// 	day.disabled = true;
				// }
				// if (!!max && max.diff(day.date) < 0) {
				// 	day.disabled = true;
				// }
				// if (!!this.$scope.customClass) {
				// 	day.customClass = this.$scope.customClass(day.date);
				// }
			});
		}
		private assignInBetween(days: Day[], start?: moment.Moment, end?: moment.Moment): void {
			let period = this.$scope.period;
			_.each(days, (day: Day): void => {
				day.start = false;
				day.end = false;
				day.inBetween = false;
				if (!!start && day.date.format("YYYYMMDD") === moment(start).format("YYYYMMDD")) {
					day.start = true;
				}
				if (!!end && day.date.format("YYYYMMDD") === moment(end).format("YYYYMMDD")) {
					day.end = true;
				}
				if (!!start && !!end && day.date.isAfter(start) && day.date.isBefore(end)) {
					day.inBetween = true;
				}
			});

		}
		private extractDays(): Day[] {
			return _.chain(this.$scope.months)
			.pluck("weeks")
			.flatten()
			.pluck("days")
			.flatten()
			.reject((day: Day) => {
				return day.empty;
			})
			.value();
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
			if (!!this.$scope.period.start && !!this.$scope.period.end) {
				this.setViewValue(this.$scope.period);
				this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
			} else {
				this.$scope.period = this.getViewValue();
			}
			// if (!!this.body) {
			// 	this.body.off("click");
			// 	this.elt.off("click");
			// }
		}
		private openPopover($event: ng.IAngularEvent): void {
			this.$scope.period = this.getViewValue();
			this.$scope.popover.isOpen = true;
			let vv: Lui.Period = <Lui.Period>this.getViewValue();
			this.$scope.months = this.constructMonths(!!vv ? moment(vv.start) : moment());
			this.assignClasses();
			this.$scope.editingStart = true;
			// this.body.on("click", () => {
			// 	this.closePopover();
			// 	this.$scope.$digest();
			// });
			// this.elt.on("click", (otherEvent: JQueryEventObject) => {
			// 	otherEvent.stopPropagation();
			// });
			// $event.stopPropagation();
		}
		// private getDisplayStr(date: moment.Moment): string {
		// 	return !!date ? date.format(this.displayFormat) : undefined;
		// }
	}

	angular.module("lui.directives").controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);
	angular.module("lui.directives").directive(LuidDaterangePicker.IID, LuidDaterangePicker.factory());
}
