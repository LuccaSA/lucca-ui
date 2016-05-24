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
			})
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
	});
	describe("luid-date-picker directive", () => {

	});
}
