describe('luidDaterange', function() {
	var myDaterangeInput1;
	var myDaterangeInput2;
	var myDaterangeDiv2;
	var myDaterangePopover;
	var body;

	beforeEach(function() {
		myDaterangeInput1 = element(by.id('luidDaterange_input_1'));
		myDaterangeInput2 = element(by.id('luidDaterange_input_2'));
		myDaterangeDiv2 = element(by.id('luidDaterange_div_2'));
		body = element(by.tagName('body'));
	});

	/*****************/
	/***** BASIC *****/
	/*****************/
	it("should show popover when clicked", function() {
		myDaterangeInput1.click();
		myDaterangePopover = myDaterangeInput1.element(by.css(".popover"));
		expect(myDaterangePopover.isDisplayed()).toBeTruthy();
	});
	it("should hide popover when re-clicked", function() {
		myDaterangeInput1.click();
		myDaterangePopover = element.all(by.css("luid-daterange .popover"));
		expect(myDaterangePopover.count()).toBe(0);
	});
	it("should not hide popover when clicked inside the popover", function() {
		myDaterangeInput1.click();
		myDaterangePopover = myDaterangeInput1.element(by.css(".popover"));
		expect(myDaterangePopover.isDisplayed()).toBeTruthy();
		myDaterangePopover.click();
		expect(myDaterangePopover.isDisplayed()).toBeTruthy();
	});
	it("should hide popover when clicked outside the popover", function() {
		body.click();
		myDaterangePopover = element.all(by.css("luid-daterange .popover"));
		expect(myDaterangePopover.count()).toBe(0);
	});
	it("should hide popover when clicked the ok button", function() {
		myDaterangeInput1.click();
		myDaterangePopover = myDaterangeInput1.element(by.css(".popover"));
		var button = myDaterangePopover.element(by.css(".button"));
		expect(button.getText()).toBe("Ok");
		button.click();
		myDaterangePopover = element.all(by.css("luid-daterange .popover"));
		expect(myDaterangePopover.count()).toBe(0);
	});
	/*****************/
	/* CUSTOM CLOSE  */
	/*****************/
	it("should have the right label the ok button", function() {
		myDaterangeInput2.click();
		myDaterangePopover = myDaterangeInput2.element(by.css(".popover"));
		var button = myDaterangePopover.element(by.css(".button"));
		expect(button.getText()).toBe("Close");
	});
	it("should call the custom close function when clicking the ok button", function() {
		myDaterangePopover = myDaterangeInput2.element(by.css(".popover"));
		myDaterangePopover.element(by.css(".button")).click();
		expect(myDaterangeDiv2.getText()).toBe("22");
	});
});