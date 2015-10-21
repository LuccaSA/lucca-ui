describe('luidUserPicker', function() {
	var myUserDiv;
	var myUserPicker;

	var findApi = /api\/v3\/users\/find\?.*/;


	beforeEach(function() {
		myUserPicker = element(by.id("luidUserPicker_myUser_select"));
		myUserDiv = element(by.id("luidUserPicker_myUser_value"));
	});

	it("should call the api and initialise the list of users", function() {
		//$httpBackend.expectGET(findApi).respond(200, RESPONSE_0_users);
	});
	it("should call the api and display users whose name begins with", function() {
		myUserPicker.sendKeys('be');
	});

	var RESPONSE_0_users = {header:{}, data:{items:[]}};
});