module lui.popover {
	"use strict";
	let MAGIC_TIMEOUT_DELAY = 100;
	// we dont want to register body.onclick right away cuz then we'd have to stop ethe event propagation,
	// but we want to close other open popovers so we have to not stop the propagation
	// and for some reason a timeout delay of 1 is not enough
	// lbertin - 04-10-2016
	export interface IPopoverController {
		toggle($event?: ng.IAngularEvent): void;
		open($event?: ng.IAngularEvent): void;
		close($event?: ng.IAngularEvent): void;
	}
	export interface IClickoutsideTriggerScope extends ng.IScope {
		popover: { isOpen: boolean };
	}
	export class ClickoutsideTrigger implements IPopoverController {
		public open: ($event?: ng.IAngularEvent) => void;
		public close: ($event?: ng.IAngularEvent) => void;
		private elt: angular.IAugmentedJQuery;
		private body: angular.IAugmentedJQuery;
		private $scope: IClickoutsideTriggerScope;
		private clickedOutside: () => void;
		constructor(elt: angular.IAugmentedJQuery, $scope: IClickoutsideTriggerScope, clickedOutside?: () => void) {
			this.elt = elt;
			this.body = angular.element(document.getElementsByTagName("body")[0]);
			this.$scope = $scope;
			this.clickedOutside = clickedOutside;
			let that = this;
			function onClickedOutside($event?: ng.IAngularEvent): void {
				if (!!that.clickedOutside) {
					that.clickedOutside();
				} else {
					that.close();
				}
			}
			function onBodyClicked(): void {
				onClickedOutside();
				that.$scope.$digest();
			}
			function onEltClicked(otherEvent: JQueryEventObject): void {
				otherEvent.stopPropagation();
			}
			this.open = ($event: ng.IAngularEvent) => {
				this.$scope.popover.isOpen = true;
				setTimeout( () => {
					this.body.on("click", onBodyClicked);
					this.elt.on("click", onEltClicked);
				}, MAGIC_TIMEOUT_DELAY);
			};
			this.close = ($event?: ng.IAngularEvent) => {
				this.$scope.popover.isOpen = false;
				if (!!this.body) {
					this.body.off("click", onBodyClicked);
					this.elt.off("click", onEltClicked);
				}
			};
		}
		public toggle($event?: ng.IAngularEvent): void {
			if (this.$scope.popover.isOpen) {
				this.close($event);
			} else {
				this.open($event);
			}
		}
	}
}
