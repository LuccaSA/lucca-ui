module Lui.Directives {
	"use strict";
	export class CalendarDate {
		public date: moment.Moment;
		public disabled: boolean;
		public selected: boolean;
		public start: boolean;
		public end: boolean;
		public inBetween: boolean;
		public customClass: string;
		constructor(date: moment.Moment) {
			this.date = moment(date);
		}
	}
	export class Calendar {
		public date: moment.Moment;
		public currentYear: boolean;
		public weeks: CalendarWeek[];
		public months: CalendarDate[];
		public years: CalendarDate[];
		constructor(date: moment.Moment) {
			this.date = moment(date)
			this.weeks = [];
			this.months = [];
			this.years = [];
			this.currentYear = this.date.year() === moment().year();
		}
	}
	export class CalendarWeek {
		public days: CalendarDate[];
	}
	export class CalendarDay extends CalendarDate {
		public dayNum: number;
		public empty: boolean;
		constructor(date: moment.Moment) {
			super(date);
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
		customClass: (date: moment.Moment, mode?: CalendarMode) => string;
		displayedMonths: string;

		min: any;
		max: any;

		mode: CalendarMode;

		dayLabels: string[];
		calendars: Calendar[];
		direction: string;

		selectDay(day: CalendarDate): void;
		selectMonth(day: CalendarDate): void;
		selectYear(day: CalendarDate): void;
		selectShortcut(shortcut: Shortcut): void;
		previous(): void;
		next(): void;
		// switchMode(zoomIn: boolean): void;
		switchToMonthMode(): void;
		switchToYearMode(): void;

		onMouseEnter(day: CalendarDay, $event?: ng.IAngularEvent): void;
		onMouseLeave(day: CalendarDay, $event?: ng.IAngularEvent): void;
	}
	export interface ICalendarValidators extends ng.IModelValidators {
		min: (modelValue: any, viewValue: any) => boolean;
		max: (modelValue: any, viewValue: any) => boolean;
	}
}
