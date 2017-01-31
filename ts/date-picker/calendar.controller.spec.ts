module lui.datepicker.test {
	"use strict";
	// most methods are private or protected, i use this to be able to add spies
	interface ICalendarController {
		currentDate: moment.Moment;
		selected: moment.Moment;
		start: moment.Moment;
		end: moment.Moment;
		min: moment.Moment;
		max: moment.Moment;
		setCalendarCnt(cnt?: number): void;
		constructCalendars(): Calendar[];
		constructCalendar(): Calendar;
		assignClasses(): void;
	}
	class TestController extends CalendarController {
		constructor($scope: ICalendarScope, $log: ng.ILogService) {
			super($scope, $log);
		}
		protected selectDate(date: moment.Moment) {
			// 
		};
	}
	describe("calendar controller", () => {
		let createController: () => ICalendarController;
		let ctrl: ICalendarController;
		let $scope: ICalendarScope;

		beforeEach(inject((
			_$rootScope_: ng.IRootScopeService,
			_$log_: ng.ILogService
		) => {
			moment.locale("fr");
			$scope = <ICalendarScope>_$rootScope_.$new();
			createController = () => {
				return <ICalendarController>(<any>new TestController($scope, _$log_));
			};

		}));
		describe("constructMonths", () => {
			beforeEach(() => {
				ctrl = createController();
				ctrl.setCalendarCnt();
				ctrl.currentDate = moment().startOf("month");
			});
			it("should call constructMonth n times", () => {
				spyOn(ctrl, "constructCalendar").and.returnValue({});
				ctrl.constructCalendars();
				expect(ctrl.constructCalendar).toHaveBeenCalled();
				expect((<jasmine.Spy>ctrl.constructCalendar).calls.count()).toBe(1);

				(<jasmine.Spy>ctrl.constructCalendar).calls.reset();
				ctrl.setCalendarCnt(12);
				ctrl.constructCalendars();
				expect(ctrl.constructCalendar).toHaveBeenCalled();
				expect((<jasmine.Spy>ctrl.constructCalendar).calls.count()).toBe(12);
			});
			it("constructing 2 months from now and one month in a month should return the same month (obv)", () => {
				ctrl.setCalendarCnt(2);
				ctrl.currentDate = moment("2016-02-17");
				let m1 = ctrl.constructCalendars();
				ctrl.setCalendarCnt(2);
				ctrl.currentDate = moment("2016-03-27");
				let m2 = ctrl.constructCalendars();
				let march1 = m1[1];
				let march2 = m2[0];
				expect(march1.date.diff(march2.date)).toEqual(0);
				expect(march1.weeks.length).toEqual(march2.weeks.length);
			});
			it("should flag empty days", () => {
				ctrl.currentDate = moment("2016-03-21");
				let march = ctrl.constructCalendars()[0];
				expect(march.weeks.length).toBe(5);
				expect(march.weeks[0].days[0].empty).toBe(true);
				expect(march.weeks[0].days[1].dayNum).toBe(1);
				expect(march.weeks[4].days[4].empty).toBe(true);
			});
		});
		describe("assignClasses", () => {
			beforeEach(() => {
				ctrl = createController();
				ctrl.setCalendarCnt();
				ctrl.currentDate = moment("2016-06-06"); // june 2016
				$scope.calendars = ctrl.constructCalendars();
			});
			it("assign class selected to the selected day", () => {
				ctrl.selected = moment("2016-06-06");
				ctrl.assignClasses();
				let june6 = $scope.calendars[0].weeks[1].days[0];
				expect(june6.selected).toBe(true);
			});
			it("assign class start to the start day, end to end and in-between between", () => {
				ctrl.start = moment("2016-06-06");
				ctrl.end = moment("2016-06-16");
				ctrl.assignClasses();
				let june6 = $scope.calendars[0].weeks[1].days[0];
				let june7 = $scope.calendars[0].weeks[1].days[1];
				let june14 = $scope.calendars[0].weeks[2].days[1];
				let june16 = $scope.calendars[0].weeks[2].days[3];
				expect(june6.start).toBe(true);
				expect(june16.end).toBe(true);
				expect(june7.inBetween).toBe(true);
				expect(june14.inBetween).toBe(true);
			});
			it("assign class disabled before min and after max", () => {
				ctrl.min = moment("2016-06-06");
				ctrl.max = moment("2016-06-16");
				ctrl.assignClasses();
				let june5 = $scope.calendars[0].weeks[0].days[6];
				let june6 = $scope.calendars[0].weeks[1].days[0];
				let june16 = $scope.calendars[0].weeks[2].days[3];
				let june17 = $scope.calendars[0].weeks[2].days[4];
				expect(june5.disabled).toBeTruthy();
				expect(june6.disabled).toBeFalsy();
				expect(june16.disabled).toBeFalsy();
				expect(june17.disabled).toBeTruthy();
			});
			it("assign customClass to every days", () => {
				$scope.customClass = (m) => {
					return m.format("L");
				}
				ctrl.assignClasses();
				let june6 = $scope.calendars[0].weeks[1].days[0];
				let june16 = $scope.calendars[0].weeks[2].days[3];
				expect(june6.customClass).toBe(june6.date.format("L"));
				expect(june16.customClass).toBe(june16.date.format("L"));
			});
		});
		describe("$scope.previousMonth", () => {
			let m = moment();
			beforeEach(() => {
				ctrl = createController();
				ctrl.setCalendarCnt();
				ctrl.currentDate = m;
				spyOn(m, "add");
				spyOn(ctrl, "constructCalendars");
				spyOn(ctrl, "assignClasses");
			});
			it("should call moment.add and constructMonth", () => {
				$scope.previous();
				expect(m.add).toHaveBeenCalledWith(-1, "months");
				expect(ctrl.constructCalendars).toHaveBeenCalled();
				expect(ctrl.assignClasses).toHaveBeenCalled();
			});
		});
		describe("$scope.nextMonth", () => {
			let m = moment();
			beforeEach(() => {
				ctrl = createController();
				ctrl.setCalendarCnt();
				ctrl.currentDate = m;
				spyOn(m, "add");
				spyOn(ctrl, "constructCalendars");
				spyOn(ctrl, "assignClasses");
			});
			it("should call moment.add and constructMonth", () => {
				$scope.next();
				expect(m.add).toHaveBeenCalledWith(1, "months");
				expect(ctrl.constructCalendars).toHaveBeenCalled();
				expect(ctrl.assignClasses).toHaveBeenCalled();
			});
		});
	});
}
