describe('luidDayBlock', function() {
	var myDayBlock, myDayBlockWithout;

	beforeEach(function() {
		myDayBlock = element(by.id('myDayBlock'));
        myDayBlockWithout = element(by.id('myDayBlockWithout'));
	});

	/*****************/
	/***** BASIC *****/
	/*****************/
    it("should show the right date with day name", function(){
       expect(myDayBlock.getText()).toBe("FRIDAY\n12\nDEC\n2014");
    });
    it("should show the right date without day name", function(){
       expect(myDayBlockWithout.getText()).toBe("12\nDEC\n2014");
    });
});