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
		var findApiWithClue = /api\/v3\/users\/find\?clue=/;
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

			users = [{"id":1,"firstName":"Guillaume","lastName":"Allain"},{"id":2,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":3,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":4,"firstName":"Clément","lastName":"Barbotin"}];
			expect(angular.equals(isolateScope.users, users)).toBe(true);
		});
		it('should handle errors', function(){
			$httpBackend.expectGET(findApi).respond(500, RESPONSE_ERROR_FIND);
			isolateScope.find();
			$httpBackend.flush();

			users = [{"overflow":"VAR_TRAD Nous n'avons pas réussi à récupérer les utilisateurs correspondant à votre requête. Tant pis !"}]
			expect(angular.equals(isolateScope.users, users)).toBe(true);
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

			var overflow = {overflow: "5/20"};
			expect(isolateScope.count).toBe(20);
			expect(isolateScope.users.length).toBe(6); // 5 first users + overflow message ==> 6 items
			expect(angular.equals(_.last(isolateScope.users), overflow)).toBe(true);
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
		var findApiWithClue = /api\/v3\/users\/find\?clue=/;
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

			var formerEmployeeIds = _.chain(isolateScope.users)
			.where({isFormerEmployee:true}) // keep only the ones tagged as 'former employee'
			.pluck('id') // just keep their id
			.value();
			expect(formerEmployeeIds).toEqual([2,3]);
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
	/* BASIC CASE: 2 homonyms */
	describe("with 2 homonyms", function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();

			$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_2_homonyms);
			isolateScope.find();
		});
		it('should detect there are homonyms', function(){
			// Should throw because GET /api/v3/users/id=1,3&fields=... is expected, but as we only want to check that homonyms have been tagged, we do not care about calling the api for more info
			expect($httpBackend.flush).toThrow();
			// There is at least one user with the flag hasHomonyms
			expect(_.findWhere(isolateScope.users, {hasHomonyms:true})).toBeTruthy();
		});
		it('should flag the homonyms', function(){
			// Should throw because GET /api/v3/users/id=1,3&fields=... is expected, but as we only want to check that homonyms have been tagged, we do not care about calling the api for more info
			expect($httpBackend.flush).toThrow();
			// Check that the homonyms sent back in the api response are flagged as homonyms
			var homonymIds = _.chain(isolateScope.users)
			.where({hasHomonyms:true}) // keep only the one having an homonym
			.pluck('id') // just keep their id
			.value();
			expect(homonymIds).toEqual([1,3]);
		});
		it('should fetch additional info for these homonyms via the right api', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(200, RESPONSE_2_homonyms_details_0_1);
			expect($httpBackend.flush).not.toThrow();
		});
		it('should fetch additional info for these homonyms and add the properties to the users', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(200, RESPONSE_2_homonyms_details_0_1);
			$httpBackend.flush();

			users = [{"id":1,"firstName":"Lucien","lastName":"Bertin","hasHomonyms":true,"mail":"no-reply@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca UK"},"department":{"name":"BU Timmi/Lucca"}},{"id":3,"firstName":"Lucien","lastName":"Bertin","hasHomonyms":true,"mail":"no-reply@lucca.fr","employeeNumber":110,"legalEntity":{"name":"Lucca"},"department":{"name":"Sales"}}];
			var homonyms = _.where(isolateScope.users, {hasHomonyms:true}); // keep only the one having an homonym
			expect(angular.equals(users, homonyms)).toBe(true);
		});
		it('should handle errors when getting homonyms details', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(500, RESPONSE_ERROR_DETAILS);

			// TODO_ANAIS - test the error was handled
		});
		it('should identify the first and second property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(RESPONSE_2_homonyms_details_0_1);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0]).toBe("department.name");
			expect(isolateScope.displayedProperties[1]).toBe("legalEntity.name");
		});
		it('should identify the first and last property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(RESPONSE_2_homonyms_details_0_3);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0]).toBe("department.name");
			expect(isolateScope.displayedProperties[1]).toBe("mail");
		});
	});

	/* COMPLEX CASE: more than 2 homonyms */
	describe("with 4 homonyms", function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();

			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users_4_homonyms);
			isolateScope.find();
		});
		it('should identify the first and third property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=5,8,13,16\&fields=.*/i).respond(RESPONSE_4_homonyms_details_0_2);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0]).toBe("department.name");
			expect(isolateScope.displayedProperties[1]).toBe("employeeNumber");
		});
		it('should identify the first and second property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=5,8,13,16\&fields=.*/i).respond(RESPONSE_4_homonyms_details_0_1);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0]).toBe("department.name");
			expect(isolateScope.displayedProperties[1]).toBe("legalEntity.name");
		});
		it('should identify the second and third property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=5,8,13,16\&fields=.*/i).respond(RESPONSE_4_homonyms_details_1_2);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0]).toBe("legalEntity.name");
			expect(isolateScope.displayedProperties[1]).toBe("employeeNumber");
		});
	});

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
	var RESPONSE_4_users_2_homonyms = {"header":{},"data":{"items":[{"id":1,"firstName":"Lucien","lastName":"Bertin"},{"id":2,"firstName":"Jean-Baptiste","lastName":"Beuzelin"},{"id":3,"firstName":"Lucien","lastName":"Bertin"},{"id":4,"firstName":"Benoit","lastName":"Paugam"}]}};
	var RESPONSE_20_users_4_homonyms = {"header":{},"data":{"items":[{"id":1,"firstName":"Guillaume","lastName":"Allain"},{"id":2,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":3,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":4,"firstName":"Clément","lastName":"Barbotin"},{"id":5,"firstName":"Lucien","lastName":"Bertin"},{"id":6,"firstName":"Jean-Baptiste","lastName":"Beuzelin"},{"id":7,"firstName":"Kevin","lastName":"Brochet"},{"id":8,"firstName":"Lucien","lastName":"Bertin"},{"id":9,"firstName":"Bruno","lastName":"Catteau"},{"id":10,"firstName":"Orion","lastName":"Charlier"},{"id":11,"firstName":"Sandrine","lastName":"Conraux"},{"id":12,"firstName":"Tristan","lastName":"Couëtoux du Tertre"},{"id":13,"firstName":"Lucien","lastName":"Bertin"},{"id":14,"firstName":"Larissa","lastName":"De Andrade Gaulia"},{"id":15,"firstName":"Christophe","lastName":"Demarle"},{"id":16,"firstName":"Lucien","lastName":"Bertin"},{"id":17,"firstName":"Nicolas","lastName":"Faugout"},{"id":18,"firstName":"Brice","lastName":"Francois"},{"id":19,"firstName":"Tristan","lastName":"Goguillot"},{"id":20,"firstName":"Julia","lastName":"Ivanets"}]}};

	// N users, SOME former employees, SOME homonyms
	var RESPONSE_4_users_FE_homonyms = {header:{}, data:{items:[]}};
	var RESPONSE_20_users_FE_homonyms = {header:{}, data:{items:[]}};

	// Details on homonyms
	// When 2 homonyms
	var RESPONSE_2_homonyms_details_0_1 = {header:{}, data:{items:[{"id":1,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca UK"},"department":{"name":"BU Timmi/Lucca"}},{"id":3,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":110,"legalEntity":{"name":"Lucca"},"department":{"name":"Sales"}}]}};
	var RESPONSE_2_homonyms_details_0_3 = {header:{}, data:{items:[{"id":1,"firstName":"Lucien","lastName":"Bertin","mail":"lbertin@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca"},"department":{"name":"BU Timmi/Lucca"}},{"id":3,"firstName":"Lucien","lastName":"Bertin","mail":"lbertin2@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca"},"department":{"name":"Sales"}}]}};
	// When 4 homonyms
	var RESPONSE_4_homonyms_details_0_2 = {header:{}, data:{items:[{"id":5,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca UK"},"department":{"name":"BU Timmi/Lucca"}},{"id":8,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":110,"legalEntity":{"name":"Lucca"},"department":{"name":"BU Timmi/Lucca"}},{"id":13,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":163,"legalEntity":{"name":"Lucca UK"},"department":{"name":"BU Timmi/Lucca"}},{"id":16,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":145,"legalEntity":{"name":"Lucca UK"},"department":{"name":"Marketing"}}]}};
	var RESPONSE_4_homonyms_details_0_1 = {header:{}, data:{items:[{"id":5,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca UK"},"department":{"name":"BU Timmi/Lucca"}},{"id":8,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":110,"legalEntity":{"name":"Lucca"},"department":{"name":"BU Timmi/Lucca"}},{"id":13,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":163,"legalEntity":{"name":"Lucca UK"},"department":{"name":"Sales"}},{"id":16,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":145,"legalEntity":{"name":"Lucca"},"department":{"name":"Sales"}}]}};
	var RESPONSE_4_homonyms_details_1_2 = {header:{}, data:{items:[{"id":5,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca"},"department":{"name":"BU Timmi/Lucca"}},{"id":8,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":110,"legalEntity":{"name":"Lucca"},"department":{"name":"BU Timmi/Lucca"}},{"id":13,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca UK"},"department":{"name":"BU Timmi/Lucca"}},{"id":16,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":145,"legalEntity":{"name":"Lucca UK"},"department":{"name":"Sales"}}]}};

	// count
	var RESPONSE_find_count = {header:{}, data:{}};
	// Errors
	var RESPONSE_ERROR_FIND = {Message:"error_find"};
	var RESPONSE_ERROR_COUNT = {Message:"error_count"};
	var RESPONSE_ERROR_DETAILS = {Message:"error_details"};
});

