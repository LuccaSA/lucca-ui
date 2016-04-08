/// <reference path="../references.spec.ts" />

module Lui.Directives.DaterangePicker.Test {
	"use strict";

	beforeEach(angular.mock.module("lui.directives"));

	describe("luidDaterangePickerController", () => {
		let createController: () => any;
		let $rootScope: ng.IRootScopeService;
		let $scope: Lui.Directives.IDaterangePickerScope;
		let moment: moment.MomentStatic;
		let ctrl: Lui.Directives.LuidDaterangePickerController;

		beforeEach(inject((
			_$controller_: ng.IControllerService,
			_$rootScope_: ng.IRootScopeService,
			_moment_: moment.MomentStatic
		) => {
			$scope = <Lui.Directives.IDaterangePickerScope>_$rootScope_.$new();
			$rootScope = _$rootScope_;
			moment = _moment_;
			createController = () => {
				return _$controller_("luidDaterangePickerController", {
					$scope: $scope,
					moment: moment,
				});
			};
		}));

		describe("$scope.dayClass", () => {
			beforeEach(() => {
				ctrl = createController();
				$scope.range = {
					startsOn: moment("2016-01-01"),
					endsOn: moment("2016-04-01"),
				};
			});
			it("should work", () => {
				expect($scope.dayClass(new Date("2015-04-06"), "day")).toBe("");
				expect($scope.dayClass(new Date("2016-01-01"), "day")).toBe("start");
				expect($scope.dayClass(new Date("2016-04-01"), "day")).toBe("end");
				expect($scope.dayClass(new Date("2016-02-15"), "day")).toBe("in-between");
			});
		});

		describe("$scope.startingDay", () => {
			describe("with english locale", () => {
				beforeEach(() => {
					moment.locale("en");
					ctrl = createController();
				});
				it("should be sunday", () => {
					expect($scope.startingDay).toBe(0);
				});
			});
			describe("with french locale", () => {
				beforeEach(() => {
					moment.locale("fr");
					ctrl = createController();
				});
				it("should be monday", () => {
					expect($scope.startingDay).toBe(1);
				});
			});
		});
	});
}
