describe('luidMoment', function(){
	beforeEach(module('moment'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.directives'));

	var moment, $scope, isolateScope, $compile, elt, input;
	beforeEach(inject(function (_moment_, _$rootScope_, _$compile_) {
		moment = _moment_;
		$scope = _$rootScope_.$new();
		$scope.test = {}
		$compile = _$compile_;
	}));

	describe('most basic use', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update hours and minutes when test.value changes', function(){
			$scope.test.value = moment().startOf('day');
			$scope.$digest();
			expect(isolateScope.mins).toEqual('00');
			expect(isolateScope.hours).toEqual('00');

			$scope.test.value = moment().startOf('day').add(1,'hours');
			$scope.$digest();
			expect(isolateScope.mins).toEqual('00');
			expect(isolateScope.hours).toEqual('01');

			$scope.test.value = moment().startOf('day').add(15,'minutes');
			$scope.$digest();
			expect(isolateScope.mins).toEqual('15');
			expect(isolateScope.hours).toEqual('00');
		});
		it('should update test.value when hours or mins changes', function(){
			isolateScope.hours = '01';
			isolateScope.changeHours();
			expect($scope.test.value.hours()).toEqual(1);
			isolateScope.mins = '15';
			isolateScope.changeMins();
			expect($scope.test.value.minutes()).toEqual(15);
		});
		it('should update test.value when incr/decr hours or mins changes', function(){
			$scope.test.value = moment().startOf('day').add(3,'hours');
			$scope.$digest();
			isolateScope.incrHours();
			expect($scope.test.value.hours()).toEqual(4);
			isolateScope.decrHours();
			expect($scope.test.value.hours()).toEqual(3);
			isolateScope.incrMins();
			expect($scope.test.value.minutes()).toEqual(5);
			isolateScope.decrMins();
			isolateScope.decrMins();
			expect($scope.test.value.minutes()).toEqual(55);
			expect($scope.test.value.hours()).toEqual(2);
		});
	});
	describe('with a custom incr step', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" step="15"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update test.value when incr/decr hours or mins changes', function(){
			$scope.test.value = moment().startOf('day').add(3,'hours');
			$scope.$digest();
			isolateScope.incrHours();
			expect($scope.test.value.hours()).toEqual(4);
			isolateScope.decrHours();
			expect($scope.test.value.hours()).toEqual(3);
			isolateScope.incrMins();
			expect($scope.test.value.minutes()).toEqual(15);
			isolateScope.decrMins();
			isolateScope.decrMins();
			expect($scope.test.value.minutes()).toEqual(45);
			expect($scope.test.value.hours()).toEqual(2);
		});
		it('should go to the nearest multiple of 15 when changing minutes', function(){
			$scope.test.value = moment().startOf('day').add(3,'hours').add(27, 'minutes');
			$scope.$digest();
			isolateScope.incrMins();
			expect($scope.test.value.minutes()).toEqual(30);
			$scope.test.value = moment().startOf('day').add(3,'hours').add(23, 'minutes');
			$scope.$digest();
			isolateScope.decrMins();
			expect($scope.test.value.minutes()).toEqual(15);
		});
	});
	describe('with a min', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" min="test.min"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update test.value when incr/decr hours or mins changes', function(){
			$scope.test.min = moment().startOf('day').add(8,'hours').add(1,'minutes');
			$scope.test.value = moment().startOf('day').add(8,'hours').add(40,'minutes');
			$scope.$digest();
			isolateScope.decrHours();
			expect($scope.test.value.hours()).toEqual(8);
			expect($scope.test.value.minutes()).toEqual(1);

			$scope.test.value = moment().startOf('day').add(8,'hours').add(6,'minutes');
			$scope.$digest();
			isolateScope.decrMins();
			expect($scope.test.value.minutes()).toEqual(5);
			isolateScope.decrMins();
			expect($scope.test.value.minutes()).toEqual(1);
			isolateScope.decrMins();
			expect($scope.test.value.minutes()).toEqual(1);
			$scope.test.min.add(-3, 'minutes');
			$scope.$digest();
			isolateScope.decrMins(); // goes to 8:00 cuz step === 5 so we stop on each multiple of 5 for the minutes
			isolateScope.decrMins();
			expect($scope.test.value.minutes()).toEqual(58);
		});
	});
});