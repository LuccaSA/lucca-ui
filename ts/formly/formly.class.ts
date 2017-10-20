module lui {
	"use strict";
	export interface IField {
		key: string;
		type: string;
		className?: string;
		templateOptions?: ITemplateOptions;
	}
	export interface ITemplateOptions {
		label?: string;
		helper?: string;
		required?: boolean;
		disabled?: boolean;
		display?: string;
		placeholder?: number | string;
		style?: string;

		// error messages
		requiredError?: string;
		emailError?: string;
		ibanError?: string;

		// textarea types
		rows?: number;
		// select and radio types
		choices?: { label: string | number }[];
		// api-select field type
		api?: string;
		filter?: string;
		allowClear?: boolean;
	}
}
