describe('luifPlaceholder', function() {
	var myValueInput;

	var myValueDiv;

	beforeEach(function() {
		myValueInput = element(by.id("luifDefaultCode_myValue_input"));
		myValueDiv = element(by.id("luifDefaultCode_myValue_value"));
	});

	it("should display myValue capitalized at the beginning", function() {
		myValueDiv.getText().then(function(text) {
			expect(text).toEqual("STUFF");
		});
	});
	it("should replace spaces with _ ", function() {
		myValueInput.sendKeys(" some spaces");
		myValueDiv.getText().then(function(text) {
			expect(text).toEqual("STUFF_SOME_SPACES");
		});
	});
	it("should let number as is", function() {
		myValueInput.sendKeys(" 1337 test e2e");
		myValueDiv.getText().then(function(text) {
			expect(text).toEqual("STUFF_SOME_SPACES_1337_TEST_E2E");
		});
	});
});