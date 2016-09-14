module Lui.Directives.Iban {
	"use strict";

	export interface ILuidIbanValidators extends ng.IModelValidators {
		iban: () => boolean;
	}
}
