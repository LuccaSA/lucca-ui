describe('luidMoment', function(){
	beforeEach(module('moment'));
	beforeEach(module('underscore'));
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
			expect($scope.test.value).toEqual("01:00");
			isolateScope.mins = '15';
			isolateScope.changeMins();
			expect($scope.test.value).toEqual("01:15");
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
	describe('with a min=test.min and max=00:00', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" min="test.min" max="\'00:00\'"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should limit to min.add(1,day).startOf(day)', function(){
			$scope.test.value = moment().startOf('day').add(18,'hours').add(40,'minutes');
			$scope.test.min = moment().startOf('day');
			$scope.$digest();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			isolateScope.incrHours();
			expect($scope.test.value.format('LLL')).toEqual(moment($scope.test.min).add(1,'day').startOf('day').format('LLL'));
		});
		it('should be invalid.max if test.value.date < min.date', function(){
			$scope.test.min = moment().add(-1,'day').startOf('day');
			$scope.test.value = moment().add(1,'day');
			$scope.$digest();
			expect(isolateScope.ngModelCtrl.$error.max).toBe(true);
		});
	});
	describe('with a max=test.max and min=00:00', function(){
		beforeEach(function(){
			var tpl = angular.element('<luid-moment ng-model="test.value" min="\'00:00\'" max="test.max"></luid-moment>');
			elt = $compile(tpl)($scope);
			$scope.$digest();
			isolateScope = elt.isolateScope();
		});
		it('should limit to max.startOf(day)', function(){
			$scope.test.value = moment().startOf('day').add(3,'hours').add(40,'minutes');
			$scope.test.max = moment().startOf('day').add(18,'hours');
			$scope.$digest();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			isolateScope.decrHours();
			expect($scope.test.value.format('LLL')).toEqual(moment($scope.test.max).startOf('day').format('LLL'));
		});
		it('should be invalid.max if test.value.date < min.date', function(){
			$scope.test.max = moment().startOf('day').add(36,'hours');
			$scope.test.value = moment();
			$scope.$digest();
			expect(isolateScope.ngModelCtrl.$error.min).toBe(true);
		});
	});
	describe("$validators", function() {
		describe(".hours", function(){
			beforeEach(function() {
				$scope.test = { value: moment('2016-01-01 12:30:00') };
				var tpl = angular.element('<luid-moment ng-model="test.value"></luid-moment>');
				elt = $compile(tpl)($scope);
				$scope.$digest();
				isolateScope = elt.isolateScope();

			});
			it("should be valid when hours is and int between 0 ad 23", function() {
				_.each(_.range(24), function(i){
					isolateScope.hours = "" + i;
					isolateScope.changeHours();
					expect(isolateScope.ngModelCtrl.$error.hours).not.toBeTruthy();
				});
			});
			it("should be invalid when hours is empty", function() {
				isolateScope.hours = "";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.hours).toBeTruthy();
			});
			it("should be invalid when hours is undefined", function() {
				isolateScope.hours = "";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.hours).toBeTruthy();
			});
			it("should be invalid when hours is not an int", function() {
				isolateScope.hours = "asd";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.hours).toBeTruthy();
			});
		});
		describe(".minutes", function(){
			beforeEach(function() {
				$scope.test = { value: moment('2016-01-01 12:30:00') };
				var tpl = angular.element('<luid-moment ng-model="test.value"></luid-moment>');
				elt = $compile(tpl)($scope);
				$scope.$digest();
				isolateScope = elt.isolateScope();

			});
			it("should be valid when minutes is and int between 0 ad 60", function() {
				_.each(_.range(60), function(i){
					isolateScope.mins = "" + i;
					isolateScope.changeMins();
					expect(isolateScope.ngModelCtrl.$error.minutes).not.toBeTruthy();
				});
			});
			it("should be invalid when mins is empty", function() {
				isolateScope.mins = "";
				isolateScope.changeMins();
				expect(isolateScope.ngModelCtrl.$error.minutes).toBeTruthy();
			});
			it("should be invalid when mins is undefined", function() {
				isolateScope.mins = "";
				isolateScope.changeMins();
				expect(isolateScope.ngModelCtrl.$error.minutes).toBeTruthy();
			});
			it("should be invalid when mins is not an int", function() {
				isolateScope.mins = "asd";
				isolateScope.changeMins();
				expect(isolateScope.ngModelCtrl.$error.minutes).toBeTruthy();
			});
		});
		describe(".min with fixed min", function(){
			beforeEach(function() {
				$scope.test = { value: undefined };
				var tpl = angular.element('<luid-moment ng-model="test.value" min="\'08:00:00\'" format="\'HH:mm\'"></luid-moment>');
				elt = $compile(tpl)($scope);
				$scope.$digest();
				isolateScope = elt.isolateScope();

			});
			it("should be valid when viewvalue is undefined", function() {
				expect(isolateScope.ngModelCtrl.$error.min).not.toBeTruthy();
			});
			it("should be valid when viewValue is > min", function() {
				$scope.test.value = "12:00";
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.min).not.toBeTruthy();
			});
			it("should be valid when we change isolateScope.hours to something > min", function() {
				isolateScope.hours = "12";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.min).not.toBeTruthy();
			});
			it("should be invalid when viewValue is < min", function() {
				$scope.test.value = moment('2016-01-01 04:00:00');
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.min).toBeTruthy();
			});
			it("should be invalid when we change isolateScope.hours to something < min", function() {
				isolateScope.hours = "03";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.min).toBeTruthy();
			});
		});
		describe(".min with changing min", function(){
			beforeEach(function() {
				$scope.test = { value: moment().startOf('day').add(12, 'h'), min: moment().startOf('day').add(8, 'hours') };
				var tpl = angular.element('<luid-moment ng-model="test.value" min="test.min""></luid-moment>');
				elt = $compile(tpl)($scope);
				$scope.$digest();
				isolateScope = elt.isolateScope();
			});
			it("should be valid when viewvalue is undefined", function() {
				expect(isolateScope.ngModelCtrl.$error.min).not.toBeTruthy();
			});
			it("should be valid when viewValue is > min", function() {
				$scope.test.value = moment().startOf('day').add(12, 'hours');
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.min).not.toBeTruthy();
			});
			it("should be valid when we change isolateScope.hours to something > min", function() {
				isolateScope.hours = "12";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.min).not.toBeTruthy();
			});
			it("should be invalid when min goes over current value", function() {
				$scope.test.min = moment().startOf('d').add(16, 'h');
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.min).toBeTruthy();
			});
		});
		describe(".max with fixed max", function(){
			beforeEach(function() {
				$scope.test = { value: undefined };
				var tpl = angular.element('<luid-moment ng-model="test.value" max="\'16:00:00\'"></luid-moment>');
				elt = $compile(tpl)($scope);
				$scope.$digest();
				isolateScope = elt.isolateScope();

			});
			it("should be valid when viewvalue is undefined", function() {
				expect(isolateScope.ngModelCtrl.$error.max).not.toBeTruthy();
			});
			it("should be valid when viewValue is < max", function() {
				$scope.test.value = moment().startOf('day').add(12, 'h');
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.max).not.toBeTruthy();
			});
			it("should be valid when we change isolateScope.hours to something < max", function() {
				isolateScope.hours = "12";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.max).not.toBeTruthy();
			});
			it("should be invalid when viewValue is > max", function() {
				$scope.test.value = moment().startOf('day').add(23, 'h');
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.max).toBeTruthy();
			});
			it("should be invalid when we change isolateScope.hours to something > max", function() {
				isolateScope.hours = "21";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.max).toBeTruthy();
			});
		});
		describe(".max with changing max", function(){
			beforeEach(function() {
				$scope.test = { value: moment().startOf('day').add(12, 'h'), max: moment().startOf('day').add(16, 'hours') };
				var tpl = angular.element('<luid-moment ng-model="test.value" max="test.max""></luid-moment>');
				elt = $compile(tpl)($scope);
				$scope.$digest();
				isolateScope = elt.isolateScope();
			});
			it("should be valid when viewvalue is undefined", function() {
				expect(isolateScope.ngModelCtrl.$error.max).not.toBeTruthy();
			});
			it("should be valid when viewValue is < max", function() {
				$scope.test.value = moment().startOf('day').add(12, 'hours');
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.max).not.toBeTruthy();
			});
			it("should be valid when we change isolateScope.hours to something < max", function() {
				isolateScope.hours = "12";
				isolateScope.changeHours();
				expect(isolateScope.ngModelCtrl.$error.max).not.toBeTruthy();
			});
			it("should be invalid when max goes over current value", function() {
				$scope.test.max = moment().startOf('d').add(8, 'h');
				$scope.$digest();
				expect(isolateScope.ngModelCtrl.$error.max).toBeTruthy();
			});
		});
	});
});