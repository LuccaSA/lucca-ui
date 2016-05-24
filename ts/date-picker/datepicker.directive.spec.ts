/// <reference path="../references.spec.ts" />
module Lui.Directives.Datepicker.Test {
	"use strict";
	beforeEach(angular.mock.module("lui.directives"));
	describe("luid-date-picker controller", () => {
		let createController:() => any;
		let $scope: ng.IScope;
		beforeEach(inject((
			_$controller_: ng.IControllerService,
			_$rootScope_: ng.IRootScopeService
		) => {
			moment.locale("fr");
			$scope = _$rootScope_.$new();
			createController = () => {
				return _$controller_("luidDatePickerController", {
					$scope: $scope,
				});
			};
		}));
		describe("parsing and formatting", () => {
			let ctrl: { parseValue: (v: any) => moment.Moment, formatValue: (v: moment.Moment) => any, setFormat: (f?: string) => void; };
			beforeEach(() => {
				ctrl = createController();
			});
			it("of moments should work", () => {
				ctrl.setFormat("moment");
				let input = moment("2016-05-24");
				let output = moment("2016-05-24");
				expect(ctrl.parseValue(input)).toEqual(output);
				expect(ctrl.formatValue(output)).toEqual(input);
			});
			it("of dates should work", () => {
				ctrl.setFormat("date");
				let input = new Date(2016, 4, 24);
				let output = moment("2016-05-24");
				expect(ctrl.parseValue(input).diff(output)).toEqual(0);
				expect(input.getTime() - (<Date>ctrl.formatValue(output)).getTime()).toEqual(0);
			});
			it("of strings should work", () => {
				ctrl.setFormat("YYYY-MM-DD");
				let input = "2016-05-24";
				let output = moment("2016-05-24");
				expect(ctrl.parseValue(input).diff(output)).toEqual(0);
				expect(ctrl.formatValue(output)).toEqual(input);
				ctrl.setFormat("YYYYMMDD");
				input = "20160524";
				expect(ctrl.parseValue(input).diff(output)).toEqual(0);
				expect(ctrl.formatValue(output)).toEqual(input);
			});
			it("should use format = 'moment' by default", () => {
				ctrl.setFormat();
				let input = moment("2016-05-24");
				let output = moment("2016-05-24");
				expect(ctrl.parseValue(input)).toEqual(output);
				expect(ctrl.formatValue(output)).toEqual(input);
			});
		});
		describe("constructMonths", () => {
			let ctrl: { setMonthsCnt: (n?: number) => void, constructMonths: (selectedDate?: moment.Moment) => any[], constructMonth: (selectedDate?: moment.Moment, offset?: number) => any };
			beforeEach(() => {
				ctrl = createController();
				ctrl.setMonthsCnt();
			});
			it("should call constructMonth n times", () => {
				spyOn(ctrl, "constructMonth").and.returnValue({});
				ctrl.constructMonths(moment());
				expect(ctrl.constructMonth).toHaveBeenCalled();
				expect((<jasmine.Spy>ctrl.constructMonth).calls.count()).toBe(1);

				(<jasmine.Spy>ctrl.constructMonth).calls.reset();
				ctrl.setMonthsCnt(12);
				ctrl.constructMonths(moment());
				expect(ctrl.constructMonth).toHaveBeenCalled();
				expect((<jasmine.Spy>ctrl.constructMonth).calls.count()).toBe(12);
			});
			it("constructing 2 months from now and one month in a month should return the same month (obv)", () => {
				ctrl.setMonthsCnt(2);
				let m1 = ctrl.constructMonths(moment("2016-02-17"));
				ctrl.setMonthsCnt(2);
				let m2 = ctrl.constructMonths(moment("2016-03-27"));
				let march1 = m1[1];
				let march2 = m2[0];
				expect(march1.date.diff(march2.date)).toEqual(0);
				expect(march1.weeks.length).toEqual(march2.weeks.length);
			});
			it("constructing 2 months from now and one month in a month should return the same month (obv)", () => {
				let march = ctrl.constructMonths(moment("2016-03-21"))[0];
				expect(march.weeks.length).toBe(5);
				expect(march.weeks[0].days[0].class).toBe("empty");
				expect(march.weeks[0].days[1].dayNum).toBe(1);
				expect(march.weeks[3].days[0].class).toBe("selected");
				expect(march.weeks[4].days[4].class).toBe("empty");
			});
		});
		describe("changeMonths", () => {
			let ctrl: { setMonthsCnt: (n?: number) => void, changeMonths: (offset: number) => any[], constructMonth: (selectedDate?: moment.Moment, offset?: number) => any, getViewValue: () => moment.Moment };
			beforeEach(() => {
				ctrl = createController();
				ctrl.setMonthsCnt();
				spyOn(ctrl, "constructMonth").and.returnValue({});
				spyOn(ctrl, "getViewValue").and.returnValue(undefined);
			});
			it("should call constructMonth but with a different offset", () => {
				ctrl.changeMonths(2);
				expect(ctrl.constructMonth).toHaveBeenCalledWith(undefined, 2);
				ctrl.changeMonths(-3);
				expect(ctrl.constructMonth).toHaveBeenCalledWith(undefined, -1);
			});
		});
		describe("$scope.selectDay", () => {

		});
		describe("$scope.nextMonth", () => {

		});
		describe("$scope.previousMonth", () => {

		});
	});
	describe("luid-date-picker directive", () => {

	});
}
