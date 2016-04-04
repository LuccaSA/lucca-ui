/// <reference path="../references.spec.ts" />

module Lui.Directives.DaterangePicker.Test {
	"use strict";

	describe("luidDaterangePicker", (): void => {

		beforeEach((): void => {
			// do things
		});

		it("should be an input", (): void => {
			expect(element(by.css("#luid-daterange-picker input")).isPresent()).toBe(true);
		});
		it("should show a friendlyranged string", (): void => {
			let text = element(by.css("#luid-daterange-picker input")).getAttribute("value");
			expect(text).toEqual("January 1st - March 31st");
		});
		it("should open popover on click", (): void => {
			let input = element(by.css("#luid-daterange-picker input"));
			input.click();
			expect(element(by.css("#luid-daterange-picker .popover")).isPresent()).toBe(true);
		});
	});
}
