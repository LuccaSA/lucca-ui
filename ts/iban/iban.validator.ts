module Lui.Directives {
	"use strict";

	export interface ILuidIbanValidators extends ng.IModelValidators {
		iban: () => boolean;
	}
}
