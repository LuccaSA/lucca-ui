/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface IDaterangePickerScope extends angular.IScope {
		friendly: string;
		hackRefresh: boolean;
		popoverOpened: boolean;
		range: Lui.Period;
		startingDay: number;

		clickOnButton: (event: ng.IAngularEvent) => void;
		clickOnDate: () => void;
		clickOnOk: () => void;
		clickOnPredefined: (predefinedHeader: DaterangePicker.PredefinedPeriod) => void;
	}

}
