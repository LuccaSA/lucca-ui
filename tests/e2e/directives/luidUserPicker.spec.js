describe('luidUserPicker', function() {
	var myUserDiv;
	var myUserPicker;
	var myUserPickerFormerEmployees;
	var myUserPickerInput;
	var myUserPickerInputFormerEmployees;
	var myUserPickerChoices;
	var myUserPickerChoicesFormerEmployees;
	var myUserPickerContainer;

	beforeEach(function() {
		myUserDiv = element(by.id('myUserPicker_value'));
		myUserPicker = element(by.id('myUserPicker'));
		myUserPickerInput = myUserPicker.all(by.tagName('input')).first();
		myUserPickerContainer = myUserPicker.element(by.className('ui-select-container'));
		myUserPickerChoices = myUserPicker.all(by.className('ui-select-choices-row'));
		/* luid-user-picker with former employees */
		myUserPickerFormerEmployees = element(by.id('myUserPicker_former_employees'));
		myUserPickerChoicesFormerEmployees = myUserPickerFormerEmployees.all(by.className('ui-select-choices-row'));
		myUserPickerInputFormerEmployees = myUserPickerFormerEmployees.all(by.tagName('input')).first();
		/* luid-user-picker with custom info */
		myUserPickerCustomInfo = element(by.id('myUserPicker_custom_info'));
		myUserPickerCustomInfoAsync = element(by.id('myUserPicker_custom_info_async'));
		myUserPickerChoicesCustomInfo = myUserPickerCustomInfo.all(by.className('ui-select-choices-row'));
		myUserPickerChoicesCustomInfoAsync = myUserPickerCustomInfoAsync.all(by.className('ui-select-choices-row'));
		/* luid-user-picker with display-me-first="true" */
		myUserPickerDisplayMeFirst = element(by.id('myUserPicker_display_me_first'));
		myUserPickerChoicesDisplayMeFirst = myUserPickerDisplayMeFirst.all(by.className('ui-select-choices-row'));
		/* luid-user-picker with display-all-users="true" */
		myUserPickerDisplayAllUsers = element(by.id('myUserPicker_display_all_users'));
		myUserPickerChoicesDisplayAllUsers = myUserPickerDisplayAllUsers.all(by.className('ui-select-choices-row'));
	});

	/*****************/
	/***** BASIC *****/
	/*****************/
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
	it("should disable sixth choice in dropdown menu because it is the overflow message", function() {
		expect(myUserPickerContainer.getAttribute('class')).toMatch('open');
		var lastChoice = myUserPickerChoices.get(5).getWebElement();
		expect(lastChoice.getAttribute('class')).toMatch('disabled');
	});
	it('should update the selected user and close the dropdown menu on click on the choice', function() {
		myUserPickerChoices.get(2).getWebElement().click();
		expect(myUserPickerContainer.getAttribute('class')).not.toMatch('open');
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

	/***************************************/
	/***** DISPLAY SELECTED USER FIRST *****/
	/***************************************/
	it('should display the selected user with "selected" class', function() {
		myUserPickerChoices.get(1).getWebElement().click();
		myUserPicker.click();
		var firstChoice = myUserPickerChoices.get(0).all(by.tagName('div')).first();
		expect(firstChoice.getAttribute('class')).toMatch('dividing');
	});

	/********************/
	/***** HOMONYMS *****/
	/********************/
	it('should display homonyms', function() {
		myUserPickerInput.clear();
		myUserPickerInput.sendKeys("a");
		expect(myUserPickerContainer.getAttribute('class')).toMatch('open');
		expect(myUserPickerChoices.count()).toBe(4);
		// Check that the first user is displayed as 'homonym' (it has 2 'small' tags as children)
		var smallTags = myUserPickerChoices.get(0).all(by.tagName('small'));
		expect(smallTags.count()).toBe(2);
		// In order to close the dropdown menu
		myUserPickerChoices.get(0).getWebElement().click();
	});

	/****************************/
	/***** FORMER EMPLOYEES *****/
	/****************************/
	it('should display former employees', function() {
		myUserPickerFormerEmployees.click();
		// Check that the last user in the dropdown menu is displayed as 'former employee' (it has a 'small' tag as child)
		var smallTag = myUserPickerChoicesFormerEmployees.get(2).all(by.tagName('small'));
		expect(smallTag.count()).toBe(1);
	});

	/***************************************/
	/***** FORMER EMPLOYEES + HOMONYMS *****/
	/***************************************/
	it('should display former employees and homonyms', function() {
		myUserPickerInputFormerEmployees.sendKeys("a");
		// Check that the last user in the dropdown menu is displayed as 'former employee' and 'homonym' (it has 3 'small' tags as children)
		var smallTag = myUserPickerChoicesFormerEmployees.get(1).all(by.tagName('small'));
		expect(smallTag.count()).toBe(3);
		// In order to close the dropdown menu
		myUserPickerChoicesFormerEmployees.get(0).getWebElement().click();
	});

	/***********************/
	/***** CUSTOM INFO *****/
	/***********************/
	it('should display custom info for each user', function() {
		myUserPickerCustomInfo.click();
		// Check that the label is displayed
		var label = myUserPickerChoicesCustomInfo.get(2).element(by.tagName('span'));
		expect(label.getAttribute('class')).toMatch('label');
	});
	it('should display custom info async for each user', function() {
		myUserPickerCustomInfoAsync.click();
		// Check that the label is displayed
		var label = myUserPickerChoicesCustomInfoAsync.get(2).element(by.tagName('span'));
		expect(label.getAttribute('class')).toMatch('label');
	});

	/****************************/
	/***** DISPLAY ME FIRST *****/
	/****************************/
	it('should display "me" with "dividing" class', function() {
		myUserPickerDisplayMeFirst.click();
		var firstChoice = myUserPickerChoicesDisplayMeFirst.get(0).all(by.tagName('div')).first();
		expect(firstChoice.getAttribute('class')).toMatch('dividing');
		// In order to close the dropdown menu
		myUserPickerChoicesDisplayMeFirst.get(0).getWebElement().click();
	});

	/*****************************/
	/***** DISPLAY ALL USERS *****/
	/*****************************/
	it('should display "all users" with "dividing" class', function() {
		myUserPickerDisplayAllUsers.click();
		var firstChoice = myUserPickerChoicesDisplayAllUsers.get(0).all(by.tagName('div')).first();
		expect(firstChoice.getAttribute('class')).toMatch('dividing');
	});
});