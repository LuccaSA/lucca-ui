describe('luidUserPicker', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var _, $scope, isolateScope, $compile, elt, $httpBackend, controller, moment, $timeout;
	var users;

	var findApi = /api\/v3\/users\/find\?.*/;

	beforeEach(inject(function (_$rootScope_, _$compile_, ___, _$httpBackend_, _moment_, _$timeout_) {
		_ = ___;
		$scope = _$rootScope_.$new();
		$httpBackend = _$httpBackend_;
		$timeout = _$timeout_;
		$compile = _$compile_;
		moment = _moment_;
	}));

	// describe('most basic-est use', function(){
	// 	beforeEach(function(){
	// 		var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		controller = elt.controller;
	// 		$scope.$digest();
	// 		isolateScope.find();
	// 		$httpBackend.expectGET('/api/v3/users/find?formerEmployees=false&limit=6').respond(200, RESPONSE_initWithoutFormerEmployees);
	// 	});
	// 	it('should initialise users', function(){
	// 		$httpBackend.flush();
	// 		expect(isolateScope.users).toBeDefined();
	// 	});
	// 	it('should initialise users with the 5 first users returned by the api', function() {
	// 		users = [{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"overflow":"5/..."}];
	// 		$httpBackend.flush();
	// 		expect(angular.equals(isolateScope.users, users)).toBe(true);
	// 	});

	// 	describe('with pagination', function() {
	// 		beforeEach(function() {
	// 			$httpBackend.flush();
	// 			$timeout.flush();
	// 			//$httpBackend.expectGET('/api/v3/users/find?formerEmployees=false&limit=6').respond(200, RESPONSE_initWithoutFormerEmployees);
	// 		});
	// 		it('should get the number of users', function() {

	// 		});
	// 	});
	// });

	/**********************
	** INITIALISATION    **
	**********************/
	describe("initialisation", function(){
		// it might not be possible to test this 
		// as the refresh attribute from the ui-select-choice directive
		// https://github.com/angular-ui/ui-select/wiki/ui-select-choices
		// might be triggered by the browser and not by $compile
		// or it is triggered before we spyOn it and not by the $scope.$digest

		// yeah, here find is not called either during $compile or $scope.$digest
		// you can modify this plunkr 
		// http://plnkr.co/edit/a3KlK8dKH3wwiiksDSn2?p=preview
		// you can see that refreshAddresses is called during the loading of the page
		// but i have no idea how to trigger it here
		it("should call isolateScope.find('')", function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			controller = elt.controller("luidUserPicker");
			spyOn(isolateScope, 'find');
			$scope.$digest();
			// expect(isolateScope.find).toHaveBeenCalled();

			expect(controller.isMultipleSelect).toBe(false);
			expect(controller.asyncPagination).toBe(false);
			expect(controller.useCustomFilter).toBe(false);
		});
	});

	/**********************
	** BASIC             **
	**********************/
	describe("no pagination, no former employees, no homonyms", function(){
		var findApiWithClue = /api\/v3\/users\/find\?\&clue=/;
		var findApiWithoutClue = /api\/v3\/users\/find\?/;
		var standardFilters = /formerEmployees=false\&limit=\d*/;
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();
		});
		it('should call the api with the right filters when isolateScope.find("clue") is called', function(){
			// no clue
			$httpBackend.expectGET(new RegExp(findApiWithoutClue.source + standardFilters.source)).respond(200, RESPONSE_0_users);
			isolateScope.find();
			$httpBackend.flush();
			// a clue
			var clues = ['a', 'ismael', 'zanzibar'];
			_.each(clues, function(clue){
				$httpBackend.expectGET(new RegExp(findApiWithClue.source + clue + (/\&/).source + standardFilters.source)).respond(200, RESPONSE_0_users);
				isolateScope.find(clue);
				$httpBackend.flush();
			});
		});
		it('should handle the response', function(){
			$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users);
			isolateScope.find();
			$httpBackend.flush();

			// TODO_ANAIS
			users = [{"id":1,"firstName":"Guillaume","lastName":"Allain"},{"id":2,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":3,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":4,"firstName":"Clément","lastName":"Barbotin"}];
			expect(angular.equals(isolateScope.users, users)).toBe(true);
			// DONE
		});
		it('should handle errors', function(){
			$httpBackend.expectGET(findApi).respond(500, RESPONSE_ERROR_FIND);
			isolateScope.find();
			$httpBackend.flush();

			// TODO_ANAIS
			users = [{"overflow":"VAR_TRAD Nous n'avons pas réussi à récupérer les utilisateurs correspondant à votre requête. Tant pis !"}]
			expect(angular.equals(isolateScope.users, users)).toBe(true);
			// DONE
		});
	});

	// TODO
	/**********************
	** PAGINATION        **
	**********************/
	describe("with pagination", function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();

			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
		});
		it('should detect there is too many users to display', function(){
			isolateScope.find();
			$httpBackend.flush();

			// TODO_ANAIS
			var overflow = {overflow: "5/20"};
			expect(isolateScope.count).toBe(20);
			expect(isolateScope.users.length).toBe(6); // 5 first users + overflow message ==> 6 items
			expect(angular.equals(_.last(isolateScope.users), overflow)).toBe(true);
			// DONE
		});
	});
	// Async
	// describe("with async pagination", function(){
	// 	beforeEach(function(){
	// 		var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();

	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
	// 	});
	// 	it('should detect there is too many users to display and ask for how many results there is', function(){
	// 		isolateScope.find();
	// 		$httpBackend.flush();

	// 		// TODO_ANAIS
	// 		// expect(isolateScope.displayedUsers.length).toBe(less than 20);
	// 		// expect(last displayed user).toBe(the label displaying 'results 1-5/20')

	// 		// might need a $scope.$apply here to resolve some promises
	// 		// $httpBackend.expectGET(findApi).respond(200, RESPONSE_find_count);
	// 		// $timeout.flush();
	// 		// $httpBackend.flush();
	// 	});
	// 	it('should ask how many user ther is only once its timeout is resolved, not after each find', function(){
	// 		isolateScope.find('a');
	// 		$httpBackend.flush();

	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
	// 		isolateScope.find('ab');
	// 		$httpBackend.flush();
	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
	// 		isolateScope.find('abc');
	// 		$httpBackend.flush();

	// 		// TODO_ANAIS
	// 		// expect(isolateScope.displayedUsers.length).toBe(less than 20);
	// 		// expect(last displayed user).toBe(the label displaying 'results 1-5/20')

	// 		// might need a $scope.$apply here to resolve some promises
	// 		// $httpBackend.expectGET(findApi).respond(200, RESPONSE_find_count);
	// 		// $timeout.flush();
	// 		// $httpBackend.flush();
	// 	});
	// 	it('should handle error when asking for the number of results', function(){
	// 		isolateScope.find('a');
	// 		$httpBackend.flush();

	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
	// 		isolateScope.find('ab');
	// 		$httpBackend.flush();
	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
	// 		isolateScope.find('abc');
	// 		$httpBackend.flush();

	// 		// TODO_ANAIS
	// 		// expect(isolateScope.displayedUsers.length).toBe(less than 20);
	// 		// expect(last displayed user).toBe(the label displaying 'results 1-5/20')

	// 		// might need a $scope.$apply here to resolve some promises
	// 		// $httpBackend.expectGET(findApi).respond(500, RESPONSE_ERROR_COUNT;
	// 		// $timeout.flush();
	// 		// $httpBackend.flush();
	// 	});
	// });

	// TODO
	/**********************
	** FORMER EMPLOYEES  **
	**********************/
	describe("with former employees", function(){
		var findApiWithClue = /api\/v3\/users\/find\?\&clue=/;
		var standardFilters = /\&formerEmployees=true\&limit=\d*/;
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser" show-former-employees="showFE"></luid-user-picker>');
			$scope.showFE = true;
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();
		});
		it('should call the api with the right filters when isolateScope.find("clue") is called', function(){
			var clues = ['a', 'ismael', 'zanzibar'];
			_.each(clues, function(clue){
				$httpBackend.expectGET(new RegExp(findApiWithClue.source + clue + standardFilters.source)).respond(200, RESPONSE_0_users);
				isolateScope.find(clue);
				$httpBackend.flush();
			});
		});
		it('should detect and flag former employees in the response', function(){
			$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users_FE);
			isolateScope.find();
			$httpBackend.flush();

			// TODO_ANAIS
			var formerEmployeeIds = _.chain(isolateScope.users)
			.where({isFormerEmployee:true}) // keep only the ones tagged as 'former employee'
			.pluck('id') // just keep their id
			.value();
			expect(formerEmployeeIds).toEqual([2,3]);
			// DONE
		});
	});

	// TODO
	/**********************
	** CUSTOM FILTERING  **
	**********************/
	// describe("with custom filtering", function(){
	// 	beforeEach(function(){
	// 		var tpl = angular.element('<luid-user-picker ng-model="myUser" custom-filter="customFilter"></luid-user-picker>');
	// 		$scope.customFilter = function(user) { // only user with even id
	// 			return user.id % 2 === 0;
	// 		};
	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();

	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users);
	// 	});

	// 	it("should call $scope.customFilter N times", function(){
	// 		spyOn($scope, 'customFilter').and.callThrough();
	// 		isolateScope.find();
	// 		// TODO_ANAIS make it work
	// 		// expect($scope.customFilter).toHaveBeenCalled();
	// 		// expect($scope.customFilter.calls.count()).toBe(4);
	// 	});
	// 	it("should display all when customFilter returns true", function(){
	// 		spyOn($scope, 'customFilter').and.returnValue(true); // all users
	// 		isolateScope.find();
	// 		// TODO_ANAIS make it work
	// 		// expect(isolateScope.users.length).toBe(4);
	// 	});
	// 	it("should display nothing when customFilter returns false", function(){
	// 		spyOn($scope, 'customFilter').and.returnValue(false); // no users
	// 		isolateScope.find();
	// 		// TODO_ANAIS make it work
	// 		// expect(isolateScope.users.length).toBe(0);
	// 	});
	// 	it("should display the right results", function(){
	// 		spyOn($scope, 'customFilter').and.callThrough(); // 2 users
	// 		isolateScope.find();
	// 		// TODO_ANAIS make it work
	// 		// expect(isolateScope.users.length).toBe(the right number, i guess 2);
	// 	});
	// });

	// TODO
	/**********************
	** OPERATION SCOPE   **
	**********************/
	// describe("with filtering on an operation scope", function(){
	// 	var findApiWithClue = /api\/v3\/users\/find\?\&clue=/;
	// 	var findApiWithoutClue = /api\/v3\/users\/find\?/;
	// 	var standardFilters = /formerEmployees=false\&limit=\d*/;
	// 	// TODO_ANAIS change regex so it works, it should look something like that
	// 	// var standardFilters = /formerEmployees=false\&limit=\d*\&applicationId=\d*\&operations=1,2,3/;
	// 	beforeEach(function(){
	// 		// TODO_ANAIS change the html template
	// 		var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();
	// 	});
	// 	it('should call the api with the right filters when isolateScope.find("clue") is called', function(){
	// 		// no clue
	// 		$httpBackend.expectGET(new RegExp(findApiWithoutClue.source + standardFilters.source)).respond(200, RESPONSE_0_users);
	// 		isolateScope.find();
	// 		$httpBackend.flush();
	// 		// a clue
	// 		var clues = ['a', 'ismael', 'zanzibar'];
	// 		_.each(clues, function(clue){
	// 			$httpBackend.expectGET(new RegExp(findApiWithClue.source + clue + (/\&/).source + standardFilters.source)).respond(200, RESPONSE_0_users);
	// 			isolateScope.find(clue);
	// 			$httpBackend.flush();
	// 		});
	// 	});
	// });

	// TODO
	/**********************
	** HOMONYMS          **
	**********************/
	// describe("with homonyms", function(){
	// 	beforeEach(function(){
	// 		var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();

	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_homonyms);
	// 		isolateScope.find();
	// 		$httpBackend.flush();
	// 	});
	// 	it('should detect there are homonyms', function(){
	// 		// TODO_ANAIS
	// 		// here you could check that there is at least one user with the flag hasHomonyms
	// 		// expect(_.findWhere($scope.users, {hasHomonyms:true})).toBeTruthy();
	// 	});
	// 	it('should flag the homonyms', function(){
	// 		// TODO_ANAIS
	// 		// here you check that the homonyms you sent back in the api response are flagged as homonyms
	// 		var homonymIds = _.chain($scope.users)
	// 		.where({hasHomonyms:true}) // keep only the one having an homonym
	// 		.pluck('id') // just keep their id
	// 		.value();
	// 		// expect(homonymIds).toBeTruthy([1,2,3]);
	// 	});
	// 	it('should fetch additional info for these homonyms via the right api', function(){
	// 		$httpBackend.expectGET(/api\/v3\/users\?id=1,2,3\&fields=.*/i).respond(200, RESPONSE_homonyms_details);

	// 		// TODO_ANAIS
	// 		// expect($httpBackend.flush).not.toThrow();
	// 	});
	// 	it('should handle errors when getting homonyms details', function(){
	// 		$httpBackend.expectGET(/api\/v3\/users\?id=1,2,3\&fields=.*/i).respond(500, RESPONSE_ERROR_DETAILS);

	// 		// TODO_ANAIS - test the error was handled
	// 	});
	// 	it('should identify the differentiating properties', function(){
	// 		// TODO_ANAIS
	// 		// $httpBackend.expectGET(/api\/v3\/users\?id=1,2,3\&fields=.*/i).respond(RESPONSE_homonyms_details);
	// 		// $httpBackend.flush();

	// 		// expect(isolateScope.properties.length).toBe(the right number);
	// 		// expect(isolateScope.properties[0]).toBe(the right one);
	// 		// expect(isolateScope.properties[1]).toBe(the right one);
	// 		// etc...
	// 	});
	// });

	// TODO
	/**********************
	** HOMONYMS WITH     **
	** CUSTOM PROPERTIES **
	**********************/
	// describe("with homonyms and custom properties", function(){
	// 	beforeEach(function(){
	// 		// TODO_ANAIS - change template
	// 		var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();

	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_homonyms);
	// 		isolateScope.find();
	// 		$httpBackend.flush();
	// 	});
	// 	it('should fetch additional info for these homonyms via the right api', function(){
	// 		// TODO_ANAIS - update regex for the custom properties you ask
	// 		// $httpBackend.expectGET(/api\/v3\/users\?id=1,2,3\&fields=.*/i).respond(RESPONSE_homonyms_details);

	// 		// expect($httpBackend.flush).not.toThrow();
	// 	});
	// 	// Don't need to test anything else, it is handled by the same cogs as standard homonyms treatment
	// });

	// TODO
	/**********************
	** MULTISELECT       **
	**********************/
	// describe("handling multi-select", function(){
	// 	beforeEach(function(){
	// 		var tpl = angular.element('<luid-user-picker-multiple ng-model="myUsers"></luid-user-picker-multiple>');
	// 		// TODO_ANAIS fill this with some of the users from RESPONSE_4_users and one from another response
	// 		$scope.users = [];

	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();

	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users);
	// 		isolateScope.find();
	// 		$httpBackend.flush();
	// 	});
	// 	it("should have removed from isolateScope.users the ones from $scope.users to avoid displaying an already selected user", function(){
	// 		// TODO_ANAIS
	// 		// _.each($scope.users, function(user){
	// 		// 	expect(_.findWhere(isolateScope.users, {id:user.id})).not.toBeTruthy();
	// 		// });
	// 	});
	// });
	// describe("handling multi-select interracting with", function(){
	// 	beforeEach(function(){
	// 		var tpl = angular.element('<luid-user-picker-multiple ng-model="myUsers"></luid-user-picker-multiple>');
	// 		$scope.users = [];

	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();

	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users);
	// 		isolateScope.find();
	// 		$httpBackend.flush();
	// 	});
	// 	describe("the list of displayed users", function(){
	// 		it("onSelect should update isolateScope.users to always display 5 choices or less", function(){});
	// 		it("onRemove should update isolateScope.users to always display 5 choices or less", function(){});
	// 	});
	// 	describe("pagination", function(){
	// 		it("onSelect should update the pagination label", function(){});
	// 		it("onRemove should update the pagination label", function(){});
	// 	});
	// });

	// TODO
	/**********************
	** MULTISELECT WITH  **
	** HOMONYMS SELECTED **
	**********************/
	// describe("handling multi select with some homonyms thrown in the mix", function(){
	// 	beforeEach(function(){
	// 		var tpl = angular.element('<luid-user-picker-multiple ng-model="myUsers"></luid-user-picker-multiple>');
	// 		// TODO_ANAIS fill this with some of the homonyms (not all) from RESPONSE_4_users_homonyms and one from another response
	// 		// what we want to test here is that the directive can identify homonyms when some are in the response and some in the selected users
	// 		$scope.users = [];

	// 		elt = $compile(tpl)($scope);
	// 		isolateScope = elt.isolateScope();
	// 		$scope.$digest();

	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_homonyms);
	// 		isolateScope.find();
	// 		$httpBackend.flush();
	// 	});
	// 	it("should flag homonyms from $scope.users union isolateScope.users ", function(){

	// 	});
	// });



	// responses from api
	var RESPONSE_userWhoseNameBeginsWithBe = {"header":{},"data":{"items":[{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin","employeeNumber":"3","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":416,"firstName":"Benoit","lastName":"Paugam","employeeNumber":"00057","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":421,"firstName":"Lucien","lastName":"Bertin","employeeNumber":"00068","mail":"no-reply@lucca.fr","dtContractEnd":null}]}};
	var RESPONSE_initWithoutFormerEmployees = {"header":{},"data":{"items":[{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"id":353,"name":"Guillaume Allain","firstName":"Guillaume","lastName":"Allain"}]}};
	var RESPONSE_initCount = {"header":{},"data":{"count":51,"items":[]}};
	//var RESPONSE_initWithFormerEmployees = {"header":{},"data":{"items":[{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":324,"name":"Administrateur Administrateur","firstName":"Administrateur","lastName":"Administrateur"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":330,"name":"Catherine Foliot","firstName":"Catherine","lastName":"Foliot"},{"id":331,"name":"Catherine Lenzi","firstName":"Catherine","lastName":"Lenzi"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":340,"name":"Olivier Ducros","firstName":"Olivier","lastName":"Ducros"},{"id":342,"name":"Olivier Ducros","firstName":"Olivier","lastName":"Ducros"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"id":348,"name":"Aurélien Bottazini","firstName":"Aurélien","lastName":"Bottazini"},{"id":352,"name":"Régis de Germay","firstName":"Régis","lastName":"de Germay"}]}};


	// TODO_ANAIS - fill the mocked api response
	// N users, no former employees, no homonyms
	var RESPONSE_0_users = {header:{}, data:{items:[]}};
	var RESPONSE_4_users = {"header":{},"data":{"items":[{"id":1,"firstName":"Guillaume","lastName":"Allain"},{"id":2,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":3,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":4,"firstName":"Clément","lastName":"Barbotin"}]}};
	var RESPONSE_20_users = {"header":{},"data":{"items":[{"id":1,"firstName":"Guillaume","lastName":"Allain"},{"id":2,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":3,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":4,"firstName":"Clément","lastName":"Barbotin"},{"id":5,"firstName":"Lucien","lastName":"Bertin"},{"id":6,"firstName":"Jean-Baptiste","lastName":"Beuzelin"},{"id":7,"firstName":"Kevin","lastName":"Brochet"},{"id":8,"firstName":"Alex","lastName":"Carpentieri"},{"id":9,"firstName":"Bruno","lastName":"Catteau"},{"id":10,"firstName":"Orion","lastName":"Charlier"},{"id":11,"firstName":"Sandrine","lastName":"Conraux"},{"id":12,"firstName":"Tristan","lastName":"Couëtoux du Tertre"},{"id":13,"firstName":"Patrick","lastName":"Dai"},{"id":14,"firstName":"Larissa","lastName":"De Andrade Gaulia"},{"id":15,"firstName":"Christophe","lastName":"Demarle"},{"id":16,"firstName":"Manon","lastName":"Desbordes"},{"id":17,"firstName":"Nicolas","lastName":"Faugout"},{"id":18,"firstName":"Brice","lastName":"Francois"},{"id":19,"firstName":"Tristan","lastName":"Goguillot"},{"id":20,"firstName":"Julia","lastName":"Ivanets"}]}};

	// N users, SOME former employees, no homonyms
	var RESPONSE_4_users_FE = {header:{}, data:{items:[{"id": 1,"firstName": "Frédéric","lastName": "Pot","dtContractEnd": null},{"id": 2,"firstName": "Catherine","lastName": "Foliot","dtContractEnd": "2003-06-30T00:00:00"},{"id": 3,"firstName": "Catherine","lastName": "Lenzi","dtContractEnd": "2003-04-28T00:00:00"},{"id": 4,"firstName": "Bruno","lastName": "Catteau","dtContractEnd": null}]}};
	var RESPONSE_20_users_FE = {header:{}, data:{items:[]}};

	// N users, no former employees, SOME homonyms
	var RESPONSE_4_users_homonyms = {header:{}, data:{items:[]}};
	var RESPONSE_20_users_homonyms = {header:{}, data:{items:[]}};

	// N users, SOME former employees, SOME homonyms
	var RESPONSE_4_users_FE_homonyms = {header:{}, data:{items:[]}};
	var RESPONSE_20_users_FE_homonyms = {header:{}, data:{items:[]}};

	// Details on homonyms
	var RESPONSE_homonyms_details = {header:{}, data:{items:[]}};

	// count
	var RESPONSE_find_count = {header:{}, data:{}};
	// Errors
	var RESPONSE_ERROR_FIND = {Message:"error_find"};
	var RESPONSE_ERROR_COUNT = {Message:"error_count"};
	var RESPONSE_ERROR_DETAILS = {Message:"error_details"};
});

