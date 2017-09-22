module lui.userpicker {
	"use strict";
	export interface IUserLookup {
		id: number;
		firstName: string;
		lastName: string;
		employeeNumber: string;
		dtContractEnd?: string;

		/** Indicates if dtContractEnd < today */
		hasLeft?: boolean;
		/** String containing potential additional information about the user. Can be empty */
		info?: string;
		/** Indicates if the user has homonyms */
		hasHomonyms?: boolean;
		/** Array containing the properties used to differentiate the users who have homonyms. Can be empty. */
		additionalProperties?: IHomonymProperty[];
	}

	/**
	 * Interface depicting a property
	 */
	export interface IHomonymProperty {
		/** The key used to fetch the translation of the property */
		translationKey: string;

		/** The name of the property. Ensure it means something for the API: it will be used to fetch the value attribute. */
		name: string;

		/** The name of the icon used to display the property */
		icon: string;

		/** The actual value of the property */
		value?: string;
	}
}
