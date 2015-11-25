describe('luidKeydown', function() {
	var myInput;
	var mySpan;

	beforeEach(function() {
		myInput = element(by.id('myKeydown_input'));
		mySpan = element(by.id('myKeydown_span'));
	});

	/*****************/
	/***** BASIC *****/
	/*****************/
	it("should register other keys than enter, esc, left arrow or z", function() {
		myInput.sendKeys("qwertyuio");
		expect(myInput.getAttribute("value")).toBe("qwertyuio");
	});
	it("should prevent default on the mapped keys", function() {
		myInput.clear();
		myInput.sendKeys("azazel");
		expect(myInput.getAttribute("value")).toBe("aael");
	});
	it("should call the mapped functions", function() {
		myInput.sendKeys(protractor.Key.ENTER);
		expect(mySpan.getText()).toBe("enter");
		myInput.sendKeys(protractor.Key.ESCAPE);
		expect(mySpan.getText()).toBe("esc");
		myInput.sendKeys(protractor.Key.ARROW_LEFT);
		expect(mySpan.getText()).toBe("left");
		myInput.sendKeys("z");
		expect(mySpan.getText()).toBe("z");
	});

});