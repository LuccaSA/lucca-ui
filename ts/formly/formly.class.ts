module Lui {
	"use strict";
	export interface IField extends AngularFormly.IFieldConfigurationObject {
		key: string;
		type: string;
		templateOptions?: ITemplateOptions;
	}
	export interface ITemplateOptions extends AngularFormly.ITemplateOptions {
		label?: string;
		helper?: string;
		required?: boolean;
		disabled?: boolean;
		display?: string;
		placeholder?: string;

		// error messages
		requiredError?: string;
		emailError?: string;

		// select and radio types
		choices?: { label: string | number };
		// api-select field type
		api?: string;
		filter?: string;
	}
}
