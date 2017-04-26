module lui.translationslist {
	"use strict";

	export interface ILuidTranslationsListScope extends ng.IScope {
		/** List of all the available cultures */
		cultures: string[];
		/** The users preferred culture (displayed first in the tabs) */
		currentCulture: string;
		/** The selected culture */
		selectedCulture: string;
		/** ViewModel : Dictionary containing all the value which are currently displayed, ordered by culture */
		values: _.Dictionary<CulturedList>;
		/** Indicates if the user can modify the values */
		disabled: boolean;

		addValueOnEnter: { [key: number]: ($event: ng.IAngularEvent) => void };

		/** Changes the active culture tab */
		selectCulture(culture: string): void;
		/** Add a new value to each entry of the `values` dictionary */
		addValue(): void;
		/** Delete a value. The value is deleted in each entry of the `values` dictionary */
		deleteValue(index: number): void;
		/** Indicates if the user can add a new value */
		isAddValueDisabled(): boolean;
		/** Called when the users paste something into an input */
		onPaste(event: ClipboardEvent, index: number): void;
	}
}
