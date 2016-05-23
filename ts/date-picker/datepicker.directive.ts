module Lui.Directives {
	"use strict";
	class LuidDatePicker implements angular.IDirective {
		public static IID: string = "luidDatePicker";
		public restrict = "E";
		public templateUrl = "lui/templates/date-picker/datepicker-inline.html";
		public require = ["ngModel", "luidDatePicker"];
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

		public link(scope: IDatePickerScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			let datePickerCtrl = <LuidDatePickerController>ctrls[1];
			datePickerCtrl.setNgModelCtrl(ngModelCtrl);
			datePickerCtrl.setFormat(scope.format);
		}
	}
	class LuidDatePickerPopup implements angular.IDirective {
		public static IID: string = "luidDatePickerPopup";
		public restrict = "E";
		public templateUrl = "lui/templates/date-picker/datepicker-popup.html";
		public require = ["ngModel", "luidDatePickerPopup"];
		public scope = {
			format: "@",
		};
		public controller: string = LuidDatePickerController.IID;

		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidDatePickerPopup();
			};
			return directive;
		}

		public link(scope: IDatePickerScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			let datePickerCtrl = <LuidDatePickerController>ctrls[1];
			datePickerCtrl.setNgModelCtrl(ngModelCtrl);
			datePickerCtrl.setFormat(scope.format);
		}
	}

	class Month {
		public date: moment.Moment;
		public weeks: Week[];
	}
	class Week {
		public days: Day[];
	}
	class Day {
		public date: moment.Moment;
		public dayNum: number;
		public class: string;
		constructor(date: moment.Moment) {
			this.date = date;
			this.dayNum = date.date();
		}
	}
	interface IDatePickerScope extends ng.IScope {
		format: string;

		dayLabels: string[];
		month: Month;

		selectDay: (day: Day) => void;

		popover: {
			isOpen: boolean;
		};
		togglePopover: () => void;
	}

	class LuidDatePickerController {
		public static IID: string = "luidDatePickerController";
		public static $inject: Array<string> = ["$scope"];
		private ngModelCtrl: ng.INgModelController;
		private $scope: IDatePickerScope;
		private format: string;

		constructor($scope: IDatePickerScope) {
			this.$scope = $scope;
			this.initDayLabels($scope);
			$scope.selectDay = (day: Day) => {
				// unselect previously selected day
				let allDays: Day[] = _.chain($scope.month.weeks)
					.pluck("days")
					.flatten()
					.value();
				(_.findWhere(allDays, { class: "selected" }) || { class: "" }).class = "";
				day.class = "selected";

				this.setViewValue(this.formatValue(day.date));
			}
			$scope.popover = { isOpen: false };
			$scope.togglePopover = () => {
				this.togglePopover();
			};
		}
		private initDayLabels($scope: IDatePickerScope): void {
			$scope.dayLabels = _.map(_.range(7), (i: number): string => {
				return moment().startOf("week").add(i, "days").format("dd");
			});
		}
		public parseValue(value: any): moment.Moment {
			switch (this.format) {
				case "moment": return this.parseMoment(value);
				case "date": return this.parseDate(value);
				default: return this.parseString(value);
			}
		}
		public formatValue(value: moment.Moment): any {
			switch (this.format) {
				case "moment": return this.formatMoment(value);
				case "date": return this.formatDate(value);
				default: return this.formatString(value);
			}
		}
		private parseMoment(value: moment.Moment): moment.Moment {
			return !!value ? moment(value) : undefined;
		}
		private parseDate(value: Date): moment.Moment {
			return !!value ? moment(value) : undefined;
		}
		private parseString(value: string): moment.Moment {
			return !!value && moment(value, this.format).isValid() ? moment(value, this.format) : undefined;
		}
		private formatMoment(value: moment.Moment): moment.Moment {
			return moment(value);
		}
		private formatDate(value: moment.Moment): Date {
			return value.toDate();
		}
		private formatString(value: moment.Moment): string {
			return value.format(this.format);
		}
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				this.$scope.month = this.constructMonth(this.parseValue(ngModelCtrl.$viewValue));
			};
		}
		public setFormat(format: string): void {
			this.format = format || "moment";
		}
		private setViewValue(value): void {
			this.ngModelCtrl.$setViewValue(value);
		}
		public constructMonth(selectedDate: moment.Moment): Month {
			let month: Month = { date: moment(selectedDate).startOf("month"), weeks: [] };
			let weekStart = moment(month.date).startOf("week");
			while (weekStart.month() === month.date.month() || moment(weekStart).endOf("week").month() === month.date.month()) {
				month.weeks.push(this.constructWeek(weekStart, month.date, selectedDate))
				weekStart.add(1, "week");
			}
			return month;
		}
		private constructWeek(weekStart: moment.Moment, monthStart: moment.Moment, selectedDate: moment.Moment): Week {
			let week: Week = { days: [] };
			week.days = _.map(_.range(7), (i: number) => {
				let day: Day = new Day(moment(weekStart).add(i, "days"));
				if (day.date.month() !== monthStart.month()) {
					day.class = "empty";
				}
				if (!!selectedDate && day.date.format("YYYYMMDD") === moment(selectedDate).format("YYYYMMDD")) {
					day.class = "selected";
				}
				return day;
			});
			return week;
		}
		private togglePopover(): void {
			if (this.$scope.popover.isOpen) {
				this.$scope.popover.isOpen = false;
				// debind click inside and click outside
			} else {
				this.$scope.popover.isOpen = true;

			}
		}
	}

	angular.module("lui.directives").controller(LuidDatePickerController.IID, LuidDatePickerController);
	angular.module("lui.directives").directive(LuidDatePicker.IID, LuidDatePicker.factory());
	angular.module("lui.directives").directive(LuidDatePickerPopup.IID, LuidDatePickerPopup.factory());
}
