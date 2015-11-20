describe('luidDaterange', function() {
	var myDaterange;
	var myDaterangePopover;
	var body;

	beforeEach(function() {
		myDaterange = element(by.id('myDaterange'));
		body = element(by.tagName('body'));
	});

	/*****************/
	/***** BASIC *****/
	/*****************/
	it("should show popover when clicked", function() {
		myDaterange.click();
		myDaterangePopover = myDaterange.element(by.css(".popover"));
		expect(myDaterangePopover.isDisplayed()).toBeTruthy();
	});
	it("should hide popover when re-clicked", function() {
		myDaterange.click();
		myDaterangePopover = element.all(by.css("luid-daterange .popover"));
		expect(myDaterangePopover.count()).toBe(0);
	});
	it("should not hide popover when clicked inside the popover", function() {
		myDaterange.click();
		myDaterangePopover = myDaterange.element(by.css(".popover"));
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
		myDaterange.click();
		myDaterangePopover = myDaterange.element(by.css(".popover"));
		myDaterangePopover.element(by.css(".button")).click();
		myDaterangePopover = element.all(by.css("luid-daterange .popover"));
		expect(myDaterangePopover.count()).toBe(0);
	});
	
});