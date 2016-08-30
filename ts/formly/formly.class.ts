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
	}

	export interface IApiSelectTemplateOptions extends ITemplateOptions {
		api?: string;
		filter?: string;
	}
}
