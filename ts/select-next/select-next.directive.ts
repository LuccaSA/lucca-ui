module Lui.Directives.Iban {
	"use strict";

	export class SelectNext implements ng.IDirective {
		public static IID = "selectNext";
		public restrict = "A";

		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new SelectNext();
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

	angular.module("lui.directives").directive(SelectNext.IID, SelectNext.factory());
}
