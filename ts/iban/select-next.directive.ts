module Lui.Directives {
	"use strict";

	export class LuidSelectNext implements ng.IDirective {
		public static IID = "luidSelectNext";
		public restrict = "A";

		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidSelectNext();
			};
			return directive;
		}

		public link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
			element.on("input", (event: JQueryEventObject): void => {
				if (!!(<HTMLInputElement>element[0]).maxLength && ((<HTMLInputElement>element[0]).value.length === (<HTMLInputElement>element[0]).maxLength)) {
					let nextElements = element.next();
					if (nextElements.length) {
						(<HTMLInputElement>nextElements[0]).select();
					}
				}
			});
		}
	}

	angular.module("lui.iban").directive(LuidSelectNext.IID, LuidSelectNext.factory());
}
