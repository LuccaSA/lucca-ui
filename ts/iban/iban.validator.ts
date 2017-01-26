module lui.iban {
	"use strict";

	export interface ILuidIbanValidators extends ng.IModelValidators {
		iban: () => boolean;
	}
}
