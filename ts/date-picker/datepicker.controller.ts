module Lui.Directives {
	"use strict";

	export class LuidDatePickerController {
		public static IID: string = "luidDatePickerController";
		public static $inject: Array<string> = [];

		constructor() {
		}

	}

	angular.module("lui.directives").controller(LuidDatePickerController.IID, LuidDatePickerController);
}
