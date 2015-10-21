describe('luifNumber', function() {
	'use strict';
	var myValueInput;
	var myPrecisionInput;

	var myValueDiv1;
	var myValueDiv2;
	var myValueDiv3;

	beforeEach(function() {
		myValueInput = element(by.id("luifNumber_myValue_input"));
		myPrecisionInput = element(by.id("luifNumber_myPrecision_input"));
		myValueDiv1 = element(by.id("luifNumber_myValue_value_1"));
		myValueDiv2 = element(by.id("luifNumber_myValue_value_2"));
		myValueDiv3 = element(by.id("luifNumber_myValue_value_3"));
	});

	it("should display myValue with the decimal part in a span", function() {
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("3.14");
		});
		myValueDiv1.getInnerHtml().then(function(html) {
			expect(html).toEqual("3<span>.14</span>");
		});
	});
	it("should hide the span when the decimal part is null", function() {
		myValueInput.clear();
		myValueInput.sendKeys(3);
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("3");
		});
		myValueDiv1.getInnerHtml().then(function(html) {
			expect(html).toEqual('3<span style="opacity:0">.00</span>');
		});
	});
	it("should display the correct number of decimals", function() {
		myValueInput.clear();
		myValueInput.sendKeys(3.141592);
		myPrecisionInput.clear();
		myPrecisionInput.sendKeys(4);
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("3.1416");
		});
		myValueDiv1.getInnerHtml().then(function(html) {
			expect(html).toEqual("3<span>.1416</span>");
		});
	});
	it("should handle empty value", function() {
		myValueInput.clear();
		myPrecisionInput.clear();
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("");
		});
		myValueDiv1.getInnerHtml().then(function(html) {
			expect(html).toEqual('<span style="opacity:0">.00</span>');
		});
		myValueDiv2.getText().then(function(text) {
			expect(text).toEqual("0");
		});
		myValueDiv2.getInnerHtml().then(function(html) {
			expect(html).toEqual('0<span style="opacity:0">.00</span>');
		});
		myValueDiv3.getText().then(function(text) {
			expect(text).toEqual("-");
		});
		myValueDiv3.getInnerHtml().then(function(html) {
			expect(html).toEqual('-<span style="opacity:0">.00</span>');
		});
	});

});