module lui.datepicker.test {
	"use strict";
	beforeEach(angular.mock.module("lui"));
	describe("luid-date-picker controller", () => {
		let createController:() => any;
		let $scope: any;
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

		// describe("$scope.selectDay", () => {
		// 	let ctrl: { constructMonths: (selectedDate?: moment.Moment) => any[], setMonthsCnt: (n?: number) => void, setViewValue: (v: any) => void, formatValue: (m: moment.Moment) => any };
		// 	let day: { date: moment.Moment, selected: boolean, empty: boolean, disabled: boolean };
		// 	beforeEach(() => {
		// 		ctrl = createController();
		// 		spyOn(ctrl, "setViewValue");
		// 		spyOn(ctrl, "formatValue").and.returnValue({});
		// 		ctrl.setMonthsCnt();
		// 		$scope.months = ctrl.constructMonths(moment("2016-05-24"));
		// 		day = { date: moment("2016-05-01"), selected: false, empty: false, disabled: false };
		// 	});
		// 	it("should call setViewValue with the formatted value", () => {
		// 		$scope.selectDay(day);
		// 		expect(ctrl.formatValue).toHaveBeenCalledWith(day.date);
		// 		expect(ctrl.setViewValue).toHaveBeenCalled();
		// 	});
		// 	it("should remove the class selected from the day previously selected", () => {
		// 		let may24 = $scope.months[0].weeks[4].days[1];
		// 		expect(may24.selected).toBe(true);
		// 		$scope.selectDay(day);
		// 		expect(may24.selected).toBe(false);
		// 		expect(day.selected).toBe(true);
		// 	});
		// });
	});
	describe("luid-date-picker directive", () => {

	});
}
