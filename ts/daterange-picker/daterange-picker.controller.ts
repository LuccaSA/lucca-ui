/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export class LuidDaterangePickerController {
		public static IID: string = "luidDaterangePickerController";
		public static $inject: Array<string> = ["$scope"];

		constructor($scope: IDaterangePickerScope) {

			$scope.startingDay = 1; // week starts on monday

			$scope.clickOnButton = (event) => {
				$scope.popoverOpened = !($scope.popoverOpened);
				event.stopPropagation();
			};

		}
	}

	angular.module("lui.directives")
		.controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);

}
