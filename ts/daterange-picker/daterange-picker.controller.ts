/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export class LuidDaterangePickerController {
		public static IID: string = "luidDaterangePickerController";
		public static $inject: Array<string> = ["$scope"];

		constructor($scope: IDaterangePickerScope) {

			// Your code here

		}
	}

	angular.module("lui.directives")
		.controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);

}
