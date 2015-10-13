describe('luidUserPicker', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var _, $scope, isolateScope, $compile, elt;
	beforeEach(inject(function (_$rootScope_, _$compile_, ___) {
		_ = ___;
		$scope = _$rootScope_.$new();
		$compile = _$compile_;
	}));
	describe('most basic-est use', function(){
		beforeEach(function(){
			// var tpl = angular.element('<luid-user-picker ng-model="myUser"></luid-user-picker>');
			// elt = $compile(tpl)($scope);
			// $scope.$digest();
			// isolateScope = elt.isolateScope();
		});
		it('first test whatevs', function(){
			expect(_.first([1,2])).toEqual(1);
			// expect(_.first([1,2])).toEqual(2);
		});
		it('second test whatevs', function(){
			// expect(_.first([1,2])).toEqual(1);
			// expect(_.first([1,2])).toEqual(2);
			// isolateScope.find("asdasd")
		});
	});

});