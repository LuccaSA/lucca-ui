module Lui.Directives {
	"use strict";
	export class CalendarMonth {
		public date: moment.Moment;
		public currentYear: boolean;
		public weeks: CalendarWeek[];
		constructor(date: moment.Moment) {
			this.date = moment(date).startOf("month");
			this.weeks = [];
			this.currentYear = this.date.year() === moment().year();
		}
	}
	export class CalendarWeek {
		public days: CalendarDay[];
	}
	export class CalendarDay {
		public date: moment.Moment;
		public dayNum: number;
		public empty: boolean;
		public disabled: boolean;
		public selected: boolean;
		public start: boolean;
		public end: boolean;
		public inBetween: boolean;
		public customClass: string;
		constructor(date: moment.Moment) {
			this.date = date;
			this.dayNum = date.date();
		}
	}
	export class Shortcut {
		public label: string;
		public date: moment.Moment | Date | string;
	}
	export enum CalendarMode {
		Days = 0,
		Months = 1,
		Years = 2,
	}
	export interface ICalendarScope extends ng.IScope {
		customClass: (date: moment.Moment) => string;
		displayedMonths: string;

		min: any;
		max: any;

		mode: CalendarMode;

		dayLabels: string[];
		months: CalendarMonth[];
		direction: string;

		selectDay(day: CalendarDay): void;
		selectShortcut(shortcut: Shortcut): void;
		previousMonth(): void;
		nextMonth(): void;
		switchMode(): void;

		onMouseEnter(day: CalendarDay, $event?: ng.IAngularEvent): void;
		onMouseLeave(day: CalendarDay, $event?: ng.IAngularEvent): void;

	}
	export interface ICalendarValidators extends ng.IModelValidators {
		min: (modelValue: any, viewValue: any) => boolean;
		max: (modelValue: any, viewValue: any) => boolean;
	}
	export class CalendarController {
		protected monthsCnt: number;
		protected currentMonth: moment.Moment;
		protected $scope: ICalendarScope;
		protected $log: ng.ILogService;
		protected selected: moment.Moment;
		protected start: moment.Moment;
		protected end: moment.Moment;
		protected min: moment.Moment;
		protected max: moment.Moment;
		constructor($scope: ICalendarScope, $log: ng.ILogService) {
			this.$scope = $scope;
			this.$log = $log;
			this.initCalendarScopeMethods($scope);
			this.$scope.mode = CalendarMode.Days;
		}
		public setMonthsCnt(cntStr?: string, inAPopover?: boolean): void {
			this.monthsCnt = parseInt(cntStr, 10) || 1;
			if (inAPopover && this.monthsCnt > 2) {
				this.monthsCnt = 2;
				this.$log.warn("no more than 2 months displayed in a date-picker popover");
			}
		}
		protected constructMonths(): CalendarMonth[] {
			return _.map(_.range(this.monthsCnt), (offset: number): CalendarMonth => {
				return this.constructMonth(moment(this.currentMonth).add(offset, "months").startOf("month"));
			});
		}
		protected constructDayLabels(): string[] {
			return _.map(_.range(7), (i: number): string => {
				return moment().startOf("week").add(i, "days").format("dd");
			});
		}
		protected assignClasses(): void {
			let days = this.extractDays();
			_.each(days, (day: CalendarDay): void => {
				day.selected = false;
				day.start = false;
				day.end = false;
				day.inBetween = false;
				if (!!this.selected && day.date.format("YYYYMMDD") === moment(this.selected).format("YYYYMMDD")) {
					day.selected = true;
				}
				if (!!this.start && day.date.format("YYYYMMDD") === moment(this.start).format("YYYYMMDD")) {
					day.start = true;
				}
				if (!!this.end && day.date.format("YYYYMMDD") === moment(this.end).format("YYYYMMDD")) {
					day.end = true;
				}
				if (!!this.start && !!this.end && day.date.isSameOrAfter(this.start) && day.date.isSameOrBefore(this.end)) {
					day.inBetween = true;
				}
				if (!!this.min && this.min.diff(day.date) > 0) {
					day.disabled = true;
				}
				if (!!this.max && this.max.diff(day.date) < 0) {
					day.disabled = true;
				}
				if (!!this.$scope.customClass) {
					day.customClass = this.$scope.customClass(day.date);
				}
			});
		}
		private initCalendarScopeMethods($scope: ICalendarScope): void {
			$scope.dayLabels = this.constructDayLabels();
			$scope.nextMonth = () => {
				this.currentMonth.add(1, "month");
				$scope.months = this.constructMonths();
				$scope.direction = "next";
				this.assignClasses();
			};
			$scope.previousMonth = () => {
				this.currentMonth.add(-1, "month");
				$scope.months = this.constructMonths();
				$scope.direction = "previous";
				this.assignClasses();
			};
			$scope.switchMode = () => {
				this.$scope.mode = (this.$scope.mode == 2) ? 2 : this.$scope.mode + 1;
			};
		}
		private constructMonth(monthStart: moment.Moment): CalendarMonth {
			let month: CalendarMonth = new CalendarMonth(monthStart);

			let weekStart = moment(month.date).startOf("week");
			while (weekStart.month() === month.date.month() || moment(weekStart).endOf("week").month() === month.date.month()) {
				month.weeks.push(this.constructWeek(weekStart, month.date));
				weekStart.add(1, "week");
			}
			return month;
		}
		private constructWeek(weekStart: moment.Moment, monthStart: moment.Moment): CalendarWeek {
			let week: CalendarWeek = { days: [] };
			week.days = _.map(_.range(7), (i: number) => {
				let day: CalendarDay = new CalendarDay(moment(weekStart).add(i, "days"));
				if (day.date.month() !== monthStart.month()) {
					day.empty = true;
				}
				return day;
			});
			return week;
		}
		private extractDays(): CalendarDay[] {
			return _.chain(this.$scope.months)
			.pluck("weeks")
			.flatten()
			.pluck("days")
			.flatten()
			.reject((day: CalendarDay) => {
				return day.empty;
			})
			.value();
		}
	}


}
