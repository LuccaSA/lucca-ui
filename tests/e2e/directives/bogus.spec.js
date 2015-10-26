describe('bogusTestE2e', function() {
	describe('bogus', function() {
		var bodyCnt = 0;
		beforeEach(function() {
		browser.sleep(2000);
		element.all(by.css("body")).count().then(function(originalCount) {
			bodyCnt = originalCount;
		});

	});
		it("should only be one body tag", function() {
			expect(bodyCnt).toEqual(1);
		});
	});
});