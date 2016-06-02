module Lui.Utils {
	"use strict";
	export interface IClickoutsideTriggerScope extends ng.IScope {
		popover: { isOpen: boolean };
	}
	export class ClickoutsideTrigger {
		private elt: angular.IAugmentedJQuery;
		private body: angular.IAugmentedJQuery;
		private $scope: IPopoverScope;
		private onOpen: () => void;
		private onClose: () => void;
		constructor(elt: angular.IAugmentedJQuery, $scope: IClickoutsideTriggerScope, onOpen?: () => void, onClose?: () => void) {
			this.elt = elt;
			this.body = angular.element(document.getElementsByTagName("body")[0]);
			this.$scope = $scope;
			this.onOpen = !!onOpen ? onOpen : () => {};
			this.onClose = !!onClose ? onClose : () => {};
		}
		public togglePopover($event: ng.IAngularEvent): void {
			if (this.$scope.popover.isOpen) {
				this.closePopover();
			} else {
				this.openPopover($event);
			}
		}
		private closePopover(): void {
			this.$scope.popover.isOpen = false;
			this.onClose();
			if (!!this.body) {
				this.body.off("click");
				this.elt.off("click");
			}
		}
		private openPopover($event: ng.IAngularEvent): void {
			this.onOpen();
			this.body.on("click", () => {
				this.closePopover();
				this.$scope.$digest();
			});
			this.elt.on("click", (otherEvent: JQueryEventObject) => {
				otherEvent.stopPropagation();
			});
			$event.stopPropagation();
		}
	}
}
