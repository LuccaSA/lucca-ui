module lui.translate {
	"use strict";

	/** All the languages supported by the translation-list directive */
	export const AVAILABLE_LANGUAGES = ["en", "fr", "de", "es", "it", "nl", "pt"];
	/** Used to convert languages labels to their associated culture codes */
	export const LANGUAGES_TO_CODE = { en: 1033, de: 1031, es: 1034, fr: 1036, it: 1040, nl: 1043, pt: 2070 };
	/** Used to converted culture codes to their associated labels  */
	export const CODES_TO_LANGUAGES = { 1033: "en", 1031: "de", 1034: "es", 1036: "fr", 1040: "it", 1043: "nl", 2070: "pt" };

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
