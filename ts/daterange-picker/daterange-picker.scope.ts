/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface IDaterangePickerScope extends angular.IScope {
		friendly: string;
		hackRefresh: boolean;
		internal: {
			firstleft: moment.Moment & string & Date;
			firstright: moment.Moment & string & Date;
			secondleft: moment.Moment & string & Date;
			secondright: moment.Moment & string & Date;
		};
		popoverOpened: boolean;
		range: {
			startsOn: moment.Moment,
			endsOn: moment.Moment,
		};
		startingDay: number;

		clickOnButton: (event: ng.IAngularEvent) => void;
		clickOnDate: () => void;
		clickOnOk: () => void;
		clickOnPredefined: (predefinedHeader: DaterangePicker.PredefinedPeriod) => void;
		dayClass: (date: Date, mode: string) => string;
	}

}
