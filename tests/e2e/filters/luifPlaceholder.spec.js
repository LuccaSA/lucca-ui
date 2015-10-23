describe('luifPlaceholder', function() {
	var myValueInput;
	var myPlaceholderInput;

	var myValueDiv1;
	var myValueDiv2;

	beforeEach(function() {
		myValueInput = element(by.id("luifPlaceholder_myValue_input"));
		myPlaceholderInput = element(by.id("luifPlaceholder_myPlaceholder_input"));
		myValueDiv1 = element(by.id("luifPlaceholder_myValue_value_1"));
		myValueDiv2 = element(by.id("luifPlaceholder_myValue_value_2"));
	});

	it("should display myValue at the beginning", function() {
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("stuff");
		});
		myValueDiv2.getText().then(function(text) {
			expect(text).toEqual("stuff");
		});
	});
	it("should display myValue when updating myValue", function() {
		myValueInput.sendKeys("abc");
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("stuffabc");
		});
		myValueDiv2.getText().then(function(text) {
			expect(text).toEqual("stuffabc");
		});
	});
	it("should display the placeholder when clearing myValue", function() {
		myValueInput.clear();
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("static placeholder");
		});
		myValueDiv2.getText().then(function(text) {
			expect(text).toEqual("placeholder");
		});
	});

	it("should update the second div when updating myPlaceholder", function() {
		myPlaceholderInput.sendKeys(" updated");
		myValueDiv1.getText().then(function(text) {
			expect(text).toEqual("static placeholder");
		});
		myValueDiv2.getText().then(function(text) {
			expect(text).toEqual("placeholder updated");
		});
	});

});