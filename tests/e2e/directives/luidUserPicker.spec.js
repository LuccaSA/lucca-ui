describe('luidUserPicker', function() {
	var myUserDiv;
	var myUserPicker;
	var myUserPickerInput;

	beforeEach(function() {
		myUserPicker = element(by.id("luidUserPicker_myUser_select"));
		myUserPickerInput = myUserPicker.all(by.tagName("input")).first();
		myUserDiv = element(by.id("luidUserPicker_myUser_value"));
	});

	it("should display init input value", function() {
		myUserPicker.getText().then(function(text){
			expect(text).toBe('Lucien Bertin');
		});
	});
	it("should display a list of 5 users and an overflow message", function() {
		myUserPicker.click();
	});
	it("should update the list of users when updating input value", function() {
		myUserPickerInput.sendKeys("ber");
	});
});