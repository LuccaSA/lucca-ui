import * as moment from 'moment'
import { Calendar, ICalendarUiConfig, CalendarMode } from './calendar.class'
import { CalendarBaseComponent } from './calendar-base.component'

// most methods are private or protected, i use this to be able to add spies
interface ICalendarBaseComponent {
	calendars: Calendar[];
	currentDate: moment.Moment;
	setCalendarCnt(cnt?: number): void;
	constructCalendars(): Calendar[];
	constructCalendar(): Calendar;
	assignClasses(): void;
	selected: moment.Moment;
	start: moment.Moment;
	end: moment.Moment;
	min: moment.Moment;
	max: moment.Moment;
	uiConfig: ICalendarUiConfig;
}
class TestComponent extends CalendarBaseComponent {
	public selectDate(): void {
		//
	}
}

describe('calendar controller', () => {
	let createController: () => ICalendarBaseComponent;
	let baseCmpnt: ICalendarBaseComponent;

	moment.locale('fr');

	describe('constructMonths', () => {
		beforeEach(() => {
			baseCmpnt = <ICalendarBaseComponent>(<any>new TestComponent());
			baseCmpnt.setCalendarCnt();
			baseCmpnt.currentDate = moment().startOf('month');
		});
		it('should call constructMonth n times', () => {
			spyOn(baseCmpnt, 'constructCalendar').and.returnValue({});
			baseCmpnt.constructCalendars();
			expect(baseCmpnt.constructCalendar).toHaveBeenCalled();
			expect((<jasmine.Spy>baseCmpnt.constructCalendar).calls.count()).toBe(1);

			(<jasmine.Spy>baseCmpnt.constructCalendar).calls.reset();
			baseCmpnt.setCalendarCnt(12);
			baseCmpnt.constructCalendars();
			expect(baseCmpnt.constructCalendar).toHaveBeenCalled();
			expect((<jasmine.Spy>baseCmpnt.constructCalendar).calls.count()).toBe(12);
		});
		it('constructing 2 months from now and one month in a month should return the same month (obv)', () => {
			baseCmpnt.setCalendarCnt(2);
			baseCmpnt.currentDate = moment('2016-02-17');
			let m1 = baseCmpnt.constructCalendars();
			baseCmpnt.setCalendarCnt(2);
			baseCmpnt.currentDate = moment('2016-03-27');
			let m2 = baseCmpnt.constructCalendars();
			let march1 = m1[1];
			let march2 = m2[0];
			expect(march1.date.diff(march2.date)).toEqual(0);
			expect(march1.weeks.length).toEqual(march2.weeks.length);
		});
		it('should flag empty days', () => {
			baseCmpnt.currentDate = moment('2016-03-21');
			let march = baseCmpnt.constructCalendars()[0];
			expect(march.weeks.length).toBe(5);
			expect(march.weeks[0].days[0].empty).toBe(true);
			expect(march.weeks[0].days[1].dayNum).toBe(1);
			expect(march.weeks[4].days[4].empty).toBe(true);
		});
	});
	describe('assignClasses', () => {
		beforeEach(() => {
			baseCmpnt.setCalendarCnt();
			baseCmpnt.currentDate = moment('2016-06-06'); // june 2016
			baseCmpnt.calendars = baseCmpnt.constructCalendars();
		});
		it('assign class selected to the selected day', () => {
			baseCmpnt.selected = moment('2016-06-06');
			baseCmpnt.assignClasses();
			let june6 = baseCmpnt.calendars[0].weeks[1].days[0];
			expect(june6.selected).toBe(true);
		});
		it('assign class start to the start day, end to end and in-between between', () => {
			baseCmpnt.start = moment('2016-06-06');
			baseCmpnt.end = moment('2016-06-16');
			baseCmpnt.assignClasses();
			let june6 = baseCmpnt.calendars[0].weeks[1].days[0];
			let june7 = baseCmpnt.calendars[0].weeks[1].days[1];
			let june14 = baseCmpnt.calendars[0].weeks[2].days[1];
			let june16 = baseCmpnt.calendars[0].weeks[2].days[3];
			expect(june6.start).toBe(true);
			expect(june16.end).toBe(true);
			expect(june7.inBetween).toBe(true);
			expect(june14.inBetween).toBe(true);
		});
		it('assign class disabled before min and after max', () => {
			baseCmpnt.min = moment('2016-06-06');
			baseCmpnt.max = moment('2016-06-16');
			baseCmpnt.assignClasses();
			let june5 = baseCmpnt.calendars[0].weeks[0].days[6];
			let june6 = baseCmpnt.calendars[0].weeks[1].days[0];
			let june16 = baseCmpnt.calendars[0].weeks[2].days[3];
			let june17 = baseCmpnt.calendars[0].weeks[2].days[4];
			expect(june5.disabled).toBeTruthy();
			expect(june6.disabled).toBeFalsy();
			expect(june16.disabled).toBeFalsy();
			expect(june17.disabled).toBeTruthy();
		});
		it('assign customClass to every days', () => {
			baseCmpnt.uiConfig.customClass = (m) => {
				return m.format('L');
			}
			baseCmpnt.assignClasses();
			let june6 = baseCmpnt.calendars[0].weeks[1].days[0];
			let june16 = baseCmpnt.calendars[0].weeks[2].days[3];
			expect(june6.customClass).toBe(june6.date.format('L'));
			expect(june16.customClass).toBe(june16.date.format('L'));
		});
	});
	describe('config.previousMonth', () => {
		let m = moment();
		beforeEach(() => {
			baseCmpnt.setCalendarCnt();
			baseCmpnt.currentDate = m;
			spyOn(m, 'add');
			spyOn(baseCmpnt, 'constructCalendars');
			spyOn(baseCmpnt, 'assignClasses');
		});
		it('should call moment.add and constructMonth', () => {
			baseCmpnt.uiConfig.previous();
			expect(m.add).toHaveBeenCalledWith(-1, 'months');
			expect(baseCmpnt.constructCalendars).toHaveBeenCalled();
			expect(baseCmpnt.assignClasses).toHaveBeenCalled();
		});
	});
	describe('config.nextMonth', () => {
		let m = moment();
		beforeEach(() => {
			baseCmpnt.setCalendarCnt();
			baseCmpnt.currentDate = m;
			spyOn(m, 'add');
			spyOn(baseCmpnt, 'constructCalendars');
			spyOn(baseCmpnt, 'assignClasses');
		});
		it('should call moment.add and constructMonth', () => {
			baseCmpnt.uiConfig.next();
			expect(m.add).toHaveBeenCalledWith(1, 'months');
			expect(baseCmpnt.constructCalendars).toHaveBeenCalled();
			expect(baseCmpnt.assignClasses).toHaveBeenCalled();
		});
	});
});
