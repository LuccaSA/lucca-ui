/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export class LuidDaterangePickerController {
		public static IID: string = "luidDaterangePickerController";
		public static $inject: Array<string> = ["$scope"];

		constructor($scope: IDaterangePickerScope) {

			let useHack = () => {
				$scope.hackRefresh = !($scope.hackRefresh);
			};
			$scope.startingDay = 1; // week starts on monday

			$scope.clickOnButton = (event) => {
				$scope.clickOnOk();
				event.stopPropagation();
			};
			$scope.clickOnOk = () => {
				$scope.popoverOpened = !($scope.popoverOpened);
			};

		}
	}

	angular.module("lui.directives")
		.controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);

}
