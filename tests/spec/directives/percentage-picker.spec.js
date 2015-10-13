describe('luidPercentage', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var $scope, isolateScope, $compile, elt, input;
	beforeEach(inject(function (_$rootScope_, _$compile_) {
		$scope = _$rootScope_.$new();
		$compile = _$compile_;
	}));
	describe('most basic-est use', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-percentage ng-model="myPct"></luid-percentage>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update intPct when myPct changes', function(){
			$scope.myPct = 0.5;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(50);
			$scope.myPct = -0.2;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(-20);
		});
		it('should update myPct when intPct changes', function(){
			isolateScope.intPct = 50;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(.5);
			isolateScope.intPct = -20;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(-.2);
		});
	});
	describe('with format=0.XX', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-percentage ng-model="myPct" format="0.XX"></luid-percentage>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update intPct when myPct changes', function(){
			$scope.myPct = 0.5;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(50);
			$scope.myPct = -0.2;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(-20);
		});
		it('should update myPct when intPct changes', function(){
			isolateScope.intPct = 50;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(.5);
			isolateScope.intPct = -20;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(-.2);
		});
	});
	describe('with format=XX', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-percentage ng-model="myPct" format="XX"></luid-percentage>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update intPct when myPct changes', function(){
			$scope.myPct = 50;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(50);
			$scope.myPct = -20;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(-20);
		});
		it('should update myPct when intPct changes', function(){
			isolateScope.intPct = 50;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(50);
			isolateScope.intPct = -20;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(-20);
		});
	});
	describe('with format=1.XX', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-percentage ng-model="myPct" format="1.XX"></luid-percentage>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update intPct when myPct changes', function(){
			$scope.myPct = 1.5;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(50);
			$scope.myPct = 0.8;
			$scope.$digest();
			expect(isolateScope.intPct).toEqual(-20);
		});
		it('should update myPct when intPct changes', function(){
			isolateScope.intPct = 50;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(1.5);
			isolateScope.intPct = -20;
			isolateScope.updateValue();
			expect($scope.myPct).toEqual(0.8);
		});
	});
});