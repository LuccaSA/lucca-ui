module Lui.Directives {
	"use strict";
	class LuidDatePicker implements angular.IDirective {
		public static IID: string = "luidDatePicker";
		public restrict = "E";
		public templateUrl = "lui/templates/date-picker/datepicker-inline.html";
		public require = ["ngModel","luidDatePicker"];
		public scope = {
			format: "@",
		};
		public controller: string = LuidDatePickerController.IID;

		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidDatePicker();
			};
			return directive;
		}

		public link(scope: ng.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			
			ngModelCtrl.$render = () => {
				// // scope.timesheets = <Timmi.Domain.Timesheet[]>ngModelCtrl.$viewValue;
				// scope.approvables = _.sortBy(_.where(<Timmi.Domain.Timesheet[]>ngModelCtrl.$viewValue, { status: Timmi.Domain.TimesheetStatus.submitted }), (timesheet: Timmi.Domain.Timesheet) => {
				// 	return timesheet.owner.lastName;
				// });
				// scope.remindables = _.sortBy(_.where(<Timmi.Domain.Timesheet[]>ngModelCtrl.$viewValue, { status: Timmi.Domain.TimesheetStatus.temporary }), (timesheet: Timmi.Domain.Timesheet) => {
				// 	return timesheet.owner.lastName;
				// });
			};
			// scope.$watchCollection(() => { return ngModelCtrl.$viewValue; }, (newTimeshseets: Timmi.Domain.Timesheet[]): void => {
			// 	ngModelCtrl.$render();
			// });
		}
	}
	angular.module("lui.directives").directive(LuidDatePicker.IID, LuidDatePicker.factory());
}
