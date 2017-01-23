module Lui.Directives {
	"use strict";

	export class LuidIban implements ng.IDirective {
		public static IID = "luidIban";
		public restrict = "AE";
		public templateUrl = "lui/templates/iban/iban.view.html";
		public require = [LuidIban.IID, "^ngModel"];
		public controller: string = LuidIbanController.IID;

		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidIban();
			};
			return directive;
		}

		public link(scope: ILuidIbanScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes & { isRequired: boolean }, ctrls: [LuidIbanController, ng.INgModelController]): void {
			let ibanCtrl = ctrls[0];
			let ngModelCtrl = ctrls[1];
			ibanCtrl.setNgModelCtrl(ngModelCtrl);
			ibanCtrl.setInputs(element);
		}
	}

	angular.module("lui.iban").directive(LuidIban.IID, LuidIban.factory());
}
