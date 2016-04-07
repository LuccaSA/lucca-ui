/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export class LuidDaterangePickerController {
		public static IID: string = "luidDaterangePickerController";
		public static $inject: Array<string> = ["$scope", "moment", "$document"];

		constructor($scope: IDaterangePickerScope, moment: moment.MomentStatic, $document: angular.IDocumentService) {

			let useHack = () => {
				$scope.hackRefresh = !($scope.hackRefresh);
			};
			$scope.startingDay = 1; // week starts on monday

			/////////////
			// POPOVER //
			/////////////
			let togglePopover = (): void => {
				$scope.isPopoverOpened = !($scope.isPopoverOpened);
				if ($scope.isPopoverOpened) {
					/* tslint:disable */
					// Disable tslint because of loop
					pinPopover();
					/* tslint:enable */
				} else {
					/* tslint:disable */
					// Disable tslint because of loop
					unpinPopover();
					/* tslint:enable */
				}
			};

			let closePopover = (): void => {
				togglePopover();
				$scope.$apply();
			};

			let pinPopover = (): void => {
				$document.on("click", closePopover);
			};

			let unpinPopover = (): void => {
				$document.off("click", closePopover);
			};

			$scope.clickOnButton = (event: ng.IAngularEvent) => {
				togglePopover();
				event.stopPropagation();
			};
			$scope.clickOnOk = () => {
				togglePopover();
			};

			$scope.dayClass = (date: Date, mode: string) => {
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

	angular.module("lui.directives").controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);
}
