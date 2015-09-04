(function(){
	'use strict';
	angular.module('lui.directives')
	.directive('luidMoment', ['moment', function(moment){
		function link(scope, element, attrs, ctrls){
			var ngModelCtrl = ctrls[1];
			var mpCtrl = ctrls[0];

			scope.hasButtons = attrs.showButtons!==undefined;

			// display the value i on two chars
			if(!!attrs.format){ // allows to have a ng-model of type string, not moment
				var format = scope.$eval(attrs.format);
				ngModelCtrl.$render = function(){
					if(this.$viewValue && moment(this.$viewValue, format).isValid()){
						var momentValue = moment(this.$viewValue, format);
						scope.hours = momentValue.format('HH');
						scope.mins = momentValue.format('mm');
					}
				};
				ngModelCtrl.setValue = function(newMomentValue){ 
					if(!newMomentValue){
						ngModelCtrl.$setViewValue(undefined);
					}else{
						ngModelCtrl.$setViewValue(newMomentValue.format(format)); 
					}
				};
			}else{
				ngModelCtrl.$render = function(){
					if(this.$viewValue && this.$viewValue.isValid()){
						scope.hours = this.$viewValue.format('HH');
						scope.mins = this.$viewValue.format('mm');
					}
				};
				ngModelCtrl.setValue = function(newMomentValue){ ngModelCtrl.$setViewValue(newMomentValue); };
			}

			scope.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$viewChangeListeners.push(function() {
				scope.$eval(attrs.ngChange);
			});
			ngModelCtrl.$validators.min = function(modelValue,viewValue){
				return mpCtrl.checkMin(modelValue);
			};
			ngModelCtrl.$validators.max = function(modelValue,viewValue){
				return mpCtrl.checkMax(modelValue);
			};
			var inputs = element.find('input');
			var hoursInput = angular.element(inputs[0]);
			var minsInput = angular.element(inputs[1]);
			mpCtrl.setupEvents(hoursInput,minsInput);
		}
		return{
			require:['luidMoment','^ngModel'],
			controller:'luidMomentController',
			replace:true,
			scope: {
				min:'=', // a moment or a str to specify the min for this input
				max:'=', // idem for max
				step:'=', // the number of minutes to add/subtract when clicking the addMins button or scrolling on the add in input
				referenceDate:'=', // when entering a time, the date to set it, also used to count the number of days between the ngModel and this date, if unavailable, will use min then max then today
				disabled:'=',
				showButtons:'=', // forces the buttons to be displayed even if neither inputs is focused
				enforceValid:'=', // prevents entering an ng-invalid input by correcting the value when losing focus

				format:'=', // alows ng-model to be a string with the right format

				// hacks
				minOffset:'=', // to avoid having to say min=val1+val2 because it causes an other digest cycle, we give the offset and the 
				maxOffset:'='
			},
			templateUrl:"lui/directives/luidMoment.html",
			restrict:'EA',
			link:link
		};
	}])
	.controller('luidMomentController', ['$scope', '$timeout', 'moment', function($scope, $timeout, moment){
		$scope.pattern = /^([0-9]{0,2})?$/;
		var specialSteps = [5,10,15,20,30];
		var mpCtrl = this;

		// private utility methods
		// we dont want a reference to _ that is used just for a _.contains once so we just recode it with an angular.forEach
		var contains = function(array, value){
			var b = false;
			angular.forEach(array,function(v){
				b = b || v === value;
			});
			return b;
		};

		// private methods for update
		var incr = function (step) {
			if ($scope.disabled) { return; }
			enableButtons();
			$scope.ngModelCtrl.$setValidity('pattern', true);

			var curr = moment(currentValue());
			if(!curr){curr = getRefDate().startOf('day');}
			if(contains(specialSteps, Math.abs(step)) && curr.minutes()%step!==0){
				step = step<0? -(curr.minutes()%step) : -curr.minutes()%step + step;
			}
			var newValue = curr.add(step,'m');
			// check if it before min or after max
			if(!mpCtrl.checkMin(newValue)){
				$scope.mined = true;
				newValue = getMin();
			}else if(!mpCtrl.checkMax(newValue)){
				$scope.maxed = true;
				newValue = getMax();
			}

			newValue.seconds(0);
			// update 
			update(newValue);
		};
		var update = function(newValue){
			$scope.ngModelCtrl.setValue(newValue);
			$scope.ngModelCtrl.$render();
		};
		var updateWithoutRender = function(newValue){
			enableButtons(newValue);
			$scope.ngModelCtrl.setValue(newValue);
		};
		var enableButtons = function(newValue){
			$scope.maxed=false;
			$scope.mined=false;
			if(!newValue){return;}
			if(getMin() && getMin().diff(newValue)===0){
				$scope.mined = true;
			}else if(getMax() && getMax().diff(newValue)===0){
				$scope.maxed = true;
			}
		};

		// string value changed
		$scope.changeHours = function(){
			// if hours does not satisfy the pattern [0-9]{0,2}
			if($scope.hours === undefined){ 
				$scope.ngModelCtrl.$setValidity('pattern', false);
				return update(undefined);
			} 
			$scope.ngModelCtrl.$setValidity('pattern', true);

			if($scope.hours === ""){
				return update(undefined);
			}

			if($scope.hours.length == 2){
				if(parseInt($scope.hours)>23){ $scope.hours = '23'; }
				$scope.$broadcast('focusMinutes');
			}else if($scope.hours.length == 1 && parseInt($scope.hours)>2){
				$scope.hours = 0 + $scope.hours;
				$scope.$broadcast('focusMinutes');
			}
			updateWithoutRender(getInputedTime());
		};
		$scope.changeMins = function(){
			if($scope.mins === undefined){ 
				$scope.ngModelCtrl.$setValidity('pattern', false);
				return update(undefined);
			} 
			$scope.ngModelCtrl.$setValidity('pattern', true);

			updateWithoutRender(getInputedTime());
		};

		// private method to translate between string values and viewvalue
		var getInputedTime = function(){
			var intHours = parseInt($scope.hours);
			var intMinutes = parseInt($scope.mins);
			if(intHours!=intHours){intHours = 0;} // intHour isNaN
			if(intMinutes!=intMinutes){intMinutes = 0;} // intMins isNaN

			return getRefDate().hours(intHours).minutes(intMinutes).seconds(0);
		};

		// display stuff
		$scope.formatInputValue = function(){
			$scope.ngModelCtrl.$render();
		};
		$scope.getDayGap = function(){
			var refDate = getRefDate().startOf('day');
			return moment.duration(moment(currentValue()).startOf('d').diff(refDate)).asDays();
		};

		// stuff to control the focus of the different elements and the clicky bits on the + - buttons
		// what we want is show the + - buttons if one of the inputs is displayed
		// and we want to be able to click on said buttons without loosing focus (obv)
		$scope.incrHours = function(){
			cancelTimeouts();
			incr(60);
			$scope.$broadcast('focusHours');
		};
		$scope.decrHours = function(){
			cancelTimeouts();
			incr(-60);
			$scope.$broadcast('focusHours');
		};
		$scope.incrMins = function(){
			cancelTimeouts();
			$scope.$broadcast('focusMinutes');
			incr(getStep());
		};
		$scope.decrMins = function(){
			cancelTimeouts();
			$scope.$broadcast('focusMinutes');
			incr(-getStep());
		};

		var hoursFocusTimeout,minsFocusTimeout;
		$scope.blurHours = function(){
			hoursFocusTimeout = $timeout(function(){
					$scope.hoursFocused = false;
					correctValue();
			},200);
		};
		$scope.blurMins = function(){
			minsFocusTimeout = $timeout(function(){
					$scope.minsFocused = false;
					correctValue();
			},200);
		};
		$scope.focusHours = function(){
			cancelTimeouts();
			$scope.minsFocused = false;
			$scope.hoursFocused = true;
		};
		$scope.focusMins = function(){
			cancelTimeouts();
			$scope.minsFocused = true;
			$scope.hoursFocused = false;
		};

		var cancelTimeouts = function(){
			if(!!hoursFocusTimeout){
				$timeout.cancel(hoursFocusTimeout);
				hoursFocusTimeout = undefined;
			}
			if(!!minsFocusTimeout){
				$timeout.cancel(minsFocusTimeout);
				minsFocusTimeout = undefined;
			}
		};
		var correctValue = function(){
			if($scope.enforceValid){
				$scope.ngModelCtrl.$setValidity('pattern', true);
				if($scope.ngModelCtrl.$error.min){
					update(getMin());
				}else if($scope.ngModelCtrl.$error.max){
					update(getMax());
				}
			}
		};

		// internal machinery - getStuff
		var getStep = function(){
			var step = 5;
			if(!isNaN(parseInt($scope.step))){
				step = parseInt($scope.step);
			}
			return step;
		};
		var getRefDate = function(){
			var refDate = moment();
			if(!!$scope.referenceDate && moment($scope.referenceDate).isValid()){
				refDate = moment($scope.referenceDate);
			}else if (!!$scope.min && moment($scope.min).isValid()){
				refDate = moment($scope.min);
			}else if (!!$scope.max && moment($scope.max).isValid()){
				refDate = moment($scope.max);
			}
			return refDate;
		};
		var getMin = function(){
			var min;
			var offset;
			if(!$scope.min){ return undefined; } // min attr not specified
			if(!!$scope.min.isValid && !!$scope.min.isValid()){ // check if min is a valid moment
				min = moment($scope.min);
			}else if(moment($scope.min,'YYYY-MM-DD HH:mm').isValid()){ // check if min is parsable by moment 
				min = moment($scope.min,'YYYY-MM-DD HH:mm');
			}else if(moment($scope.min, 'HH:mm').isValid()){ // check if min is leke '23:15'
				var refDate = getRefDate();
				min = moment($scope.min, 'HH:mm').year(refDate.year()).month(refDate.month()).date(refDate.date());
			}
			offset = moment.duration($scope.minOffset);
			min.add(offset);
			return min;
		};
		var getMax = function(){
			var max;
			var offset;
			if(!$scope.max){ return undefined; } // max attr not specified
			if(!!$scope.max.isValid && !!$scope.max.isValid()){ // check if max is a valid moment
				max = moment($scope.max);
			}else if(moment($scope.max,'YYYY-MM-DD HH:mm').isValid()){ // check if max is parsable by moment 
				max = moment($scope.max,'YYYY-MM-DD HH:mm');
			}else if(moment($scope.max, 'HH:mm').isValid()){ // check if max is leke '23:15'
				var refDate = getRefDate();
				max = moment($scope.max, 'HH:mm').year(refDate.year()).month(refDate.month()).date(refDate.date());
				if (max.hours() + max.minutes() === 0){ // a max time of '00:00' means midnight tomorrow
					max.add(1,'d');
				}
			}
			offset = moment.duration($scope.maxOffset);
			max.add(offset);
			return max;
		};
		var currentValue = function(){
			if(!$scope.format){
				return $scope.ngModelCtrl.$viewValue;
			}else{
				return moment($scope.ngModelCtrl.$viewValue, $scope.format);
			}
		};

		// internal machinery - checkSomethin
		this.checkMin = function(newValue){
			var min = getMin();
			return !min || min.diff(newValue)<=0;
		};
		this.checkMax = function(newValue){
			var max = getMax();
			return !max || max.diff(newValue)>=0;
		};

		// events - mousewheel and arrowkeys
		this.setupEvents = function( hoursInput, minsInput){
			// setupMousewheelEvents(elt);
			setupArrowkeyEvents( hoursInput, minsInput);
			setupMousewheelEvents( hoursInput, minsInput);
		};
		var setupArrowkeyEvents = function( hoursInput, minsInput ) {
			var step = getStep();
			hoursInput.bind('keydown', function(e) {
				if ( e.which === 38 ) { // up
					e.preventDefault();
					incr(60);
					$scope.$apply();
				}
				else if ( e.which === 40 ) { // down
					e.preventDefault();
					incr(-60);
					$scope.$apply();
				}
				else if ( e.which === 13 ) { // enter
					e.preventDefault();
					$scope.formatInputValue();
					$scope.$apply();
				}
			});
			minsInput.bind('keydown', function(e) {
				if ( e.which === 38 ) { // up
					e.preventDefault();
					incr(step);
					$scope.$apply();
				}
				else if ( e.which === 40 ) { // down
					e.preventDefault();
					incr(-step);
					$scope.$apply();
				}
				else if ( e.which === 13 ) { // enter
					e.preventDefault();
					$scope.formatInputValue();
					$scope.$apply();
				}
			});
		};
		var setupMousewheelEvents = function(  hoursInput, minsInput ) {
			var step = getStep();
			var isScrollingUp = function(e) {
				if (e.originalEvent) {
					e = e.originalEvent;
				}
				//pick correct delta variable depending on event
				var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
				return (e.detail || delta > 0);
			};
			hoursInput.bind('mousewheel wheel', function(e) {
				if(!$scope.disabled){
					$scope.$apply( incr((isScrollingUp(e)) ? 60 : -60 ));
					e.preventDefault();
				}
			});
			minsInput.bind('mousewheel wheel', function(e) {
				if(!$scope.disabled){
					$scope.$apply( incr((isScrollingUp(e)) ? step : -step ));
					e.preventDefault();
				}
			});
		};

	}]);
	angular.module("lui.templates.momentpicker").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidMoment.html",
			"<div class='luid-moment' ng-class='{disabled:disabled}'>" + 
			"	<input type='text' ng-model='hours' ng-change='changeHours()' luid-select-on-click ng-pattern='pattern' luid-focus-on='focusHours'   ng-focus='focusHours()' ng-blur='blurHours()' ng-disabled='disabled' maxlength=2>:" +
			// This indentation issue is normal and needed
			"	<input type='text' ng-model='mins'  ng-change='changeMins()'  luid-select-on-click ng-pattern='pattern' luid-focus-on='focusMinutes' ng-focus='focusMins()'  ng-blur='blurMins()'  ng-disabled='disabled' maxlength=2>" +
			"	<span ng-if='hasButtons' ng-click='incrHours()' ng-show='showButtons||hoursFocused||minsFocused' class='mp-button top left lucca-icon lucca-icon-plus'         ng-class='{disabled:maxed}'></span>" + 
			"	<span ng-if='hasButtons' ng-click='decrHours()' ng-show='showButtons||hoursFocused||minsFocused' class='mp-button bottom left lucca-icon lucca-icon-minimize'  ng-class='{disabled:mined}'></span>" + 
			"	<span ng-if='hasButtons' ng-click='incrMins()'  ng-show='showButtons||hoursFocused||minsFocused' class='mp-button top right lucca-icon lucca-icon-plus'        ng-class='{disabled:maxed}'></span>" + 
			"	<span ng-if='hasButtons' ng-click='decrMins()'  ng-show='showButtons||hoursFocused||minsFocused' class='mp-button bottom right lucca-icon lucca-icon-minimize' ng-class='{disabled:mined}'></span>" + 
			"</div>" + 
			"");
	}]);
	angular.module('lui.directives')
	.directive('luidSelectOnClick', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.on('click', function () {
					this.select();
				});
				element.on('focus', function () {
					this.select();
				});
			}
		};
	});
	angular.module('lui.directives')
	.directive('luidFocusOn', function() {
		return function(scope, elem, attr) {
			scope.$on(attr.focusOn, function(e) {
				elem[0].focus();
			});
		};
	});
})();
