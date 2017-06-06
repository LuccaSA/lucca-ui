module lui.translate {
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
		isDisabled: boolean;

		/** Used to detect when the user presses the Enter key */
		addValueOnEnter: { [key: number]: ($event: JQueryEventObject) => void };

		/** Identifier used to add unique Ids to the inputs of the directive */
		uniqueId: string;

		/**
		 * Changes the active culture tab
		 * @param {string} culture The culture which will become active
		 */
		selectCulture(culture: string): void;

		/** Add a new value to each entry of the `values` dictionary */
		addValue(): void;

		/** Add a new value to each entry of the `values` dictionary and focus on the current culture new input */
		addValueAndFocus(): void;

		/**
		 * Delete a value. The value is deleted in each entry of the `values` dictionary
		 * @param {number} index The index of the value you want to delete
		 */
		deleteValue(index: number): void;

		/** Indicates if the user can add a new value */
		isAddValueDisabled(): boolean;

		/**
		 * Called when the users paste something into an input
		 * @param {ClipBoardEvent} event The copy/paste event
		 * @param {number} index The index of the input where something was pasted
		 */
		onPaste(event: ClipboardEvent | JQueryEventObject, index: number): void;

		/**
		 * Returns the placeholder for the input at the specified index, for the specified culture
		 * @param {string} culture The culture for which you want a placeholder
		 * @param {number} index The index of the input for which you want a placeholder
		 */
		getPlaceholder(culture: string, index: number): string;

		/** Called when the users changes the text of an input. This method is set inside the directive file and calls ngModelCtrl.$setViewValue() */
		onInputValueChanged(): void;

		/** Generates a unique identifier for the inputs displayed in the directive */
		getUniqueId(culture: string, index: number): string;
	}
}
