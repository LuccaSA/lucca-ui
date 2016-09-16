module Lui.Directives {
	"use strict";

	export interface ILuidIbanScope extends ng.IScope {
		countryCode: string;
		controlKey: string;
		bban: string;
		countryCodePattern: string;
		controlKeyPattern: string;
		bbanPattern: string;

		updateValue: () => void;
		pasteIban: (event: ClipboardEvent) => void;
		selectInput: (event: JQueryEventObject) => void;
	}
}
