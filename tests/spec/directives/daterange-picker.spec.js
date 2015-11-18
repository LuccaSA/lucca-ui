describe('luidDaterange', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

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
			$scope.myPeriod = {startsOn:moment().startOf('d'), endsOn:moment().startOf('d').add(3,'d')};
			var tpl = angular.element('<luid-daterange ng-model="myPeriod"></luid-daterange>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
			ngModelCtrl = elt.controller("ngModel");
		});
		it('should call $render when myPeriod changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myPeriod = {};
			$scope.$digest();
			expect(ngModelCtrl.$render).toHaveBeenCalled();
		});
		it('should call $render when myPeriod.startsOn or myPeriod.endsOn changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myPeriod.startsOn = moment().startOf('d').add(1,'d');
			$scope.$digest();
			$scope.myPeriod.endsOn = "other stuff";
			$scope.$digest();
			expect(ngModelCtrl.$render).toHaveBeenCalled();
			expect(ngModelCtrl.$render.calls.count()).toEqual(2);
		});
		it('should not call $render when myPeriod.otherProperty changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myPeriod.foo = "bar";
			$scope.$digest();
			expect(ngModelCtrl.$render).not.toHaveBeenCalled();
		});
		it('should update strFriendly, startsOn and endsOn when myPeriod changes', function(){
			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.endsOn)).toEqual(0);
			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
			$scope.myPeriod.startsOn = moment().startOf('d').add(1,'d');
			$scope.myPeriod.endsOn = moment().startOf('d').add(3,'months');
			$scope.$digest();
			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.endsOn)).toEqual(0);
			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
		});
		it('should update myPeriod when internalScope  changes', function(){
			isolateScope.internal.startsOn = moment().startOf('d').add(2,'months').toDate();
			isolateScope.internalUpdated();
			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.endsOn)).toEqual(0);
			isolateScope.internal.endsOn = moment().startOf('d').add(3,'months').toDate();
			isolateScope.internalUpdated();
			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.endsOn)).toEqual(0);
		});
		it('should update internal.strFriendly when one of the internal dates changes', function(){
			isolateScope.internal.startsOn = moment().startOf('d').add(2,'months').toDate();
			isolateScope.internalUpdated();
			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
			isolateScope.internal.endsOn = moment().startOf('d').add(3,'months').toDate();
			isolateScope.internalUpdated();
			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
		});
	});
	describe('binded to js dates', function(){
		beforeEach(function(){
			$scope.myPeriod = {};
			var tpl = angular.element('<luid-daterange ng-model="myPeriod" format="date"></luid-daterange>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('updating $scope.myPeriod with dates should be understood by the controller', function(){
			$scope.myPeriod.startsOn = moment().startOf('d').add(1,'d').toDate();
			$scope.myPeriod.endsOn = moment().startOf('d').add(3,'months').toDate();
			$scope.$digest();
			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.endsOn)).toEqual(0);
			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
		});
		it('updating internalScope should set new dates in the $scope', function(){
			isolateScope.internal.startsOn = moment().startOf('d').add(2,'months').toDate();
			isolateScope.internal.endsOn = moment().startOf('d').add(3,'months').toDate();
			isolateScope.internalUpdated();
			expect($scope.myPeriod.startsOn).toEqual(jasmine.any(Date));
			expect($scope.myPeriod.endsOn).toEqual(jasmine.any(Date));
		});
	});
	describe('binded to strings', function(){
		beforeEach(function(){
			$scope.myPeriod = {};
			var tpl = angular.element('<luid-daterange ng-model="myPeriod" format="MM-DD"></luid-daterange>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('updating $scope.myPeriod with dates should be understood by the controller', function(){
			$scope.myPeriod.startsOn = moment().startOf('d').add(1,'d').format("MM-DD");
			$scope.myPeriod.endsOn = moment().startOf('d').add(3,'months').format("MM-DD");
			$scope.$digest();
			expect(moment(isolateScope.internal.startsOn).format("MM-DD")).toEqual($scope.myPeriod.startsOn);
			expect(moment(isolateScope.internal.endsOn).format("MM-DD")).toEqual($scope.myPeriod.endsOn);
			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
		});
		it('updating internalScope should set new dates in the $scope', function(){
			isolateScope.internal.startsOn = moment().startOf('d').add(2,'months').toDate();
			isolateScope.internal.endsOn = moment().startOf('d').add(3,'months').toDate();
			isolateScope.internalUpdated();
			expect($scope.myPeriod.startsOn).toEqual(moment(isolateScope.internal.startsOn).format("MM-DD"));
			expect($scope.myPeriod.endsOn).toEqual(moment(isolateScope.internal.endsOn).format("MM-DD"));
		});
	});

	// attr exclude-end
	describe('with end excluded', function(){
		beforeEach(function(){
			$scope.myPeriod = {};
			var tpl = angular.element('<luid-daterange ng-model="myPeriod" exclude-end="true"></luid-daterange>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('when updating myPeriod, internal.endsOn should be one day before myPeriod.endsOn', function(){
			$scope.myPeriod.startsOn = moment().startOf('d').add(1,'d');
			$scope.myPeriod.endsOn = moment().startOf('d').add(3,'months');
			$scope.$digest();
			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).add(1,'day').diff($scope.myPeriod.endsOn)).toEqual(0);
			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
		});
		it('when updating internal, myPeriod.endsOn should be one day after internal.endsOn', function(){
			isolateScope.internal.startsOn = moment().startOf('d').add(2,'months').toDate();
			isolateScope.internal.endsOn = moment().startOf('d').add(3,'months').toDate();
			isolateScope.internalUpdated();
			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).add(1,'d').diff($scope.myPeriod.endsOn)).toEqual(0);
		});
	});

	// attrs start-property and end-property
	describe('with start-property and end-property specified', function(){
		beforeEach(function(){
			$scope.myPeriod = {};
			var tpl = angular.element('<luid-daterange ng-model="myPeriod" start-property="customStart" end-property="customEnd"></luid-daterange>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
			ngModelCtrl = elt.controller("ngModel");
		});
		it('should call $render when myPeriod.customStart or myPeriod.customEnd changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myPeriod.customStart = moment().startOf('d').add(1,'d');
			$scope.$digest();
			$scope.myPeriod.customEnd = "other stuff";
			$scope.$digest();
			expect(ngModelCtrl.$render).toHaveBeenCalled();
			expect(ngModelCtrl.$render.calls.count()).toEqual(2);
		});
		it('should not call $render when myPeriod.startsOn or myPeriod.endsOn changes', function(){
			spyOn(ngModelCtrl, '$render');
			$scope.myPeriod.startsOn = moment().startOf('d').add(1,'d');
			$scope.$digest();
			$scope.myPeriod.endsOn = "other stuff";
			$scope.$digest();
			expect(ngModelCtrl.$render).not.toHaveBeenCalled();
		});
		it('when updating myPeriod, should bind to the right properties', function(){
			$scope.myPeriod.startsOn = moment().startOf('d').add(1,'d');
			$scope.myPeriod.endsOn = moment().startOf('d').add(3,'months');
			$scope.myPeriod.customStart = moment().startOf('d').add(10,'d');
			$scope.myPeriod.customEnd = moment().startOf('d').add(30,'months');
			$scope.$digest();

			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).not.toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.endsOn)).not.toEqual(0);

			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.customStart)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.customEnd)).toEqual(0);

			expect(isolateScope.internal.strFriendly).toEqual($filter("luifFriendlyRange")(isolateScope.internal));
		});
		it('when updating internal, myPeriod.endsOn and startsOn should be unchanged and customStart/end should be updated', function(){
			isolateScope.internal.startsOn = moment().startOf('d').add(5,'months').toDate();
			isolateScope.internal.endsOn = moment().startOf('d').add(7,'months').toDate();
			isolateScope.internalUpdated();

			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.startsOn)).not.toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.endsOn)).not.toEqual(0);

			expect(moment(isolateScope.internal.startsOn).diff($scope.myPeriod.customStart)).toEqual(0);
			expect(moment(isolateScope.internal.endsOn).diff($scope.myPeriod.customEnd)).toEqual(0);
		});
	});

	// attr periods
	describe('with custom periods', function(){
		beforeEach(function(){
			$scope.myPeriod = {};
			$scope.myPeriods = [];
			var tpl = angular.element('<luid-daterange ng-model="myPeriod" data-periods="myPeriods"></luid-daterange>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should know it has custom periods', function(){
			expect(isolateScope.hasPeriods).toBe(true);
		});
		it('should set the start and end dates when going to a period', function(){
			isolateScope.goToPeriod({startsOn: moment("1515-09-13"), endsOn: moment("1515-09-14")}); // marignan

			expect(moment(isolateScope.internal.startsOn).format("YYYY-MM-DD")).toBe("1515-09-13");
			expect(moment(isolateScope.internal.endsOn).format("YYYY-MM-DD")).toBe("1515-09-14");
			expect(moment($scope.myPeriod.startsOn).format("YYYY-MM-DD")).toBe("1515-09-13");
			expect(moment($scope.myPeriod.endsOn).format("YYYY-MM-DD")).toBe("1515-09-14");
		});
	});

	// attr periods + exclude-end
	describe('with custom periods and exclude-end', function(){
		beforeEach(function(){
			$scope.myPeriod = {};
			$scope.myPeriods = [];
			var tpl = angular.element('<luid-daterange ng-model="myPeriod" data-periods="myPeriods" exclude-end="true"></luid-daterange>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should set the start and end dates when going to a period', function(){
			isolateScope.goToPeriod({startsOn: moment("1515-09-13"), endsOn: moment("1515-09-15")}); // marignan, end excluded

			expect(moment(isolateScope.internal.startsOn).format("YYYY-MM-DD")).toBe("1515-09-13");
			expect(moment(isolateScope.internal.endsOn).format("YYYY-MM-DD")).toBe("1515-09-14");
			expect(moment($scope.myPeriod.startsOn).format("YYYY-MM-DD")).toBe("1515-09-13");
			expect(moment($scope.myPeriod.endsOn).format("YYYY-MM-DD")).toBe("1515-09-15");
		});
	});
});