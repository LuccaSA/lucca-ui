describe('luidUserPicker', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var _, $scope, isolateScope, $compile, elt, $httpBackend, controller, moment, $timeout;
	var users;

	beforeEach(inject(function (_$rootScope_, _$compile_, ___, _$httpBackend_, _moment_, _$timeout_) {
		_ = ___;
		$scope = _$rootScope_.$new();
		$httpBackend = _$httpBackend_;
		$timeout = _$timeout_;
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
			isolateScope.find();
			$httpBackend.expectGET('/api/v3/users/find?formerEmployees=false&limit=6').respond(200, RESPONSE_initWithoutFormerEmployees);
		});
		it('should initialise users', function(){
			$httpBackend.flush();
			expect(isolateScope.users).toBeDefined();
		});
		it('should initialise users with the 5 first users returned by the api', function() {
			users = [{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"overflow":"5/..."}];
			$httpBackend.flush();
			expect(angular.equals(isolateScope.users, users)).toBe(true);
		});

		describe('with pagination', function() {
			beforeEach(function() {
				$httpBackend.flush();
				$timeout.flush();
				//$httpBackend.expectGET('/api/v3/users/find?formerEmployees=false&limit=6').respond(200, RESPONSE_initWithoutFormerEmployees);
			});
			it('should get the number of users', function() {

			});
		});
});

// responses from api
var RESPONSE_userWhoseNameBeginsWithBe = {"header":{},"data":{"items":[{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin","employeeNumber":"3","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":416,"firstName":"Benoit","lastName":"Paugam","employeeNumber":"00057","mail":"no-reply@lucca.fr","dtContractEnd":null},{"id":421,"firstName":"Lucien","lastName":"Bertin","employeeNumber":"00068","mail":"no-reply@lucca.fr","dtContractEnd":null}]}};
var RESPONSE_initWithoutFormerEmployees = {"header":{},"data":{"items":[{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"id":353,"name":"Guillaume Allain","firstName":"Guillaume","lastName":"Allain"}]}};
var RESPONSE_initCount = {"header":{},"data":{"count":51,"items":[]}};
//var RESPONSE_initWithFormerEmployees = {"header":{},"data":{"items":[{"id":0,"name":"Lucca Admin","firstName":"Lucca","lastName":"Admin"},{"id":324,"name":"Administrateur Administrateur","firstName":"Administrateur","lastName":"Administrateur"},{"id":328,"name":"Gilles Satgé","firstName":"Gilles","lastName":"Satgé"},{"id":329,"name":"Frédéric Pot","firstName":"Frédéric","lastName":"Pot"},{"id":330,"name":"Catherine Foliot","firstName":"Catherine","lastName":"Foliot"},{"id":331,"name":"Catherine Lenzi","firstName":"Catherine","lastName":"Lenzi"},{"id":338,"name":"Bruno Catteau","firstName":"Bruno","lastName":"Catteau"},{"id":340,"name":"Olivier Ducros","firstName":"Olivier","lastName":"Ducros"},{"id":342,"name":"Olivier Ducros","firstName":"Olivier","lastName":"Ducros"},{"id":344,"name":"Nicolas Faugout","firstName":"Nicolas","lastName":"Faugout"},{"id":348,"name":"Aurélien Bottazini","firstName":"Aurélien","lastName":"Bottazini"},{"id":352,"name":"Régis de Germay","firstName":"Régis","lastName":"de Germay"}]}};
});

