describe('luidTimespan', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var moment, $scope, isolateScope, $compile, elt, input;
	beforeEach(inject(function (_moment_, _$rootScope_, _$compile_) {
		moment = _moment_;
		$scope = _$rootScope_.$new();
		$compile = _$compile_;
	}));
	describe('most basic-est use', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-timespan ng-model="myTimespan"></luid-timespan>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update strDuration when myTimespan changes', function(){
			$scope.myTimespan = '00:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('0m');
			$scope.myTimespan = '00:01:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('1m');
			$scope.myTimespan = '02:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('02h00');
			$scope.myTimespan = '02:01:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('02h01');
			$scope.myTimespan = '1.11:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('35h00');
			$scope.myTimespan = '4.10:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('106h00');
		});
		it('should update myTimespan when strDuration changes', function(){
			isolateScope.strDuration = '0m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:00:00');
			isolateScope.strDuration = '35';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:35:00');
			isolateScope.strDuration = '35m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:35:00');
			isolateScope.strDuration = '1h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('01:00:00');
			isolateScope.strDuration = '12h30';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('12:30:00');
		});
		it('should format strDuration to xm or xxhxx', function(){
			isolateScope.strDuration = '0';
			isolateScope.updateValue();
			expect(isolateScope.strDuration).toEqual('0');
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('0m');
			isolateScope.strDuration = '35';
			isolateScope.updateValue();
			expect(isolateScope.strDuration).toEqual('35');
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('35m');
			isolateScope.strDuration = '70';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('01h10');
			isolateScope.strDuration = '1h';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('01h00');
			isolateScope.strDuration = '1h10';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('01h10');
		});
	});
	describe('most basic-est use with negative values', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-timespan ng-model="myTimespan"></luid-timespan>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update strDuration when myTimespan changes', function(){
			$scope.myTimespan = '-00:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('0m');
			$scope.myTimespan = '-00:01:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('-1m');
			$scope.myTimespan = '-02:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('-02h00');
			$scope.myTimespan = '-02:01:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('-02h01');
			$scope.myTimespan = '-1.11:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('-35h00');
			$scope.myTimespan = '-4.10:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('-106h00');
		});
		it('should update myTimespan when strDuration changes', function(){
			isolateScope.strDuration = '-0m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:00:00');
			isolateScope.strDuration = '-35';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('-00:35:00');
			isolateScope.strDuration = '-35m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('-00:35:00');
			isolateScope.strDuration = '-1h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('-01:00:00');
			isolateScope.strDuration = '-12h30';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('-12:30:00');
		});
		it('should format strDuration to xm or xxhxx', function(){
			isolateScope.strDuration = '0';
			isolateScope.updateValue();
			expect(isolateScope.strDuration).toEqual('0');
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('0m');
			isolateScope.strDuration = '-35';
			isolateScope.updateValue();
			expect(isolateScope.strDuration).toEqual('-35');
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('-35m');
			isolateScope.strDuration = '-70';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('-01h10');
			isolateScope.strDuration = '-1h';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('-01h00');
			isolateScope.strDuration = '-1h10';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('-01h10');
		});
	});
	describe('with unit=hour', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-timespan ng-model="myTimespan" unit="\'hour\'"></luid-timespan>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update myTimespan when strDuration changes', function(){
			isolateScope.strDuration = '0m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:00:00');
			isolateScope.strDuration = '35';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('1.11:00:00');
			isolateScope.strDuration = '35m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:35:00');
			isolateScope.strDuration = '1h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('01:00:00');
			isolateScope.strDuration = '12h30';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('12:30:00');
		});
		it('should format strDuration to xm or xxhxx', function(){
			isolateScope.strDuration = '0';
			isolateScope.updateValue();
			expect(isolateScope.strDuration).toEqual('0');
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('0m');
			isolateScope.strDuration = '35';
			isolateScope.updateValue();
			expect(isolateScope.strDuration).toEqual('35');
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('35h00');
			isolateScope.strDuration = '70';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('70h00');
			isolateScope.strDuration = '1h';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('01h00');
			isolateScope.strDuration = '1h10';
			isolateScope.updateValue();
			isolateScope.formatInputValue();
			expect(isolateScope.strDuration).toEqual('01h10');
		});
	});
	describe('with mode="moment.duration"', function() {
		beforeEach(function(){
			var tpl = angular.element('<luid-timespan ng-model="myTimespan" mode="moment.duration"></luid-timespan>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update strDuration when myTimespan changes', function() {
			$scope.myTimespan = moment.duration('00:00:00');
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('0m');
			$scope.myTimespan = moment.duration(1, 'minutes');
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('1m');
			$scope.myTimespan = moment.duration(2, 'hours');
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('02h00');
			$scope.myTimespan = moment.duration('2:01:00');
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('02h01');
			$scope.myTimespan = moment.duration('P1DT11H');
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('35h00');
			$scope.myTimespan = moment.duration('P4DT10H');
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('106h00');
		});
		it('should update myTimespan when strDuration changes', function(){
			isolateScope.strDuration = '0m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual(moment.duration('P0D'));
			isolateScope.strDuration = '35';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual(moment.duration('PT35M'));
			isolateScope.strDuration = '35m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual(moment.duration('PT35M'));
			isolateScope.strDuration = '1h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual(moment.duration('PT1H'));
			isolateScope.strDuration = '12h30';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual(moment.duration('PT12H30M'));
		});
	});
	describe('with mode="timespan"', function() {
		beforeEach(function(){
			var tpl = angular.element('<luid-timespan ng-model="myTimespan" mode="timespan"></luid-timespan>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update strDuration when myTimespan changes', function(){
			$scope.myTimespan = '00:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('0m');
			$scope.myTimespan = '00:01:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('1m');
			$scope.myTimespan = '02:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('02h00');
			$scope.myTimespan = '02:01:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('02h01');
			$scope.myTimespan = '1.11:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('35h00');
			$scope.myTimespan = '4.10:00:00';
			$scope.$digest();
			expect(isolateScope.strDuration).toEqual('106h00');
		});
		it('should update myTimespan when strDuration changes', function(){
			isolateScope.strDuration = '0m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:00:00');
			isolateScope.strDuration = '35';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:35:00');
			isolateScope.strDuration = '35m';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('00:35:00');
			isolateScope.strDuration = '1h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('01:00:00');
			isolateScope.strDuration = '12h30';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual('12:30:00');
		});
	});
	describe('with a min', function() {
		beforeEach(function(){
			$scope.min = '2:01';
			var tpl = angular.element('<luid-timespan ng-model="myTimespan" min="min"></luid-timespan>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update myTimespan = min if strDuration < min', function() {
			isolateScope.strDuration = '2h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:01:00");
		});
		it('should update myTimespan if strDuration > min', function() {
			isolateScope.strDuration = '2h05';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:05:00");
		});
		it('should update myTimespan = min while strDuration < min', function() {
			isolateScope.strDuration = '1';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:01:00");

			isolateScope.strDuration = '12';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:01:00");

			isolateScope.strDuration = '125';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:05:00");
		});
	});
	describe('with a max', function() {
		beforeEach(function(){
			$scope.max = '2:01';
			var tpl = angular.element('<luid-timespan ng-model="myTimespan" max="max"></luid-timespan>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update myTimespan = max if strDuration > max', function() {
			isolateScope.strDuration = '3h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:01:00");
		});
		it('should update myTimespan if strDuration < max', function() {
			isolateScope.strDuration = '1h50';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("01:50:00");
		});
		it('should update myTimespan = max as soon as strDuration > max', function() {
			isolateScope.strDuration = '1';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("00:01:00");

			isolateScope.strDuration = '12';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("00:12:00");

			isolateScope.strDuration = '120';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:00:00");

			isolateScope.strDuration = '120h';
			isolateScope.updateValue();
			expect($scope.myTimespan).toEqual("02:01:00");
		});
	});
});