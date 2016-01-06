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
            $scope.firstColor = "red";
            $scope.secondColor = "yellow";
            $scope.showDay = true;
			var tpl = angular.element(' <luid-day-block show-day = "showDay" first-color = "firstColor" second-color = "secondColor" date = "date"/>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
        });
        
        it('should test', function(){
            expect(isolateScope.controller.firstColor).toEqual('red');
            expect(isolateScope.controller.secondColor).toEqual('yellow');
            expect(isolateScope.controller.date).toEqual($scope.date);
        });
    });
    
    
});