module lui.translationslist {
	"use strict";

	export interface ILuidTranslationsListScope extends ng.IScope {
		/** List of all the available cultures */
		cultures: string[];
		/** The users preferred culture (displayed first in the tabs) */
		currentCulture: string;
		/** The selected culture */
		selectedCulture: string;

		values: _.Dictionary<CulturedList>;

		/** Changes the active culture tab */
		selectCulture(culture: string): void;
		/** Add a new value to each entry of the `values` dictionary */
		addValue(): void;
		/** Delete a value. The value is deleted in each entry of the `values` dictionary */
		deleteValue(index: number): void;
		/** Indicates if the user can add a new value */
		canAddValue(): boolean;
	}

	// export var luccaModelEx = [
	// 	<LuccaTranslation>{
	// 		id: 1,
	// 		culturedLabels: [
	// 			<LuccaCulturedLabel>{ id: 2, cultureCode: 1033, value: "stuff", translationId: 1 },
	// 			<LuccaCulturedLabel>{ id: 3, cultureCode: 1033, value: "thing", translationId: 1 },
	// 			<LuccaCulturedLabel>{ id: 4, cultureCode: 1033, value: "noice", translationId: 1 },
	// 		]
	// 	},
	// 	<LuccaTranslation>{
	// 		id: 1036,
	// 		culturedLabels: [
	// 			<LuccaCulturedLabel>{ id: 5, cultureCode: 1036, value: "truc", translationId: 2 },
	// 			<LuccaCulturedLabel>{ id: 6, cultureCode: 1036, value: "bidule", translationId: 2 },
	// 			<LuccaCulturedLabel>{ id: 7, cultureCode: 1036, value: "chouette", translationId: 2 },
	// 		]
	// 	},
	// ];
}
