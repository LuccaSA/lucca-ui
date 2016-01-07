/* global expect */
/* global it */
/* global inject */
/* global beforeEach */
/* global describe */
describe('luidDayBlock', function(){
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var moment, $scope, isolateScope, $compile, $filter, elt, input;
	beforeEach(inject(function (_moment_, _$rootScope_, _$compile_, _$filter_) {
		moment = _moment_;
		$scope = _$rootScope_.$new();
		$compile = _$compile_;
		$filter = _$filter_;
	}));


// Basic bindings checks
describe('most basic-est use', function(){
	beforeEach(function(){
		$scope.date = moment();
		$scope.primaryColor = "red";
		$scope.secondaryColor = "yellow";
		$scope.showDay = true;
		var tpl = angular.element(' <luid-day-block show-day = "showDay" primary-color = "primaryColor" secondary-color = "secondaryColor" date = "date"/>');
		elt = $compile(tpl)($scope);
		$scope.$digest();
		isolateScope = elt.isolateScope();
	});

	it('should compute ng-style overrides', function(){
		expect(isolateScope.controller.weekdayStyleOverride()).toEqual({ color: $scope.primaryColor });
		expect(isolateScope.controller.dayStyleOverride()).toEqual({ color: $scope.secondaryColor, "background-color": $scope.primaryColor, "border-color": $scope.primaryColor });
		expect(isolateScope.controller.monthStyleOverride()).toEqual({ color: $scope.primaryColor, "background-color": $scope.secondaryColor, "border-color": $scope.primaryColor });
		expect(isolateScope.controller.yearStyleOverride()).toEqual({ color: $scope.primaryColor, "background-color": $scope.secondaryColor, "border-color": $scope.primaryColor });
	});
});
});