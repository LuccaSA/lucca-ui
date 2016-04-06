/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface IDaterangePickerScope extends angular.IScope {
		friendly: string;
		popoverOpened: boolean;
		range: Lui.Period;
		startingDay: number;

		clickOnDate: () => void;
		clickOnButton: (event: ng.IAngularEvent) => void;
		clickOnPredefined: (predefinedHeader: DaterangePicker.PredefinedPeriod) => void;
	}

}
