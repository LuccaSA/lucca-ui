import * as moment from 'moment';
import * as _ from 'underscore';
import { OnInit } from '@angular/core';
import { ICalendarConfiguration, CalendarMode, Calendar, CalendarDay, CalendarDate, CalendarWeek } from './calendar.class';
import { LuiLogService } from '../../utils/log.service';


export abstract class CalendarBaseComponent implements OnInit {
	protected calendarCnt: number;
	protected currentDate: moment.Moment;
	protected selected: moment.Moment;
	protected start: moment.Moment;
	protected end: moment.Moment;
	protected min: moment.Moment;
	protected max: moment.Moment;
	protected minMode: CalendarMode = CalendarMode.Days;
	constructor(
		public config: ICalendarConfiguration,
		private $log: LuiLogService // TODO: interface
	) {
		this.initCalendarUiMethods(config);
		this.setMinMode(config.minMode);
		this.config.mode = this.minMode;
		config.direction = 'init';
	}
	public ngOnInit() {
	}
	public setCalendarCnt(cntStr?: string, inAPopover?: boolean): void {
		this.calendarCnt = parseInt(cntStr, 10) || 1;
		if (inAPopover && this.calendarCnt > 2) {
			this.calendarCnt = 2;
			this.$log.warn('no more than 2 months displayed in a date-picker popover');
		}
	}
	protected constructCalendars(): Calendar[] {
		return _.map(_.range(this.calendarCnt), (offset: number): Calendar => {
			return this.constructCalendar(this.currentDate, offset);
		});
	}
	protected constructDayLabels(): string[] {
		return _.map(_.range(7), (i: number): string => {
			return moment().startOf('week').add(i, 'days').format('dd');
		});
	}
	protected assignClasses(): void {
		switch (this.config.mode) {
			case CalendarMode.Days:
				return this.assignDayClasses();
			case CalendarMode.Months:
				return this.assignMonthClasses();
			case CalendarMode.Years:
				return this.assignYearClasses();
			default: break;
		}
	}
	protected abstract selectDate(date: moment.Moment): void;
	private setMinMode(mode: string): void {
		switch ((mode || '').toLowerCase()) {
			case '0':
			case 'd':
			case 'day':
			case 'days':
				this.minMode = CalendarMode.Days;
				break;
			case '1':
			case 'm':
			case 'month':
			case 'months':
				this.minMode = CalendarMode.Months;
				break;
			case '2':
			case 'y':
			case 'year':
			case 'years':
				this.minMode = CalendarMode.Years;
				break;
			default:
				this.minMode = CalendarMode.Days;
				break;
		}
	}
	private assignDayClasses(): void {
		let days = this.extractDays();
		_.each(days, (day: CalendarDay): void => {
			day.selected = false;
			day.start = false;
			day.end = false;
			day.inBetween = false;
			if (!!this.selected && day.date.format('YYYYMMDD') === moment(this.selected).format('YYYYMMDD')) {
				day.selected = true;
			}
			if (!!this.start && day.date.format('YYYYMMDD') === moment(this.start).format('YYYYMMDD')) {
				day.start = true;
			}
			if (!!this.end && day.date.format('YYYYMMDD') === moment(this.end).format('YYYYMMDD')) {
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
			if (!!this.config.customClass) {
				day.customClass = this.config.customClass(day.date, CalendarMode.Days);
			}
		});
	}
	private assignMonthClasses(): void {
		let months = this.extractMonths();
		_.each(months, (month: CalendarDate): void => {
			month.selected = false;
			month.start = false;
			month.end = false;
			month.inBetween = false;
			if (!!this.selected && month.date.format('YYYYMM') === moment(this.selected).format('YYYYMM')) {
				month.selected = true;
			}
			if (!!this.start && month.date.format('YYYYMM') === moment(this.start).format('YYYYMM')) {
				month.start = true;
			}
			if (!!this.end && month.date.format('YYYYMM') === moment(this.end).format('YYYYMM')) {
				month.end = true;
			}
			if (!!this.start && !!this.end && !month.start && !month.end
				&& month.date.isSameOrAfter(this.start) && month.date.isSameOrBefore(this.end)) {
				month.inBetween = true;
			}
			if (!!this.min && this.min.diff(moment(month.date).endOf('month')) > 0) {
				month.disabled = true;
			}
			if (!!this.max && this.max.diff(month.date) < 0) {
				month.disabled = true;
			}
			if (!!this.config.customClass) {
				month.customClass = this.config.customClass(month.date, CalendarMode.Months);
			}
		});
	}
	private assignYearClasses(): void {
		let years = this.extractYears();
		_.each(years, (year: CalendarDate): void => {
			year.selected = false;
			year.start = false;
			year.end = false;
			year.inBetween = false;
			if (!!this.selected && year.date.format('YYYY') === moment(this.selected).format('YYYY')) {
				year.selected = true;
			}
			if (!!this.start && year.date.format('YYYY') === moment(this.start).format('YYYY')) {
				year.start = true;
			}
			if (!!this.end && year.date.format('YYYY') === moment(this.end).format('YYYY')) {
				year.end = true;
			}
			if (!!this.start && !!this.end && !year.start && !year.end
				&& year.date.isSameOrAfter(this.start) && year.date.isSameOrBefore(this.end)) {
				year.inBetween = true;
			}
			if (!!this.min && this.min.diff(moment(year.date).endOf('year')) > 0) {
				year.disabled = true;
			}
			if (!!this.max && this.max.diff(year.date) < 0) {
				year.disabled = true;
			}
			if (!!this.config.customClass) {
				year.customClass = this.config.customClass(year.date, CalendarMode.Years);
			}
		});
	}

	private initCalendarUiMethods(config: ICalendarConfiguration): void {
		config.dayLabels = this.constructDayLabels();
		config.next = () => {
			this.changeCurrentDate(1);
			config.calendars = this.constructCalendars();
			config.direction = 'next';
			this.assignClasses();
		};
		config.previous = () => {
			this.changeCurrentDate(-1);
			config.calendars = this.constructCalendars();
			config.direction = 'previous';
			this.assignClasses();
		};
		config.switchToMonthMode = () => {
			config.mode = CalendarMode.Months;
			config.direction = 'mode-change out';
			this.currentDate.startOf('year');
			config.calendars = this.constructCalendars();
			this.assignClasses();
		};
		config.switchToYearMode = () => {
			config.mode = CalendarMode.Years;
			config.direction = 'mode-change out';
			config.calendars = this.constructCalendars();
			this.assignClasses();
		};
		config.selectDay = (day: CalendarDate) => {
			this.selectDate(day.date);
		};
		config.selectMonth = (month: CalendarDate) => {
			if (this.minMode === CalendarMode.Months) {
				this.selectDate(month.date);
			} else {
				this.currentDate = month.date;
				config.mode = CalendarMode.Days;
				config.direction = 'mode-change in';
				config.calendars = this.constructCalendars();
				this.assignClasses();
			}
		};
		config.selectYear = (year: CalendarDate) => {
			if (this.minMode === CalendarMode.Years) {
				this.selectDate(year.date);
			} else {
				this.currentDate = year.date;
				config.mode = CalendarMode.Months;
				config.direction = 'mode-change in';
				config.calendars = this.constructCalendars();
				this.assignClasses();
			}
		};
	}
	private constructCalendar(start: moment.Moment, offset: number): Calendar {
		let calendar: Calendar;
		console.log(this.config.mode);
		switch (this.config.mode) {
			case CalendarMode.Days:
				calendar = new Calendar(moment(start).startOf('month').add(offset, 'month'));
				calendar.weeks = this.constructWeeks(calendar.date);
				return calendar;
			case CalendarMode.Months:
				calendar = new Calendar(moment(start).startOf('year').add(offset, 'year'));
				calendar.months = this.constructDates(calendar.date, 'months');
				return calendar;
			case CalendarMode.Years:
				calendar = new Calendar(moment(start).startOf('year').add(offset * 12, 'year'));
				calendar.years = this.constructDates(calendar.date, 'years');
				return calendar;
			default: break;
		}
	}
	private constructDates(start: moment.Moment, unitOfTime: string): CalendarDate[] {
		return _.map(_.range(12), (i: number) => {
			return new CalendarDate(moment(start).add(<any>i, unitOfTime));
		});
	};
	private constructWeeks(monthStart: moment.Moment): CalendarWeek[] {
		let weeks: CalendarWeek[] = [];

		let weekStart = moment(monthStart).startOf('week');
		while (weekStart.month() === monthStart.month() || moment(weekStart).endOf('week').month() === monthStart.month()) {
			weeks.push(this.constructWeek(weekStart, monthStart));
			weekStart.add(1, 'week');
		}
		return weeks;
	}
	private constructWeek(weekStart: moment.Moment, monthStart: moment.Moment): CalendarWeek {
		let week: CalendarWeek = { days: [] };
		week.days = _.map(_.range(7), (i: number) => {
			let day: CalendarDay = new CalendarDay(moment(weekStart).add(i, 'days'));
			if (day.date.month() !== monthStart.month()) {
				day.empty = true;
			}
			return day;
		});
		return week;
	}
	private extractDays(): CalendarDay[] {
		return _.chain(this.config.calendars)
		.pluck('weeks')
		.flatten()
		.pluck('days')
		.flatten()
		.reject((day: CalendarDay) => {
			return day.empty;
		})
		.value();
	}
	private extractMonths(): CalendarDate[] {
		return _.chain(this.config.calendars)
		.pluck('months')
		.flatten()
		.value();
	}
	private extractYears(): CalendarDate[] {
		return _.chain(this.config.calendars)
		.pluck('years')
		.flatten()
		.value();
	}
	private changeCurrentDate(offset: number): void {
		switch (this.config.mode) {
			case CalendarMode.Days:
				this.currentDate.add(offset, 'months');
				break;
			case CalendarMode.Months:
				this.currentDate.add(offset, 'years');
				break;
			case CalendarMode.Years:
				this.currentDate.add(offset * 12, 'years');
				break;
			default: break;
		}
	}
}

