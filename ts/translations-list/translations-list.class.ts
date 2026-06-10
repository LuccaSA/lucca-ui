module lui.translate {
	"use strict";

	/**
	 * Single source of truth for the languages supported by the lui translation directives
	 * (luid-translations-list and luid-translations), with their associated culture codes.
	 * The keys order defines the display order of the languages.
	 */
	export const LANGUAGES_TO_CODE: { [language: string]: number } = { en: 1033, fr: 1036, de: 1031, es: 1034, it: 1040, nl: 1043, pt: 2070, pl: 1045 };
	/** All the supported languages labels, derived from LANGUAGES_TO_CODE */
	export const AVAILABLE_LANGUAGES: string[] = Object.keys(LANGUAGES_TO_CODE);
	/** Used to convert culture codes to their associated labels, derived from LANGUAGES_TO_CODE */
	export const CODES_TO_LANGUAGES: { [code: number]: string } = {};
	AVAILABLE_LANGUAGES.forEach((language: string) => { CODES_TO_LANGUAGES[LANGUAGES_TO_CODE[language]] = language; });

	export class CulturedList {
		public culture: string;
		public originalId: number;
		public values: ICulturedValue[];

		constructor(culture: string) {
			this.culture = culture;
			this.originalId = undefined;
			this.values = new Array<ICulturedValue>();
		}
	}

	export interface ICulturedValue {
		value: string;
		originalLuccaCulturedLabelId?: number;
		originalLuccaTranslationId?: number;
	}

	//
	// Lucca Format
	//

	/** Represents the Lucca proprietary format */
	export interface ILuccaTranslation {
		id: number;
		culturedLabels: ILuccaCulturedLabel[];
	}

	/** Represents an entry of the Lucca proprietary format */
	export interface ILuccaCulturedLabel {
		id: number;
		cultureCode: number;
		value: string;
		translationId: number;
	}
}
