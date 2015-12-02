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

			usersIds = [1,2,3,4];
			expect(angular.equals(_.pluck(isolateScope.users, 'id'), usersIds)).toBe(true);
		});
		it('should handle errors', function(){
			spyOn(console,'log');
			$httpBackend.expectGET(findApi).respond(500, RESPONSE_ERROR_FIND);
			isolateScope.find();
			$httpBackend.flush();

			expect(isolateScope.users[0].overflow).toEqual("LUIDUSERPICKER_ERR_GET_USERS");
			expect(console.log).toHaveBeenCalled();
		});
	});

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

			var overflow = {overflow: "5/20", id:-1};
			expect(isolateScope.count).toBe(20);
			expect(isolateScope.users.length).toBe(6); // 5 first users + overflow message ==> 6 items
			var overflowMessage = _.last(isolateScope.users);
			expect(overflowMessage.overflow).toEqual("LUIDUSERPICKER_OVERFLOW");
			expect(overflowMessage.cnt).toEqual(5);
			expect(overflowMessage.all).toEqual(20);
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

	/**********************
	** CUSTOM FILTERING  **
	**********************/
	describe("with custom filtering", function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser" custom-filter="customFilter"></luid-user-picker>');
			$scope.customFilter = function(user) { // only user with even id
				return user.id % 2 === 0;
			};
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			controller = elt.controller("luidUserPicker");
			$scope.$digest();

			$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users);
		});
		it("should initialise useCustomFilter", function(){
			expect(controller.useCustomFilter).toBe(true);
		});
		it("should call $scope.customFilter N times", function(){
			spyOn($scope, 'customFilter').and.callThrough();
			isolateScope.find();
			$httpBackend.flush();
			expect($scope.customFilter).toHaveBeenCalled();
			expect($scope.customFilter.calls.count()).toBe(4);
		});
		it("should display all when customFilter returns true", function(){
			spyOn($scope, 'customFilter').and.returnValue(true); // all users
			isolateScope.find();
			$httpBackend.flush();
			expect(isolateScope.users.length).toBe(4);
		});
		it("should display nothing when customFilter returns false", function(){
			spyOn($scope, 'customFilter').and.returnValue(false); // no users
			isolateScope.find();
			$httpBackend.flush();
			expect(isolateScope.users.length).toBe(0);
		});
		it("should filter the right results", function(){
			spyOn($scope, 'customFilter').and.callThrough();
			isolateScope.find();
			$httpBackend.flush();
			expect(isolateScope.users.length).toBe(2);
			var ids = _.chain(isolateScope.users).pluck('id').value();
			expect(ids).toEqual([2, 4]);
		});
	});

	/**********************
	** OPERATION SCOPE   **
	**********************/
	describe("with filtering on an operation scope", function(){
		var findApiWithClue = /api\/v3\/users\/find\?clue=/;
		var findApiWithoutClue = /api\/v3\/users\/find\?/;
		var standardFilters = /formerEmployees=false\&limit=\d*/;
		var operationsFilters = /\&appinstanceid=86\&operations=1,2,3/;
		
		beforeEach(function(){
			$scope.ops = [1,2,3];
			$scope.appId = 86;
			var tpl = angular.element('<luid-user-picker ng-model="myUser" app-id="appId" operations="ops"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();
		});
		it('should call the api with the right filters when isolateScope.find("clue") is called', function(){
			// no clue
			$httpBackend.expectGET(new RegExp(findApiWithoutClue.source + standardFilters.source + operationsFilters.source)).respond(200, RESPONSE_0_users);
			isolateScope.find();
			$httpBackend.flush();
			// a clue
			var clues = ['a', 'ismael', 'zanzibar'];
			_.each(clues, function(clue){
				$httpBackend.expectGET(new RegExp(findApiWithClue.source + clue + (/\&/).source + standardFilters.source + operationsFilters.source)).respond(200, RESPONSE_0_users);
				isolateScope.find(clue);
				$httpBackend.flush();
			});
		});
		it('should call not use the operations filter when no operations is provided', function(){
			// no clue
			$httpBackend.expectGET(new RegExp(findApiWithoutClue.source + standardFilters.source)).respond(200, RESPONSE_0_users);
			$scope.ops = [];
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
	});

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

			var homonyms = _.where(isolateScope.users, {hasHomonyms:true}); // keep only the one having an homonym
			expect(angular.equals(RESPONSE_2_homonyms_details_0_1.data.items[0].legalEntity, homonyms[0].legalEntity)).toBe(true);
			// has added the LE to the first homonym
		});
		it('should handle errors when getting homonyms details', function(){
			spyOn(console, 'log');
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(500, RESPONSE_ERROR_DETAILS);

			$httpBackend.flush();
			expect(console.log).toHaveBeenCalled();
		});
		it('should identify the first and second property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(RESPONSE_2_homonyms_details_0_1);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0].name).toBe("department.name");
			expect(isolateScope.displayedProperties[1].name).toBe("legalEntity.name");
		});
		it('should identify the first and last property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(RESPONSE_2_homonyms_details_0_3);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0].name).toBe("department.name");
			expect(isolateScope.displayedProperties[1].name).toBe("mail");
		});
		it('should only identify the third property as differentiating', function() {
			$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(RESPONSE_2_homonyms_details_2);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(1);
			expect(isolateScope.displayedProperties[0].name).toBe("employeeNumber");
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
			expect(isolateScope.displayedProperties[0].name).toBe("department.name");
			expect(isolateScope.displayedProperties[1].name).toBe("employeeNumber");
		});
		it('should identify the first and second property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=5,8,13,16\&fields=.*/i).respond(RESPONSE_4_homonyms_details_0_1);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0].name).toBe("department.name");
			expect(isolateScope.displayedProperties[1].name).toBe("legalEntity.name");
		});
		it('should identify the second and third property as differentiating properties', function(){
			$httpBackend.whenGET(/api\/v3\/users\?id=5,8,13,16\&fields=.*/i).respond(RESPONSE_4_homonyms_details_1_2);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0].name).toBe("legalEntity.name");
			expect(isolateScope.displayedProperties[1].name).toBe("employeeNumber");
		});
	});

	/**********************
	** HOMONYMS WITH     **
	** CUSTOM PROPERTIES **
	**********************/
	describe("with homonyms and custom properties", function(){
		beforeEach(function(){
			$scope.properties= [{
				"label": "Date de naissance",
				"name": "birthDate"
			}, {
				"label": "Email",
				"name": "mail"
			}, {
				"label": "Nom du manager",
				"name": "manager.name"
			}];
			var tpl = angular.element('<luid-user-picker ng-model="myUser" homonyms-properties="properties"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();

			$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_2_homonyms);
			isolateScope.find();
		});
		it('should fetch additional info for these homonyms via the right api', function(){
			$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,birthDate,mail,manager.name/i).respond(RESPONSE_2_homonyms_details_0_2);
			expect($httpBackend.flush).not.toThrow();
		});
		it('should fetch additional info for these homonyms and add the properties to the users', function(){
			$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,birthDate,mail,manager.name/i).respond(RESPONSE_2_homonyms_details_0_2);
			$httpBackend.flush();

			// users = [{"id":1,"firstName":"Lucien","lastName":"Bertin","hasHomonyms":true,"mail":"no-reply@lucca.fr","manager":{"name":"Romain Vergnory"},"birthDate":"1990-12-10T00:00:00"},{"id":3,"firstName":"Lucien","lastName":"Bertin","hasHomonyms":true,"mail":"no-reply@lucca.fr","manager":{"name":"Benoît Paugam"},"birthDate":"1986-03-25T00:00:00"}];
			var homonyms = _.where(isolateScope.users, {hasHomonyms:true}); // keep only the one having an homonym
			expect(angular.equals(RESPONSE_2_homonyms_details_0_2.data.items[0].birthDate, homonyms[0].birthDate)).toBe(true);
		});
		it('should identify the first and third property as differentiating properties', function(){
			$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,birthDate,mail,manager.name/i).respond(RESPONSE_2_homonyms_details_0_2);
			$httpBackend.flush();

			expect(isolateScope.displayedProperties.length).toBe(2);
			expect(isolateScope.displayedProperties[0].name).toBe("birthDate");
			expect(isolateScope.displayedProperties[1].name).toBe("manager.name");
			expect(isolateScope.displayedProperties[0].label).toBe("Date de naissance");
			expect(isolateScope.displayedProperties[1].label).toBe("Nom du manager");
		});

		describe('after updating homonyms-properties', function(){
			beforeEach(function(){
				// flush the response related to the previous request
				$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,birthDate,mail,manager.name/i).respond(RESPONSE_2_homonyms_details_0_2);
				$httpBackend.flush();
			});
			it('should update isolateScope.homonymsProperties with the new value and fetch additional info for the homonyms via the right api', function() {
				// Update the properties
				$scope.properties= [{
					"label": "Entité légale",
					"name": "legalEntity.name"
				}, {
					"label": "Matricule",
					"name": "employeeNumber"
				}];
				// Call find with new properties
				isolateScope.find();
				$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users_2_homonyms);
				// Query updated with new properties
				$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,legalEntity.name,employeeNumber/i).respond(RESPONSE_2_homonyms_details_0_2);
				$httpBackend.flush();
			});
			it('should update isolateScope.homonymsProperties with default properties and fetch additional info for the homonyms via the right api', function() {
				var defaultProperties = [{
					"label": "LUIDUSERPICKER_DEPARTMENT",
					"name": "department.name",
					"icon": "location"
				}, {
					"label": "LUIDUSERPICKER_LEGALENTITY",
					"name": "legalEntity.name",
					"icon": "tree list"
				}, {
					"label": "LUIDUSERPICKER_EMPLOYEENUMBER",
					"name": "employeeNumber",
					"icon": "user"
				}, {
					"label": "LUIDUSERPICKER_MAIL",
					"name": "mail",
					"icon": "email"
				}];
				// Update the properties with an empty array
				$scope.properties= [];
				// Call find with new properties
				isolateScope.find();
				$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users_2_homonyms);
				// Query updated with default properties (since new properties are empty)
				$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,department.name,legalEntity.name,employeeNumber,mail/i).respond(RESPONSE_2_homonyms_details_0_2);
				$httpBackend.flush();
			});
		})
	});

	/*********************
	** CUSTOM INFO SYNC **
	**********************/
	describe("with custom info to display next to each user", function(){
		beforeEach(function(){
			$scope.customCount = function(user) {
				return user.id * 2;
			};
			var tpl = angular.element('<luid-user-picker ng-model="myUser" custom-info="customCount"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			controller = elt.controller('luidUserPicker');
			$scope.$digest();

			spyOn($scope, 'customCount').and.callThrough();
			isolateScope.find();
		});
		it('should initialise useCustomCount', function(){
			expect(controller.displayCustomInfo).toBe(true);
		});
		it("should call $scope.customCount N times when there is no overflow", function(){
			$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users);
			$httpBackend.flush();
			expect($scope.customCount).toHaveBeenCalled();
			expect($scope.customCount.calls.count()).toBe(4);
		});
		it("should call $scope.customCount 5 times when there is overflow", function(){
			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
			$httpBackend.flush();
			expect($scope.customCount).toHaveBeenCalled();
			expect($scope.customCount.calls.count()).toBe(5);
		});
		it('should display the right count', function() {
			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
			$httpBackend.flush();
			var customInfos = _.chain(isolateScope.users)
				.pluck('info')
				.first(5) // we exclude the overflow message
				.value();
			expect(customInfos).toEqual([2,4,6,8,10]);
		});
	});

	/********************************
	** DISPLAY SELECTED USER FIRST **
	********************************/
	describe("with selected user", function(){
		var chloe = { id:3,
			firstName:"Chloé",
			lastName:"Azibert Yekdah"
		};
		var sandrine = { id:11,
			firstName:"Sandrine",
			lastName:"Conraux"
		};
		beforeEach(function(){
			$scope.myUser = chloe;
			var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();
			isolateScope.find();
			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
			$httpBackend.flush();
		});
		it("should call reorderUsers() when myUser is updated", function(){
			spyOn(isolateScope, 'reorderUsers');
			$scope.myUser = sandrine;
			$scope.$digest();

			expect(isolateScope.reorderUsers).toHaveBeenCalled();
		});
		it("should flag if the list of users returned by find contains the current myUser", function(){
			expect(_.where(isolateScope.users, {isSelected:true}).length).toBe(1);
			expect(_.first(isolateScope.users).isSelected).toBe(true);
			expect(_.where(isolateScope.users, {isSelected:true})[0].id).toBe(chloe.id);
		});
		it("should have the right order of displayed users", function(){
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(userIds).toEqual([3,1,2,4,5,-1]); // the -1 is because of the overflow
		});
		it("should update the selected one ", function(){
			$scope.myUser = sandrine;
			$scope.$digest();
			expect(_.where(isolateScope.users, {isSelected:true}).length).toBe(1);
			expect(_.first(isolateScope.users).isSelected).toBe(true);
			expect(_.where(isolateScope.users, {isSelected:true})[0].id).toBe(sandrine.id);
		});
		it("should update the order of users ", function(){
			$scope.myUser = sandrine;
			$scope.$digest();
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(userIds).toEqual([11,1,2,3,4,-1]); // the -1 is because of the overflow
		});
	});

	/***********************
	** DISPLAY ME FIRST   **
	***********************/
	describe("with 'display-me-first' set to true", function(){
		var chloe = { id:3,
			firstName:"Chloé",
			lastName:"Azibert Yekdah"
		};
		var orion = { id:10,
			firstName:"Orion",
			lastName:"Charlier"
		};
		var meApi = /api\/v3\/users\/me/;
		var myId = 10;
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser" display-me-first="true"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();
			isolateScope.find();
			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
			$httpBackend.whenGET(meApi).respond(200, RESPONSE_me); // id: 10
		});
		it('should flag if the list of users returned by find contains "me"', function() {
			$httpBackend.flush();
			expect(_.where(isolateScope.users, {isMe:true}).length).toBe(1);
			expect(_.first(isolateScope.users).isMe).toBe(true);
			expect(_.where(isolateScope.users, {isMe:true})[0].id).toBe(myId);
		});
		it("should have the right order of displayed users when no user is selected", function(){
			$httpBackend.flush();
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(userIds).toEqual([10,1,2,3,4,-1]); // the -1 is because of the overflow
		});
		it('should update the order of users when a user is selected', function() {
			$httpBackend.flush();
			$scope.myUser = chloe;
			$scope.$digest();
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(userIds).toEqual([3,10,1,2,4,-1]); // the -1 is because of the overflow
		});
		it('should not display "me" when the selected user is "me"', function() {
			$httpBackend.flush();
			$scope.myUser = orion;
			$scope.$digest();
			expect(_.where(isolateScope.users, {isMe:true}).length).toBe(0);
		});
		it('should not display "me" when the current user is not fetched', function() {
			$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users); // Users without user.id = 10
			$httpBackend.flush();
			expect(_.where(isolateScope.users, {isMe:true}).length).toBe(0);
		});
		it('should handle errors when getting "me"', function(){
			spyOn(console, 'log');
			$httpBackend.expectGET(meApi).respond(500, RESPONSE_ERROR_DETAILS);
			$httpBackend.flush();
			expect(console.log).toHaveBeenCalled();
		});
	});

	/************************
	** DISPLAY ALL USERS   **
	************************/
	describe("with 'display-all-users' set to true", function(){
		var chloe = { id:3,
			firstName:"Chloé",
			lastName:"Azibert Yekdah"
		};
		var allUsers = { id:-1,
			isAll: true
		};
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser" display-all-users="true"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();
			isolateScope.find();
			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
			$httpBackend.flush();
		});
		it('should display "all users" when find() is called', function() {
			expect(_.where(isolateScope.users, {isAll:true}).length).toBe(1);
			expect(_.first(isolateScope.users).isAll).toBe(true);
		});
		it("should have the right order of displayed users when no user is selected", function() {
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(userIds).toEqual([-1,1,2,3,4,-1]); // the -1 is because of "all users" and overflow
		});
		it('should update the order of users when a user is selected', function() {
			$scope.myUser = chloe;
			$scope.$digest();
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(_.where(isolateScope.users, {isAll:true}).length).toBe(1);
			expect(isolateScope.users[1].isAll).toBe(true);
			expect(userIds).toEqual([3,-1,1,2,4,-1]); // the -1 is because of "all users" and overflow
		});
		it('should not display "selected" when we select "all users"', function() {
			$scope.myUser = allUsers;
			$scope.$digest();
			expect(_.where(isolateScope.users, {isSelected:true}).length).toBe(0);
		});
		it('should not display "all users" when find() is called with a clue', function() {
			isolateScope.find('a');
			$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users);
			$httpBackend.flush();
			expect(_.where(isolateScope.users, {isAll:true}).length).toBe(0);
		});
	});

	/****************************
	** WITH DISPLAY ME FIRST   **
	** AND DISPLAY ALL USERS   **
	*****************************/
	// Only check the order of displayed users with "display-me-first" and "display-all-users"
	// It should be [selected, all, me, rest of users]
	describe("with 'display-me-first' and 'display-all-users' set to true", function(){
		var chloe = { id:3,
			firstName:"Chloé",
			lastName:"Azibert Yekdah"
		};
		var allUsers = { id:-1,
			isAll: true
		};
		var meApi = /api\/v3\/users\/me/;
		var myId = 10;
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser" display-me-first="true" display-all-users="true"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			$scope.$digest();
			isolateScope.find();
			$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
			$httpBackend.whenGET(meApi).respond(200, RESPONSE_me); // id: 10
			$httpBackend.flush();
		});
		it('should display "all users" and "me" when find() is called and "me" is fetched', function() {
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(userIds).toEqual([-1,10,1,2,3,-1]); // the -1 is because of "all users" and overflow
		});
		it('should update the order of users when a user is selected', function() {
			$scope.myUser = chloe;
			$scope.$digest();
			var userIds = _.pluck(isolateScope.users, 'id');
			expect(userIds).toEqual([3,-1,10,1,2,-1]); // the -1 is because of "all users" and overflow
		});
	});

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

	// Me
	var RESPONSE_me = {"header":{},"data":{"id":10}};
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
	var RESPONSE_2_homonyms_details_2 = {header:{}, data:{items:[{"id":1,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":87,"legalEntity":{"name":"Lucca"},"department":{"name":"BU Timmi/Lucca"}},{"id":3,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","employeeNumber":110,"legalEntity":{"name":"Lucca"},"department":{"name":"BU Timmi/Lucca"}}]}};
	// With custom homonyms properties
	var RESPONSE_2_homonyms_details_0_2 = {header:{}, data:{items:[{"id":1,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","manager":{"name":"Romain Vergnory"},"birthDate":"1990-12-10T00:00:00"},{"id":3,"firstName":"Lucien","lastName":"Bertin","mail":"no-reply@lucca.fr","manager":{"name":"Benoît Paugam"},"birthDate":"1986-03-25T00:00:00"}]}};
	// With other custom properties
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
