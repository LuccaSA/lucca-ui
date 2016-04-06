/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export class LuidDaterangePickerController {
		public static IID: string = "luidDaterangePickerController";
		public static $inject: Array<string> = ["$scope", "moment"];

		constructor($scope: IDaterangePickerScope, moment: moment.MomentStatic) {

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

			$scope.dayClass = (date, mode) => {
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				let result = "";
				if (mode === "day") {
					if (moment(date).diff($scope.range.startsOn) === 0) { result += "start"; }
					if (moment(date).diff($scope.range.endsOn) === 0) { result += "end"; }
					if (moment(date).isAfter($scope.range.startsOn) && moment(date).isBefore($scope.range.endsOn)) { result += "in-between"; }
				}
				return result;
			};
		}
	}

	angular.module("lui.directives")
		.controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);

}
