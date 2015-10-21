describe('luidUserPicker', function() {
	var myUserDiv;
	var myUserPicker;
	var myUserPickerInput;
	var myUserPickerChoices;

	beforeEach(function() {
		myUserPicker = element(by.id("luidUserPicker_myUser_select"));
		myUserPickerInput = myUserPicker.all(by.tagName("input")).first();
		myUserPickerContainer = myUserPicker.element(by.className("ui-select-container"));
		myUserPickerChoicesGroup = myUserPicker.element(by.className("ui-select-choices-group"));
		myUserPickerChoices = myUserPicker.all(by.className('ui-select-choices-row'));
		myUserDiv = element(by.id("luidUserPicker_myUser_value"));
	});

	it("should display init input value", function() {
		myUserPicker.getText().then(function(text){
			expect(text).toBe('Lucien Bertin');
		});
	});
	it("should display a dropdown menu with 6 items when the user picker is clicked", function() {
		myUserPicker.click();
		expect(myUserPickerContainer.getAttribute('class')).toMatch('open');
		expect(myUserPickerChoices.count()).toBe(6);
	});
	it("should disable last choice in dropdown menu", function() {
		expect(myUserPickerContainer.getAttribute('class')).toMatch('open');
		var lastChoice = myUserPickerChoices.get(5).getWebElement();
		expect(lastChoice.getAttribute('class')).toMatch('disabled');
	});
	it('should update the selected user', function() {
		myUserPickerChoices.get(1).getWebElement().click();
		//myUserPickerInput.sendKeys(protractor.Key.DOWN);
		//myUserPickerInput.sendKeys(protractor.Key.ENTER);
		myUserPicker.getText().then(function(userPickerText) {
			// Check that the text in the input is the name of the selected user
			expect(userPickerText).toBe('Elsa Arrou-Vignod');
			// Check the binding between ng-model in luid-user-picker and the selected user
			myUserDiv.getText().then(function(divText) {
				expect(divText).toBe(userPickerText);
			});
		});
	});
	it("should display a dropdown menu with 2 items when updating input value", function() {
		myUserPicker.click();
		myUserPickerInput.sendKeys("ber");
		expect(myUserPickerContainer.getAttribute('class')).toMatch('open');
		expect(myUserPickerChoices.count()).toBe(2);
	});
	it('should display homonyms', function() {
		myUserPickerInput.clear();
		myUserPickerInput.sendKeys("a");
		expect(myUserPickerContainer.getAttribute('class')).toMatch('open');
		expect(myUserPickerChoices.count()).toBe(4);
		// Check that the first user is displayed as 'homonym' (it has 2 'small' tags as children)
		var smallTags = myUserPickerChoices.get(0).all(by.tagName('small'));
		expect(smallTags.count()).toBe(2);
	});
});