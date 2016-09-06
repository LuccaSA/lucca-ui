module Lui.Directives {
	"use strict";
	export class CalendarController {
		protected calendarCnt: number;
		protected currentDate: moment.Moment;
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
		public setCalendarCnt(cntStr?: string, inAPopover?: boolean): void {
			this.calendarCnt = parseInt(cntStr, 10) || 1;
			if (inAPopover && this.calendarCnt > 2) {
				this.calendarCnt = 2;
				this.$log.warn("no more than 2 months displayed in a date-picker popover");
			}
		}
		protected constructCalendars(): Calendar[] {
			return _.map(_.range(this.calendarCnt), (offset: number): Calendar => {
				return this.constructCalendar(this.currentDate, offset);
			});
		}
		// protected constructMonths(): Calendar[] {
		// 	return _.map(_.range(this.calendarCnt), (offset: number): CalendarMonth => {
		// 		return this.constructMonth(moment(this.currentMonth).add(offset, "months").startOf("month"));
		// 	});
		// }
		protected constructDayLabels(): string[] {
			return _.map(_.range(7), (i: number): string => {
				return moment().startOf("week").add(i, "days").format("dd");
			});
		}
		protected assignClasses(): void {
			switch (this.$scope.mode) {
				case CalendarMode.Days:
					return this.assignDayClasses();
				case CalendarMode.Months:
					return this.assignMonthClasses();
				case CalendarMode.Years:
					return this.assignYearClasses();
			}
		}
		protected assignDayClasses(): void {
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
		protected assignMonthClasses(): void {
			let months = this.extractMonths();
			_.each(months, (month: CalendarDate): void => {
				month.selected = false;
				month.start = false;
				month.end = false;
				month.inBetween = false;
				if (!!this.selected && month.date.format("YYYYMM") === moment(this.selected).format("YYYYMM")) {
					month.selected = true;
				}
				if (!!this.start && month.date.format("YYYYMM") === moment(this.start).format("YYYYMM")) {
					month.start = true;
				}
				if (!!this.end && month.date.format("YYYYMM") === moment(this.end).format("YYYYMM")) {
					month.end = true;
				}
				if (!!this.start && !!this.end && !month.start && !month.end && month.date.isSameOrAfter(this.start) && month.date.isSameOrBefore(this.end)) {
					month.inBetween = true;
				}
				if (!!this.min && this.min.diff(moment(month.date).endOf("month")) > 0) {
					month.disabled = true;
				}
				if (!!this.max && this.max.diff(month.date) < 0) {
					month.disabled = true;
				}
				if (!!this.$scope.customClass) {
					month.customClass = this.$scope.customClass(month.date, CalendarMode.Months);
				}
			});
		}
		protected assignYearClasses(): void {
			let years = this.extractYears();
			_.each(years, (year: CalendarDate): void => {
				year.selected = false;
				year.start = false;
				year.end = false;
				year.inBetween = false;
				if (!!this.selected && year.date.format("YYYY") === moment(this.selected).format("YYYY")) {
					year.selected = true;
				}
				if (!!this.start && year.date.format("YYYY") === moment(this.start).format("YYYY")) {
					year.start = true;
				}
				if (!!this.end && year.date.format("YYYY") === moment(this.end).format("YYYY")) {
					year.end = true;
				}
				if (!!this.start && !!this.end && !year.start && !year.end && year.date.isSameOrAfter(this.start) && year.date.isSameOrBefore(this.end)) {
					year.inBetween = true;
				}
				if (!!this.min && this.min.diff(moment(year.date).endOf("year")) > 0) {
					year.disabled = true;
				}
				if (!!this.max && this.max.diff(year.date) < 0) {
					year.disabled = true;
				}
				if (!!this.$scope.customClass) {
					year.customClass = this.$scope.customClass(year.date, CalendarMode.Years);
				}
			});
		}
		private initCalendarScopeMethods($scope: ICalendarScope): void {
			$scope.dayLabels = this.constructDayLabels();
			$scope.next = () => {
				this.changeCurrentDate(1);
				$scope.calendars = this.constructCalendars();
				$scope.direction = "next";
				this.assignClasses();
			};
			$scope.previous = () => {
				this.changeCurrentDate(-1);
				$scope.calendars = this.constructCalendars();
				$scope.direction = "previous";
				this.assignClasses();
			};
			// $scope.switchMode = (zoomIn: boolean) => {
			// 	let oldMode: CalendarMode = $scope.mode;
			// 	$scope.mode = (zoomIn) ? Math.max(0, $scope.mode -1) : Math.min(2, $scope.mode + 1);

			// 	if ($scope.mode - oldMode !== 0) {
			// 		$scope.direction = ($scope.mode - oldMode > 0) ? "mode-change out" : "mode-change in";
			// 	}
			// };
			$scope.switchToMonthMode = () => {
				$scope.mode = CalendarMode.Months;
				$scope.direction = "mode-change out";
				this.currentDate.startOf("year");
				$scope.calendars = this.constructCalendars();
				this.assignClasses();
			}
			$scope.switchToYearMode = () => {
				$scope.mode = CalendarMode.Years;
				$scope.direction = "mode-change out";
				$scope.calendars = this.constructCalendars();
				this.assignClasses();
			}
		}
		private constructCalendar(start: moment.Moment, offset: number): Calendar {
			let calendar: Calendar;
			switch (this.$scope.mode) {
				case CalendarMode.Days:
					calendar = new Calendar(moment(start).startOf("month").add(offset, "month"));
					calendar.weeks = this.constructWeeks(calendar.date);
					return calendar;
				case CalendarMode.Months:
					calendar = new Calendar(moment(start).startOf("year").add(offset, "year"));
					calendar.months = this.constructDates(calendar.date, "months");
					return calendar;
				case CalendarMode.Years:
					calendar = new Calendar(moment(start).startOf("year").add(offset * 12, "year"));
					calendar.years = this.constructDates(calendar.date, "years");
					return calendar;
			}
		}
		private constructDates(start: moment.Moment, unitOfTime: string): CalendarDate[] {
			return _.map(_.range(12), (i: number) => {
				return new CalendarDate(moment(start).add(i, unitOfTime));
			});
		};
		private constructWeeks(monthStart: moment.Moment): CalendarWeek[] {
			let weeks: CalendarWeek[] = [];

			let weekStart = moment(monthStart).startOf("week");
			while (weekStart.month() === monthStart.month() || moment(weekStart).endOf("week").month() === monthStart.month()) {
				weeks.push(this.constructWeek(weekStart, monthStart));
				weekStart.add(1, "week");
			}
			return weeks;
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
			return _.chain(this.$scope.calendars)
			.pluck("weeks")
			.flatten()
			.pluck("days")
			.flatten()
			.reject((day: CalendarDay) => {
				return day.empty;
			})
			.value();
		}
		private extractMonths(): CalendarDate[] {
			return _.chain(this.$scope.calendars)
			.pluck("months")
			.flatten()
			.value();
		}
		private extractYears(): CalendarDate[] {
			return _.chain(this.$scope.calendars)
			.pluck("years")
			.flatten()
			.value();
		}
		private changeCurrentDate(offset: number): void {
			switch (this.$scope.mode) {
				case CalendarMode.Days:
					this.currentDate.add(offset, "months");
					break;
				case CalendarMode.Months:
					this.currentDate.add(offset, "years");
					break;
				case CalendarMode.Years:
					this.currentDate.add(offset * 12, "years");
					break;

			}
		}
	}


}
