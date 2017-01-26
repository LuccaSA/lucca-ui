describe('luidTranslations', function(){
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.translate'));

	var moment, $scope, isolateScope, $compile, $filter, elt, input, ngModelCtrl;
	beforeEach(inject(function (_moment_, _$rootScope_, _$compile_, _$filter_) {
		moment = _moment_;
		$scope = _$rootScope_.$new();
		$compile = _$compile_;
		$filter = _$filter_;
	}));

	// Basic bindings checks
	describe('most basic-est use', function(){
		beforeEach(function(){
			$scope.myTrads = {fr: "", en: ""};
			var tpl = angular.element('<luid-translations ng-model="myTrads"></luid-translations>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
			ngModelCtrl = elt.controller("ngModel");
		});
		it('should call $render when myPeriod changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myTrads = {fr: "qweqwe", en: "asdasd"};
			$scope.$digest();
			expect(ngModelCtrl.$render).toHaveBeenCalled();
		});
		it('should call $render when myTrads.fr or myTrads.en changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myTrads.fr = "des bidules";
			$scope.$digest();
			$scope.myTrads.en = "other stuff";
			$scope.$digest();
			expect(ngModelCtrl.$render).toHaveBeenCalled();
			expect(ngModelCtrl.$render.calls.count()).toEqual(2);
		});
		it('should not call $render when myTrads.otherProperty changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myTrads.foo = "bar";
			$scope.$digest();
			expect(ngModelCtrl.$render).not.toHaveBeenCalled();
		});
		it('should update internal when myTrads changes', function(){
			expect(isolateScope.internal.fr).toEqual($scope.myTrads.fr);
			expect(isolateScope.internal.en).toEqual($scope.myTrads.en);
			$scope.myTrads.fr = "des bidules";
			$scope.myTrads.en = "other stuff";
			$scope.$digest();
			expect(isolateScope.internal.fr).toEqual($scope.myTrads.fr);
			expect(isolateScope.internal.en).toEqual($scope.myTrads.en);
		});
		it('should update myTrads when internalScope changes', function(){
			isolateScope.internal.fr = "du français";
			isolateScope.internal.en = "some english";
			isolateScope.update();
			expect($scope.myTrads.fr).toEqual(isolateScope.internal.fr);
			expect($scope.myTrads.en).toEqual(isolateScope.internal.en);
		});
	});

	describe("mode='|'", function(){
		beforeEach(function(){
			$scope.myTrads = "";
			var tpl = angular.element('<luid-translations ng-model="myTrads" mode="|"></luid-translations>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
			ngModelCtrl = elt.controller("ngModel");
		});
		it("should be able to parse the input", function(){
			$scope.myTrads = "en:english|fr:french";
			$scope.$digest();
			expect(isolateScope.internal.fr).toEqual("french");
			expect(isolateScope.internal.en).toEqual("english");
		});
		it("should return string at the correct format", function(){
			isolateScope.internal.fr = "français";
			isolateScope.update();
			expect($scope.myTrads).toEqual("en:|de:|es:|fr:français|it:|nl:");
		});
	});

});