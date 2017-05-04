module lui.iban {
	"use strict";

	export interface ILuidIbanScope extends ng.IScope {
		countryCode: string;
		controlKey: string;
		bban: string;

		bbanMappings: { [key: number]: ($event: ng.IAngularEvent) => void; };
		controlKeyMappings: { [key: number]: ($event: ng.IAngularEvent) => void; };

		updateValue(): void;
		pasteIban(event: ClipboardEvent | JQueryEventObject): void;
		selectInput(event: JQueryEventObject): void;
		setTouched(): void;
	}
}
