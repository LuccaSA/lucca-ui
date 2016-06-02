module Lui.Utils {
	"use strict";
	export interface IPopoverController {
		toggle($event?: ng.IAngularEvent): void;
		open($event?: ng.IAngularEvent): void;
		close($event?: ng.IAngularEvent): void;
	}
	export interface IClickoutsideTriggerScope extends ng.IScope {
		popover: { isOpen: boolean };
	}
	export class ClickoutsideTrigger implements IPopoverController {
		private elt: angular.IAugmentedJQuery;
		private body: angular.IAugmentedJQuery;
		private $scope: IClickoutsideTriggerScope;
		private clickedOutside: () => void;
		constructor(elt: angular.IAugmentedJQuery, $scope: IClickoutsideTriggerScope, clickedOutside?: () => void) {
			this.elt = elt;
			this.body = angular.element(document.getElementsByTagName("body")[0]);
			this.$scope = $scope;
			this.clickedOutside = clickedOutside;
		}
		public toggle($event?: ng.IAngularEvent): void {
			if (this.$scope.popover.isOpen) {
				this.close($event);
			} else {
				this.open($event);
			}
		}
		public close($event?: ng.IAngularEvent): void {
			this.$scope.popover.isOpen = false;
			if (!!this.body) {
				this.body.off("click");
				this.elt.off("click");
			}
		}
		public open($event: ng.IAngularEvent): void {
			this.$scope.popover.isOpen = true;
			this.body.on("click", () => {
				this.onClickedOutside();
				this.$scope.$digest();
			});
			this.elt.on("click", (otherEvent: JQueryEventObject) => {
				otherEvent.stopPropagation();
			});
			$event.stopPropagation();
		}
		private onClickedOutside($event?: ng.IAngularEvent): void {
			if (this.clickedOutside) {
				this.clickedOutside();
			} else {
				this.close();
			}
		}
	}
}
