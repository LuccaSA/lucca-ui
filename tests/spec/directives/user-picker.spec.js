describe('luidUserPicker', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var _, $scope, isolateScope, $compile, elt, $httpBackend, controller, moment;
	var users;

	beforeEach(inject(function (_$rootScope_, _$compile_, ___, _$httpBackend_, _moment_) {
		_ = ___;
		$scope = _$rootScope_.$new();
		$httpBackend = _$httpBackend_;
		$compile = _$compile_;
		moment = _moment_;
		$scope.customFilter = function(params) {
			var users = _.filter(params, function (item, index) {
				return index % 2 === 0;
			});
			return users;
		};
	}));

	describe('most basic-est use', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			elt = $compile(tpl)($scope);
			isolateScope = elt.isolateScope();
			controller = elt.controller;
			$scope.$digest();
		});
		it('should initialize users', function(){
			isolateScope.find();
			$httpBackend.expectGET('/api/v3/users/find?formerEmployees=false&limit=6').respond(200, RESPONSE_initWithoutFormerEmployees);
			$httpBackend.flush();
			expect(isolateScope.users).toBeDefined();
		});
		// it('should initialize users with the 5 first users returned by the api', function() {
		// 	users = [{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"overflow":"5/12"}];
		// 	$httpBackend.flush();
		// 	expect(angular.equals(isolateScope.users, users)).toBe(true);
		// });

		// describe('when an input is given', function() {
		// 	beforeEach(function() {
		// 		$httpBackend.flush();
		// 		isolateScope.find('be');
		// 	});
		// 	it('should get the users whose name begins with \'be\'', function() {
		// 		users = [{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin","employeeNumber":"3","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":416,"firstName":"Benoit","lastName":"Paugam","employeeNumber":"00057","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":421,"firstName":"Lucien","lastName":"Bertin","employeeNumber":"00068","mail":"no-reply@lucca.fr","dtContractEnd":null}];
		// 		$httpBackend.expectGET('/api/v3/users/find?clue=be&limit=6').respond(200, RESPONSE_userWhoseNameBeginsWithBe);				
		// 		$httpBackend.flush();
		// 		expect(isolateScope.users).toBeDefined();
		// 	});
		// });
});

// describe('with show-former-employees set to true', function() {
// 	beforeEach(function(){
// 		var tpl = angular.element('<luid-user-picker ng-model="myUser" show-former-employees="true"></luid-user-picker>');
// 		elt = $compile(tpl)($scope);
// 		isolateScope = elt.isolateScope();
// 		controller = elt.controller;
// 			//$httpBackend.expectGET('/api/v3/users/find?clue=be').respond(200, RESPONSE_userWhoseNameBeginsWithBe);
// 			$httpBackend.expectGET('/api/v3/users?fields=id,name,firstname,lastname,collection.count').respond(200, RESPONSE_initWithFormerEmployees);
// 			$scope.$digest();
// 		});
// 	it('should get the first 5 users', function() {
// 		users = [{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":324,"name":"Administrateur Administrateur","firstName":"Administrateur","lastName":"Administrateur"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":330,"name":"Catherine Foliot","firstName":"Catherine","lastName":"Foliot"},{"overflow":"5/12"}];
// 		$httpBackend.flush();
// 		expect(angular.equals(isolateScope.users, users)).toBe(true);
// 	});
// });

// describe('with custom post filter', function() {
// 	beforeEach(function(){
// 		var tpl = angular.element('<luid-user-picker ng-model="myUser" use-custom-filter="true" custom-filter="customFilter(users)"></luid-user-picker>');
// 		elt = $compile(tpl)($scope);
// 		isolateScope = elt.isolateScope();
// 		controller = elt.controller;
// 		$httpBackend.expectGET('/api/v3/users?fields=id,name,firstname,lastname,collection.count&dtcontractend=since,' + moment().format('YYYY-MM-DD') + ',null').respond(200, RESPONSE_initWithoutFormerEmployees);
// 		$scope.$digest();
// 	});
// 	it('should get the first 5 users', function() {
// 		users = [{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"id":355,"name":"CECILE Meozzi da Costa","firstName":"CECILE","lastName":"Meozzi da Costa"},{"id":361,"name":"Tim Stubbs","firstName":"Tim","lastName":"Stubbs"},{"overflow":"5/6"}];
// 		$httpBackend.flush();
// 		expect(angular.equals(isolateScope.users, users)).toBe(true);
// 	});
// });

// describe('with show-former-employees set to true and custom post filter', function() {
// 	beforeEach(function(){
// 		var tpl = angular.element('<luid-user-picker ng-model="myUser" show-former-employees="true" use-custom-filter="true" custom-filter="customFilter(users)"></luid-user-picker>');
// 		elt = $compile(tpl)($scope);
// 		isolateScope = elt.isolateScope();
// 		controller = elt.controller;
// 		$httpBackend.expectGET('/api/v3/users?fields=id,name,firstname,lastname,collection.count').respond(200, RESPONSE_initWithFormerEmployees);
// 		$scope.$digest();
// 	});
// 	it('should get the first 5 users', function() {
// 		users = [{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":330,"name":"Catherine Foliot","firstName":"Catherine","lastName":"Foliot"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":342,"name":"Olivier Ducros","firstName":"Olivier","lastName":"Ducros"},{"overflow":"5/6"}];
// 		$httpBackend.flush();
// 		expect(angular.equals(isolateScope.users, users)).toBe(true);
// 	});
// });

// responses from api
var RESPONSE_userWhoseNameBeginsWithBe = {"header":{},"data":{"items":[{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin","employeeNumber":"3","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":416,"firstName":"Benoit","lastName":"Paugam","employeeNumber":"00057","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":421,"firstName":"Lucien","lastName":"Bertin","employeeNumber":"00068","mail":"no-reply@lucca.fr","dtContractEnd":null}]}};
var RESPONSE_initWithoutFormerEmployees = {"header":{},"data":{"count":12,"items":[{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"id":353,"name":"Guillaume Allain","firstName":"Guillaume","lastName":"Allain"},{"id":355,"name":"CECILE Meozzi da Costa","firstName":"CECILE","lastName":"Meozzi da Costa"},{"id":360,"name":"Clotilde Martin-Lemerle","firstName":"Clotilde","lastName":"Martin-Lemerle"},{"id":361,"name":"Tim Stubbs","firstName":"Tim","lastName":"Stubbs"},{"id":376,"name":"Vincent Porcel","firstName":"Vincent","lastName":"Porcel"},{"id":377,"name":"Claire Le Parco","firstName":"Claire","lastName":"Le Parco"},{"id":379,"name":"Romain Vergnory","firstName":"Romain","lastName":"Vergnory"}]}};
var RESPONSE_initWithFormerEmployees = {"header":{},"data":{"count":12,"items":[{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":324,"name":"Administrateur Administrateur","firstName":"Administrateur","lastName":"Administrateur"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":330,"name":"Catherine Foliot","firstName":"Catherine","lastName":"Foliot"},{"id":331,"name":"Catherine Lenzi","firstName":"Catherine","lastName":"Lenzi"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":340,"name":"Olivier Ducros","firstName":"Olivier","lastName":"Ducros"},{"id":342,"name":"Olivier Ducros","firstName":"Olivier","lastName":"Ducros"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"id":348,"name":"Aurélien Bottazini","firstName":"Aurélien","lastName":"Bottazini"},{"id":352,"name":"Régis de Germay","firstName":"Régis","lastName":"de Germay"}]}};
});

