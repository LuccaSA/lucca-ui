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
	describe('most basic use but with attr format', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" format="\'HH:mm\'"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update hours and minutes when test.value changes', function(){
			$scope.test.value = "00:00";
			$scope.$digest();
			expect(isolateScope.mins).toEqual('00');
			expect(isolateScope.hours).toEqual('00');

			$scope.test.value = "01:00";
			$scope.$digest();
			expect(isolateScope.mins).toEqual('00');
			expect(isolateScope.hours).toEqual('01');

			$scope.test.value = "00:15";
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
			$scope.test.value = "03:00";
			$scope.$digest();
			isolateScope.incrHours();
			expect($scope.test.value).toEqual("04:00");
			isolateScope.decrHours();
			expect($scope.test.value).toEqual("03:00");
			isolateScope.incrMins();
			expect($scope.test.value).toEqual("03:05");
			isolateScope.decrMins();
			isolateScope.decrMins();
			expect($scope.test.value).toEqual("02:55");
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
		it('should update test.value when incr/decr hours or min changes', function(){
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
		it('should be invalid.min if test.value < test.min', function(){
			$scope.test.min = moment().startOf('day').add(9,'hours');
			$scope.test.value = moment().startOf('day').add(8,'hours');
			$scope.$digest();
			expect(isolateScope.ngModelCtrl.$error.min).toBe(true);
		});
		it('should go to test.min if trying to decr from test.value when test.valiue < test.min', function(){
			$scope.test.min = moment().startOf('day').add(9,'hours');
			$scope.test.value = moment().startOf('day').add(8,'hours');
			$scope.$digest();
			isolateScope.decrMins();
			expect($scope.test.value).toEqual($scope.test.min);

			$scope.test.value = moment().startOf('day').add(8,'hours');
			$scope.$digest();
			isolateScope.incrMins();
			expect($scope.test.value).toEqual($scope.test.min);
		});
	});
	describe('with a min=00:00', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" min="\'00:00\'"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should limit to today.startOf(day)', function(){
			$scope.test.value = moment().startOf('day').add(2,'hours').add(40,'minutes');
			$scope.$digest();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			expect($scope.test.value.format('LLL')).toEqual(moment().startOf('day').format('LLL'));
		});
		it('should be invalid.min if test.value < today', function(){
			$scope.test.value = moment().startOf('day').add(-1,'day');
			$scope.$digest();
			expect(isolateScope.ngModelCtrl.$error.min).toBe(true);
		});
		it('should go to  if trying to decr from test.value when test.valiue < test.min', function(){
			$scope.test.value = moment().startOf('day').add(-1,'day');
			$scope.$digest();
			isolateScope.decrMins();
			expect($scope.test.value.format('LLL')).toEqual(moment().startOf('day').format('LLL'));

			$scope.test.value = moment().startOf('day').add(-1,'day');
			$scope.$digest();
			isolateScope.incrMins();
			expect($scope.test.value.format('LLL')).toEqual(moment().startOf('day').format('LLL'));
		});
	});
	describe('with a max', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" max="test.max"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should update test.value when incr/decr hours or max changes', function(){
			$scope.test.max = moment().startOf('day').add(16,'hours').add(14,'minutes');
			$scope.test.value = moment().startOf('day').add(15,'hours').add(40,'minutes');
			$scope.$digest();
			isolateScope.incrHours();
			expect($scope.test.value.hours()).toEqual(16);
			expect($scope.test.value.minutes()).toEqual(14);

			$scope.test.value = moment().startOf('day').add(16,'hours').add(8,'minutes');
			$scope.$digest();
			isolateScope.incrMins();
			expect($scope.test.value.minutes()).toEqual(10);
			isolateScope.incrMins();
			expect($scope.test.value.minutes()).toEqual(14);
			isolateScope.incrMins();
			expect($scope.test.value.minutes()).toEqual(14);
			$scope.test.max.add(3, 'minutes');
			$scope.$digest();
			isolateScope.incrMins(); 
			expect($scope.test.value.minutes()).toEqual(15);
			isolateScope.incrMins();
			expect($scope.test.value.minutes()).toEqual(17);
		});
		it('should be invalid.max if test.value > test.max', function(){
			$scope.test.max = moment().startOf('day').add(14,'hours');
			$scope.test.value = moment().startOf('day').add(15,'hours');
			$scope.$digest();
			expect(isolateScope.ngModelCtrl.$error.max).toBe(true);
		});
		it('should go to test.max if trying to incr from test.value when test.valiue < test.max', function(){
			$scope.test.max = moment().startOf('day').add(14,'hours');
			$scope.test.value = moment().startOf('day').add(15,'hours');
			$scope.$digest();
			isolateScope.decrMins();
			expect($scope.test.value).toEqual($scope.test.max);
			$scope.test.value = moment().startOf('day').add(15,'hours');
			$scope.$digest();
			isolateScope.incrMins();
			expect($scope.test.value).toEqual($scope.test.max);
		});
	});
	describe('with a max=00:00', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" max="\'00:00\'"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should limit to today.startOf(day)', function(){
			$scope.test.value = moment().startOf('day').add(18,'hours').add(40,'minutes');
			$scope.$digest();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			expect($scope.test.value.format('LLL')).toEqual(moment().add(1,'day').startOf('day').format('LLL'));
		});
		it('should be invalid.min if test.value < today', function(){
			$scope.test.value = moment().add(1,'day');
			$scope.$digest();
			expect(isolateScope.ngModelCtrl.$error.max).toBe(true);
		});
		it('should go to  if trying to decr from test.value when test.valiue < test.min', function(){
			$scope.test.value = moment().add(1,'day');
			$scope.$digest();
			isolateScope.decrMins();
			expect($scope.test.value.format('LLL')).toEqual(moment().add(1,'day').startOf('day').format('LLL'));

			$scope.test.value = moment().startOf('day').add(1,'day');
			$scope.$digest();
			isolateScope.incrMins();
			expect($scope.test.value.format('LLL')).toEqual(moment().add(1,'day').startOf('day').format('LLL'));
		});
	});
});