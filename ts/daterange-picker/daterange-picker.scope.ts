/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface IDaterangePickerScope extends angular.IScope {
		friendly: string;
		popoverOpened: boolean;
		range: Lui.Period;

		clickOnInput: (event: ng.IAngularEvent) => void;
	}

}
