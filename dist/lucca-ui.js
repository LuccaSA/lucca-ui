(function(){
	'use strict';
	angular.module('moment', []).factory('moment', function () { return window.moment; });
	
	angular.module('lui.directives', ['moment']);
	angular.module('lui.filters', ['moment']);
	angular.module('lui.services', []);
	// all the templates in one module
	angular.module('lui.templates.momentpicker', []); // module defined here and used in a different file so every page doesnt have to reference moment-picker.js
	angular.module("lui.templates.daterangepicker", []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module('lui.templates', ['lui.templates.momentpicker', "lui.templates.daterangepicker"]);

	angular.module('lui', ['lui.directives','lui.services','lui.filters','lui.templates']);
})();
;(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - moment
	**  - ui bootstrap datepicker
	**  - ui bootstrap popover
	**/

	angular.module('lui.directives')
	.directive('luidDaterange', ['moment', '$filter', '$document', '$timeout', function(moment, $filter, $document, $timeout){
		function link(scope, element, attrs, ctrls){
			var ngModelCtrl = ctrls[1];
			var drCtrl = ctrls[0];
			scope.internal={};

			scope.hasPeriods = !!attrs.periods;

			ngModelCtrl.$render = function(){
				if(!ngModelCtrl.$viewValue){ 
					scope.internal.startsOn = undefined;
					scope.internal.endsOn = undefined;
					scope.internal.strFriendly = undefined;
					return; 
				}

				var parsed = parse(ngModelCtrl.$viewValue);
				scope.internal.startsOn = parsed.startsOn;
				scope.internal.endsOn = parsed.endsOn;
				scope.internal.strFriendly = $filter("luifFriendlyRange")(scope.internal);
			};
			scope.$watch(function($scope){ return ngModelCtrl.$viewValue[$scope.startProperty || "startsOn"]; }, function(){ ngModelCtrl.$render(); });
			scope.$watch(function($scope){ return ngModelCtrl.$viewValue[$scope.endProperty || "endsOn"]; }, function(){ ngModelCtrl.$render(); });
			
			drCtrl.updateValue = function(startsOn, endsOn){
				var newValue = ngModelCtrl.$viewValue;
				var formatted = format(startsOn,endsOn);
				newValue[Object.keys(formatted)[0]] = formatted[Object.keys(formatted)[0]];
				newValue[Object.keys(formatted)[1]] = formatted[Object.keys(formatted)[1]];
				ngModelCtrl.$setViewValue(newValue);
				scope.$parent.$eval(attrs.ngChange);
			};
			var format = function(startsOn, endsOn){
				var mstart = moment(startsOn);
				var mend = moment(endsOn);
				if(scope.excludeEnd){
					mend.add(1, 'd');
				}
				var startProperty = scope.startProperty || 'startsOn';
				var endProperty = scope.endProperty || 'endsOn';
				var result = {};
				switch(scope.format || "moment"){
					case "moment":
						result[startProperty] = mstart;
						result[endProperty] = mend;
						break;
					case "date":
						result[startProperty] = mstart.toDate();
						result[endProperty] = mend.toDate();
						break;
					default:
						result[startProperty] = mstart.format(scope.format);
						result[endProperty] = mend.format(scope.format);
				}
				return result;
			};
			var parse = function(viewValue){
				var startProperty = scope.startProperty || 'startsOn';
				var endProperty = scope.endProperty || 'endsOn';
				var mstart, mend;
				switch(scope.format || "moment"){
					case "moment":
					case "date":
						mstart = moment(viewValue[startProperty]);
						mend = moment(viewValue[endProperty]);
						break;
					default:
						mstart = moment(viewValue[startProperty], scope.format);
						mend = moment(viewValue[endProperty], scope.format);
				}
				if(scope.excludeEnd){
					mend.add(-1, 'd');
				}
				var parsed = { startsOn: mstart.toDate(), endsOn:mend.toDate() };
				return parsed;
			};
			var unpin = function(){
				scope.popoverOpened = false;
				drCtrl.unpinPopover();
				scope.$apply(); // commits changes to popoverOpened and hide the popover
			};
			drCtrl.pinPopover = function () {
				$timeout(function(){ $document.on("click", unpin); }, 10);
			};
			drCtrl.unpinPopover = function () {
				$document.off("click", unpin);
			};
		}
		return{
			require:['luidDaterange','^ngModel'],
			controller:'luidDaterangeController',
			scope: {
				disabled:'=',

				format:'@', // if you want to bind to moments, dates or a string with a specific format
				startProperty: '@',
				endProperty: '@',

				popoverPlacement:'@',

				excludeEnd:'=', // user will see "oct 1st - 31st" and the $viewvalue will be "oct 1st - nov 1st"

				periods:'=', // an array like that [{label:'this month', startsOn:<Date or moment or string parsable by moment>, endsOn:idem}, {...}]

				closeLabel: '@',
				closeAction:'&',
			},
			templateUrl:"lui/directives/luidDaterange.html",
			restrict:'EA',
			link:link
		};
	}])
	.controller('luidDaterangeController', ['$scope', 'moment', '$filter', function($scope, moment, $filter){
		var ctrl = this;

		$scope.internalUpdated = function(){
			if(moment($scope.internal.startsOn).diff($scope.internal.endsOn) > 0){
				$scope.internal.endsOn = moment($scope.internal.startsOn);
			}

			// HACKS
			$scope.hackRefresh = !$scope.hackRefresh;

			ctrl.updateValue($scope.internal.startsOn, $scope.internal.endsOn);
			$scope.internal.strFriendly = $filter("luifFriendlyRange")($scope.internal);
		};

		$scope.goToPeriod = function(period){
			$scope.internal.startsOn = moment(period.startsOn).toDate();
			$scope.internal.endsOn = moment(period.endsOn).toDate();
			if($scope.excludeEnd){ $scope.internal.endsOn = moment(period.endsOn).add(-1,'day').toDate(); }
			$scope.internalUpdated();
		};

		// Popover display
		$scope.popoverOpened = false;
		$scope.togglePopover = function(){
			$scope.popoverOpened = !$scope.popoverOpened;
			if($scope.popoverOpened){
				ctrl.pinPopover();
			}else{
				ctrl.unpinPopover();
			}
		};
		$scope.doCloseAction = function(){
			$scope.togglePopover();
			if(!!$scope.closeAction){
				$scope.closeAction();
			}
		};
		$scope.clickInside = function(e){
			e.preventDefault();
			e.stopPropagation();
		};

		// datepickers stuff
		$scope.dayClass = function(date, mode){
			var className = "";
			if(mode === "day" && moment(date).diff($scope.internal.startsOn) === 0) {
				className = "start";
			}
			if(mode === "day" && moment(date).diff($scope.internal.endsOn) === 0){
				className += "end";
			}
			if(mode === "day" && moment(date).isAfter($scope.internal.startsOn) && moment(date).isBefore($scope.internal.endsOn)) {
				className += "in-between";
			}
			return className;
		};

	}]);


	/**************************/
	/***** TEMPLATEs      *****/
	/**************************/
	angular.module("lui.templates.daterangepicker").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidDaterange.html",
			"<input ng-model='internal.strFriendly' ng-disabled='disabled || popoverOpen' ng-click='togglePopover()'" +
			"uib-popover-template=\"'lui/directives/luidDaterangePopover.html'\"" +
			"popover-placement=\"{{popoverPlacement}}\"" +
			"popover-trigger ='none' popover-is-open='popoverOpened'" +
			"popover-class ='lui daterange popover {{hasPeriods?\"has-periods\":\"\"}}'" +
			">");
		$templateCache.put("lui/directives/luidDaterangePopover.html",
			"<div class=\"lui clear\" ng-click=\"clickInside($event)\">" +
			"	<div class=\"lui vertical pills shortcuts menu\">" +
			"		<a class='lui item' ng-repeat='period in periods' ng-click='goToPeriod(period)'>{{period.label}}</a>" +
			"	</div>" +
			"	<uib-datepicker ng-if='hackRefresh' class='lui datepicker' ng-model='internal.startsOn' show-weeks='false' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='hackRefresh' class='lui datepicker' ng-model='internal.endsOn' show-weeks='false' min-date='internal.startsOn' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='!hackRefresh' class='lui datepicker' ng-model='internal.startsOn' show-weeks='false' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='!hackRefresh' class='lui datepicker' ng-model='internal.endsOn' show-weeks='false' min-date='internal.startsOn' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<hr>" +
			"	<a class='lui right pulled primary button' ng-click='doCloseAction()'>{{closeLabel || 'Ok'}}</a>" +
			"</div>" +
			"");
	}]);
})();
;(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - none
	**/
	angular.module('lui.directives')
	.directive('luidKeydown', function () {
		return {
			restrict: 'A',
			scope:{
				mappings: '='
			},
			link: function (scope, element, attrs) {
				element.on('keydown', function (e) {
					if ( !!scope.mappings && !!scope.mappings[e.which] ){
						scope.mappings[e.which]();
						e.preventDefault();
					}
				});
			}
		};
	});
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
			scope.$on(attr.luidFocusOn, function(e) {
				elem[0].focus();
			});
		};
	});
})();
;(function () {
	'use strict';

	angular.module('lui.directives').directive('luidSelect', [function () {
		return {
			require: '^ngModel',
			scope: {
				options: '=', 
				placeholder: '@',
				displayProp:'@',

				ngDisabled:'=',

				classes:'@', 

				onSelect:'&',
				onRemove:'&'
			},
			restrict: 'E',
			template:
			'<ui-select theme="bootstrap" on-select="onSelect()" on-remove="onRemove()" class="lui nguibs-ui-select {{classes}}" ng-disabled="ngDisabled">' + 
			'	<ui-select-match placeholder="{{placeholder}}">{{$select.selected[displayProp]}}</ui-select-match>' + 
			'	<ui-select-choices repeat="option in options | filter: $select.search">' + 
			'		<div ng-bind-html="option[displayProp] | highlight: $select.search"></div>' + 
			'	</ui-select-choices>' + 
			'</ui-select>'
		};
	}]);
})();
;(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - moment
	**/

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
					}else{
						scope.hours = undefined;
						scope.mins = undefined;
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
					if(this.$viewValue && !!this.$viewValue.isValid && this.$viewValue.isValid()){
						scope.hours = this.$viewValue.format('HH');
						scope.mins = this.$viewValue.format('mm');
					}else{
						scope.hours = undefined;
						scope.mins = undefined;
					}
				};
				ngModelCtrl.setValue = function(newMomentValue){ ngModelCtrl.$setViewValue(newMomentValue); };
			}

			scope.ngModelCtrl = ngModelCtrl;

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
			if(!curr || !curr.isValid()){curr = getRefDate().startOf('day');}
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
			if(intMinutes > 60){ intMinutes = 59; $scope.mins = "59"; }

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
			"	<input type='text' ng-model='hours' ng-change='changeHours()' luid-select-on-click ng-pattern='pattern' luid-focus-on='focusHours'   ng-focus='focusHours()' ng-blur='blurHours()' ng-disabled='disabled' maxlength=2> : " +
			// This indentation issue is normal and needed
			"	<input type='text' ng-model='mins'  ng-change='changeMins()'  luid-select-on-click ng-pattern='pattern' luid-focus-on='focusMinutes' ng-focus='focusMins()'  ng-blur='blurMins()'  ng-disabled='disabled' maxlength=2>" +
			"	<i ng-if='hasButtons' ng-click='incrHours()' ng-show='showButtons||hoursFocused||minsFocused' class='lui mp-button top left north arrow icon'     ng-class='{disabled:maxed}'></i>" +
			"	<i ng-if='hasButtons' ng-click='decrHours()' ng-show='showButtons||hoursFocused||minsFocused' class='lui mp-button bottom left south arrow icon'  ng-class='{disabled:mined}'></i>" +
			"	<i ng-if='hasButtons' ng-click='incrMins()'  ng-show='showButtons||hoursFocused||minsFocused' class='lui mp-button top right north arrow icon'    ng-class='{disabled:maxed}'></i>" +
			"	<i ng-if='hasButtons' ng-click='decrMins()'  ng-show='showButtons||hoursFocused||minsFocused' class='lui mp-button bottom right south arrow icon' ng-class='{disabled:mined}'></i>" +
			"</div>" +
			"");
	}]);
})();
;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - none
	**/

	angular.module('lui.directives').directive('luidPercentage', function () {
		function link(scope, element, attrs, ctrls) {

			var ngModelCtrl = ctrls[1];
			var luidPercentageCtrl = ctrls[0];
			scope.pattern = /^([0-9]+)(\.([0-9]*)?)?$/i;
			if (!attrs.format) {
				scope.format = "0.XX";
			}else if(attrs.format !== "0.XX" && attrs.format !== "1.XX" && attrs.format !== "XX"){
				ngModelCtrl.$render = function () { scope.intPct = "unsupported format"; };
				return;
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$render = function () {
				if (this.$viewValue === undefined) {
					scope.intPct = undefined;
					return;
				}
				// must support the different formats here
				scope.intPct = scope.parse(parseFloat(this.$viewValue));
			};

			// call the ng-change
			ngModelCtrl.$viewChangeListeners.push(function () {
				scope.$eval(attrs.ngChange);
			});

			// bind to various events - here only keypress=enter
			luidPercentageCtrl.setupEvents(element.find('input'));
		}


		return {
			require: ['luidPercentage', '^ngModel'],
			controller: 'luidPercentageController',
			scope: {
				step: '=', // default = 5
				format: '@', // 'XX', '0.XX' or '1.XX', default 0.XX
				ngDisabled: '=',
				placeholder: '@'
			},
			restrict: 'EA',
			link: link,
			template: "<div class='lui short input with addon'><input class='lui right aligned' type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-model='intPct' ng-change='updateValue()' ng-blur='formatInputValue()'><i class='lui right addon'>%</i></div>"
		};
	})
	.controller('luidPercentageController', ['$scope', function ($scope) {

		// public methods for update
		$scope.updateValue = function () {
			if ($scope.intPct === undefined) { return updateWithoutRender(undefined); } 

			// transform this duration into a string
			var newValue = format($scope.intPct);

			// update viewvalue
			updateWithoutRender(newValue);
		};
		var format = function (pct) {
			// should support deifferents formats
			switch($scope.format || "0.XX"){
				case "XX":
					return pct;
				case "0.XX":
					return pct/100;
				case "1.XX":
					return pct/100 + 1;
			}
			return 0;
		};

		$scope.parse = function (intInput) {
			// should support deifferents formats
			switch($scope.format || "0.XX"){
				case "XX":
					return intInput;
				case "0.XX":
					return Math.round(10000 * intInput) / 100;
				case "1.XX":
					return Math.round((intInput-1) * 10000) / 100;
			}
			return 0;
		};

		// private - updates of some kinds
		// incr value by `step` minutes
		var incr = function (step) {
			var newValue = format(parseFloat($scope.intPct) + step);
			update(newValue);
		};

		// sets viewValue and renders
		var update = function (newValue) {
			$scope.ngModelCtrl.$setViewValue(newValue);
			$scope.ngModelCtrl.$render();
		};
		var updateWithoutRender = function (newValue) {
			$scope.ngModelCtrl.$setViewValue(newValue);
		};

		// display stuff
		$scope.formatInputValue = function () {
			$scope.ngModelCtrl.$render();
		};

		// events - key 'enter'
		this.setupEvents = function (elt) {
			setupKeyEvents(elt);
			setupMousewheelEvents(elt);
		};

		var setupKeyEvents = function (elt) {
			var step = 5;
			if (!isNaN(parseInt($scope.step))) {
				step = parseInt($scope.step);
			}
			elt.bind('keydown', function (e) {
				if (e.which === 38) { // up
					e.preventDefault();
					incr(step);
					$scope.$apply();
				} else if (e.which === 40) { // down
					e.preventDefault();
					incr(-step);
					$scope.$apply();
				}
				if (e.which === 13) { // enter
					e.preventDefault();
					$scope.formatInputValue();
					$scope.$apply();
				}
			});
		};
		var setupMousewheelEvents = function (elt) {
			var step = 5;
			if (!isNaN(parseInt($scope.step))) {
				step = parseInt($scope.step);
			}
			var isScrollingUp = function (e) {
				if (e.originalEvent) {
					e = e.originalEvent;
				}
				//pick correct delta variable depending on event
				var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
				return (e.detail || delta > 0);
			};

			elt.bind('mousewheel wheel', function (e) {
				if (this === document.activeElement) {
					$scope.$apply(incr((isScrollingUp(e)) ? step : -step));
					e.preventDefault();
				}
			});
		};
	}]);
})();
;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment
	**/
	
	angular.module('lui.directives').directive('luidTimespan', ['moment', function (moment) {
		function link(scope, element, attrs, ctrls) {

			var ngModelCtrl = ctrls[1];
			var luidTimespanCtrl = ctrls[0];
			scope.pattern = /^([0-9]+)((h([0-9]{2})?)?(m(in)?)?)?$/i;
			if (!!attrs.unit) {
				var unit = scope.$eval(attrs.unit);
				if (unit == 'h' || unit == 'hour' || unit == 'hours') {
					scope.useHours = true;
				}
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$render = function () {
				if (!this.$viewValue) {
					scope.strDuration = '';
					return;
				}

				var currentDuration = moment.duration(this.$viewValue);
				var hours = Math.floor(currentDuration.asHours());
				var minutes = currentDuration.minutes();
				if (hours === 0) {
					scope.strDuration = minutes + 'm';
				} else {
					scope.strDuration = (hours < 10 ? '0' : '') + hours + 'h' + (minutes < 10 ? '0' : '') + minutes;
				}
			};

			// bind to various events - here only keypress=enter
			luidTimespanCtrl.setupEvents(element.find('input'));

			// set to given mode or to default mode
			luidTimespanCtrl.mode = attrs.mode ? attrs.mode : "timespan";
		}


		return {
			require: ['luidTimespan', '^ngModel'],
			controller: 'luidTimespanController',
			scope: {
				step: '=', // default = 5
				unit: '=', // 'hours', 'hour', 'h' or 'm', default='m'
				ngDisabled: '=',
				placeholder: '@',
				mode: "=", // 'timespan', 'moment.duration', default='timespan'
				// Min/max values
				min: '=',
				max: '=',
			},
			restrict: 'EA',
			link: link,
			template: "<input type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-pattern='pattern' ng-model='strDuration' ng-change='updateValue()' ng-blur='formatInputValue()'>"
		};
	}])
	.controller('luidTimespanController', ['$scope', 'moment', function ($scope, moment) {
		var ctrl = this;

		// public methods for update
		$scope.updateValue = function () {
			// is only fired when pattern is valid or when it goes from valid to invalid
			// improvement possible - check the pattern and set the validity of the all directive via ngModelCtrl.$setValidity
			// currently when pattern invalid, the viewValue is set to '00:00:00'
			if (!$scope.strDuration) { return updateWithoutRender(undefined); } // empty input => 00:00:00

			// temp variables
			var newDuration; // the duration of the parsed strDuration
			var newValue;

			// parse the strDuration to build newDuration
			newDuration = parse($scope.strDuration);

			// Check min/max values
			if (!checkMin(newDuration)) {
				newDuration = getMin();
			}
			if (!checkMax(newDuration)) {
				newDuration = getMax();
			}

			// transform this duration into a string
			newValue = format(newDuration);

			// update viewvalue
			updateWithoutRender(newValue);
		};
		var format = function (dur) {
			if (ctrl.mode === 'timespan') {
				return (dur.days() > 0 ? Math.floor(dur.asDays()) + '.' : '') + (dur.hours() < 10 ? '0' : '') + dur.hours() + ':' + (dur.minutes() < 10 ? '0' : '') + dur.minutes() + ':00';
			} else {
				return dur;
			}
		};
		var parse = function (strInput) {
			var newDuration;
			if (/h/i.test(strInput)) {
				newDuration = parseHoursAndMinutes(strInput);
			} else if (/m/i.test(strInput)) {
				newDuration = parseMinutes(strInput);
			} else if ($scope.useHours) {
				newDuration = parseHours(strInput);
			} else {
				newDuration = parseMinutes(strInput);
			}
			return newDuration;
		};

		// private - parsing str to moment.duration
		var parseHoursAndMinutes = function (strInput) {
			var d = moment.duration();
			var splitted = strInput.split(/h/i);
			d.add(parseInt(splitted[0]), 'hours');
			var strMin = splitted[1];
			if (!!strMin && strMin.length >= 2) {
				d.add(parseInt(strMin.substring(0, 2)), 'minutes');
			}
			return d;
		};
		var parseMinutes = function (strInput) {
			var d = moment.duration();
			var splitted = strInput.split(/m/i);
			d.add(parseInt(splitted[0]), 'minutes');
			return d;
		};
		var parseHours = function (strInput) {
			var d = moment.duration();
			var splitted = strInput.split(/h/i);
			d.add(parseInt(splitted[0]), 'hours');
			return d;
		};

		// private - formatting stuff
		var formatValue = function (duration) {
			if (ctrl.mode === "timespan") {
				return Math.floor(duration.asDays()) + '.' + (duration.hours() < 10 ? '0' : '') + duration.hours() + ':' + (duration.minutes() < 10 ? '0' : '') + duration.minutes() + ':00';
			}
			else {
				return duration;
			}
		};

		// private - updates of some kinds
		// incr value by `step` minutes
		var incr = function (step) {
			var newDur = moment.duration(currentValue()).add(step, 'minutes');
			if (newDur.asMilliseconds() < 0) {
				newDur = moment.duration();
			}
			// Check min/max values
			if (!checkMin(newDur)) {
				newDur = getMin();
			}
			if (!checkMax(newDur)) {
				newDur = getMax();
			}
			var newValue = formatValue(newDur);
			update(newValue);
		};

		// sets viewValue and renders
		var update = function (newValue) {
			$scope.ngModelCtrl.$setViewValue(newValue);
			$scope.ngModelCtrl.$render();
		};
		var updateWithoutRender = function (newValue) {
			$scope.ngModelCtrl.$setViewValue(newValue);
		};

		// display stuff
		$scope.formatInputValue = function () {
			$scope.ngModelCtrl.$render();
		};

		var currentValue = function () {
			return $scope.ngModelCtrl.$viewValue;
		};

		// events - key 'enter'
		this.setupEvents = function (elt) {
			setupKeyEvents(elt);
			setupMousewheelEvents(elt);
		};

		var setupKeyEvents = function (elt) {
			var step = 5;
			if (!isNaN(parseInt($scope.step))) {
				step = parseInt($scope.step);
			}
			elt.bind('keydown', function (e) {
				if (e.which === 38) { // up
					e.preventDefault();
					incr(step);
					$scope.$apply();
				} else if (e.which === 40) { // down
					e.preventDefault();
					incr(-step);
					$scope.$apply();
				}
				if (e.which === 13) { // enter
					e.preventDefault();
					$scope.formatInputValue();
					$scope.$apply();
				}
			});
		};
		var setupMousewheelEvents = function (elt) {
			var step = 5;
			if (!isNaN(parseInt($scope.step))) {
				step = parseInt($scope.step);
			}
			var isScrollingUp = function (e) {
				if (e.originalEvent) {
					e = e.originalEvent;
				}
				//pick correct delta variable depending on event
				var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
				return (e.detail || delta > 0);
			};

			elt.bind('mousewheel wheel', function (e) {
				if (this === document.activeElement) {
					$scope.$apply(incr((isScrollingUp(e)) ? step : -step));
					e.preventDefault();
				}
			});
		};

		// Handle min/max values
		var checkMin = function(newValue) {
			var min = getMin();
			return !min || min <= newValue;
		};
		var checkMax = function(newValue) {
			var max = getMax();
			return !max || max >= newValue;
		};
		var getMin = function() {
			if (!$scope.min) {
				return undefined;
			}
			return moment.duration($scope.min);
		};
		var getMax = function() {
			if (!$scope.max) {
				return undefined;
			}
			return moment.duration($scope.max);
		};
	}]);
})();
;(function () {
	'use strict';

	angular.module('lui.directives').directive('luidUserSelect', [function () {
		return {
			require: '^ngModel',
			scope: {
				users: '=', // users must have at least those fields : id, displayname
				placeholder: '@',
				onSelect:'&',
				onRemove:'&'
			},
			restrict: 'E',
			template:
			'<ui-select theme="bootstrap" on-select="onSelect()" on-remove="onRemove()">' + 
			'	<ui-select-match placeholder="{{placeholder}}">{{$select.selected.displayName}}</ui-select-match>' + 
			'	<ui-select-choices repeat="user in users | filter: $select.search">' + 
			'		<div ng-bind-html="user.displayName"></div>' + 
			'	</ui-select-choices>' + 
			'</ui-select>'
		};
	}]);
})();
;(function(){
	'use strict';
	/**
	** DEPENDENCIES
	**  - none, nothing, nada
	**/
	function replaceAll(string, find, replace) {
		// http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
		// lets not reinvent the wheel
		if(!string){ return ''; }
		function escapeRegExp(string) {
			return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
		}
		return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}
	angular.module('lui.filters')
	.filter('luifPlaceholder', function () {
		return function (_input, _placeholder) {
			return !!_input ? _input : _placeholder;
		};
	})
	.filter('luifDefaultCode', function () {
		// uppercased and with '_' instead of ' '
		return function (_input) {
			return replaceAll(_input, ' ', '_').toUpperCase();
		};
	})
	.filter('luifStartFrom', function () {
		//pagination filter
		return function (_input, start) {
			start = +start; //parse to int
			return _input.slice(start);
		};
	})
	.filter('luifNumber', ['$sce', '$filter', function($sce, $filter) {
		return function(_input, _precision, _placeholder) {
			var placeholder = _placeholder === undefined ? '' : _placeholder;
			// alert(_input + " " + (!!_input.isNaN && _input.isNaN()));
			var input = _input === undefined || _input === null || _input === "" || _input != _input ? placeholder : _input; // the last check is to check if _input is NaN
			var separator = $filter("number")(1.1,1)[1];
			var precision = _precision === undefined || _precision === null || _precision != _precision ? 2 : _precision;

			var text = $filter("number")(input, precision);
			var decimalPart = (text || $filter("number")(0, precision)).split(separator)[1];
			var rightSpan;

			if(decimalPart === undefined){
				rightSpan = "<span style=\"opacity:0\"></span>";
			}else if(parseInt(decimalPart) === 0){
				rightSpan = "<span style=\"opacity:0\">" + separator + decimalPart + "</span>";
			}else{
				rightSpan = "<span>" + separator + decimalPart + "</span>";
			}
			if(input === '' || !text){
				// the _input or the _placeholder was not parsable by the number $filter, just return input but trusted as html
				return $sce.trustAsHtml(input + rightSpan);
			}

			var integerPart = text.split(separator)[0];
			return $sce.trustAsHtml(integerPart + rightSpan);
		};
	}]);
})();;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment
	**/
	var formatMoment = function (_moment, _format) { //expects a moment
		var m = moment(_moment);
		if (m.isValid()) {
			return m.format(_format);
		} else {
			return _moment;
		}
	};

	angular.module('lui.filters')
	.filter('luifFriendlyRange', function () {
		var traductions = {
			'en': {
				sameDay: 'start(LL)',
				sameMonth: 'start(MMMM Do) - end(Do\, YYYY)',
				sameYear: 'start(MMMM Do) - end(LL)',
				other: 'start(LL) - end(LL)'
			},
			'fr': {
				sameDay: 'le start(LL)',
				sameMonth: 'du start(Do) au end(LL)',
				sameYear: 'du start(Do MMMM) au end(LL)',
				other: 'du start(LL) au end(LL)'
			}
		};
		var currentYearTraductions = {
			'en': {
				sameDay: 'start(MMMM Do)',
				sameMonth: 'start(MMMM Do) - end(Do)',
				sameYear: 'start(MMMM Do) - end(MMMM Do)',
				other: 'start(LL) - end(LL)'
			},
			'fr': {
				sameDay: 'le start(Do MMMM)',
				sameMonth: 'du start(Do) au end(Do MMMM)',
				sameYear: 'du start(Do MMMM) au end(Do MMMM)',
				other: 'du start(LL) au end(LL)'
			}
		};
		return function (_block, _excludeEnd) {
			if(!_block){ return; }
			var start = moment(_block.startsAt || _block.startsOn || _block.startDate || _block.start);
			var end = moment(_block.endsAt || _block.endsOn || _block.endDate || _block.end);
			if(_excludeEnd){
				end.add(-1,'d');
			}
			var trads = traductions[moment.locale()] || traductions.en;
			if(moment().year() === start.year() && moment().year() === end.year()){
				trads = currentYearTraductions[moment.locale()] || currentYearTraductions.en;
			}
			var format = start.year() === end.year() ? start.month() === end.month() ? start.date() === end.date() ? 'sameDay' : 'sameMonth' : 'sameYear' : 'other';
			var regex = /(start\((.*?)\))(.*(end\((.*?)\))){0,1}/gi.exec(trads[format]);
			return trads[format].replace(regex[1], start.format(regex[2])).replace(regex[4], end.format(regex[5]));
		};
	})
	.filter('luifMoment', function () {
		return function (_moment, _format) {
			if (!_format) { _format = 'LLL'; } // default format
			return formatMoment(_moment, _format);
		};
	})
	.filter('luifCalendar', function () {
		return function (_moment, _refDate) {
			var m = moment(_moment);
			var refDate = (_refDate && moment(_refDate).isValid()) ? moment(_refDate) : moment();

			if (m.isValid()) {
				return m.calendar(_refDate);
			} else {
				return _moment;
			}
		};
	})
	// this filter is very ugly and i'm sorry - i'll add lots of comments
	.filter('luifDuration', ['$filter', function ($filter) {
		return function (_duration, _sign, _unit, _precision) {  //expects a duration, returns the duration in the given unit with the given precision
			var d = moment.duration(_duration);

			if(d.asMilliseconds() === 0){ return ''; }

			// parse duration
			var values = [Math.abs(d.days()), Math.abs(d.hours()), Math.abs(d.minutes()), Math.abs(d.seconds()), Math.abs(d.milliseconds())];
			var units = ['d ', 'h', 'm', 's', 'ms'];
			var unit;

			// First we get the floor part of the unit of the duration : 1d11h = 1.x day or 35 hours or 2100 minutes depending on your unit
			switch(_unit){
				case 'd':
				case 'day':
				case 'days':
					_precision = !!_precision ? _precision : 'h'; // if no precision is provided, we take the next unit

					if ((_precision === 'd' || _precision === 'day' || _precision === 'days') && d.asDays() > 0) {
						unit = 0;
						// Determine the number of decimals to display
						var decimals = 2;
						var days = d.asDays();
						if ((days * 10) % 10 === 0) {
							decimals = 0;
						} else if ((days * 100) % 10 === 0) {
							decimals = 1;
						}
						values[0] = $filter("number")(days, decimals);
					} else {
						// the first unit with a not nul member, if you want 15 minutes expressed in days it will respond 15m
						unit = values[0] !== 0 ? 0 : values[1] !== 0 ? 1 : values[2] !== 0 ? 2 : values[3] !== 0 ? 3 : 4;
						values[0] = Math.abs(d.asDays() >= 0 ? Math.floor(d.asDays()) : Math.ceil(d.asDays()));
					}
					break;
				case undefined:
				case '': // if no _unit is provided, use hour
				case 'h':
				case 'hour':
				case 'hours':
					_precision = _precision || 'm';
					unit = (values[0] !== 0 || values[1] !== 0) ? 1 : values[2] !== 0 ? 2 : values[3] !== 0 ? 3 : 4; // the first unit with a not nul member
					values[1] = Math.abs(d.asHours() >= 0 ? Math.floor(d.asHours()) : Math.ceil(d.asHours()));
					break;
				case 'm':
				case 'min':
				case 'mins':
				case 'minute':
				case 'minutes':
					_precision = _precision || 's';
					unit = (values[0] !== 0 || values[1] !== 0 || values[2] !== 0) ? 2 : values[3] !== 0 ? 3 : 4; // the first unit with a not nul member
					values[2] = Math.abs(d.asMinutes() >= 0 ? Math.floor(d.asMinutes()) : Math.ceil(d.asMinutes()));
					break;
				case 's':
				case 'sec':
				case 'second':
				case 'seconds':
					_precision = _precision || 's';
					unit = (values[0] !== 0 || values[1] !== 0 || values[2] !== 0 || values[3] !== 0) ? 3 : 4; // the first unit with a not nul member
					values[3] = Math.abs(d.asSeconds() >= 0 ? Math.floor(d.asSeconds()) : Math.ceil(d.asSeconds()));
					break;
				case 'ms':
				case 'millisec':
				case 'millisecond':
				case 'milliseconds':
					_precision = _precision || 'ms';
					unit = 4;
					values[4] = Math.abs(d.asMilliseconds() >= 0 ? Math.floor(d.asMilliseconds()) : Math.ceil(d.asMilliseconds()));
					break;
			}
			var precision; // if you want 1h as minutes, precision milliseconds you want the result to be 60m and not 60m 00.000s
			switch(_precision){
				case 'd':
				case 'day':
				case 'days':
					precision = 0;
					break;
				case 'h':
				case 'hour':
				case 'hours':
					precision = values[1] !== 0 ? 1 : 0;
					break;
				case 'm':
				case 'min':
				case 'mins':
				case 'minute':
				case 'minutes':
					precision = values[2] !== 0 ? 2 : values[1] !== 0 ? 1 : 0;
					break;
				case 's':
				case 'sec':
				case 'second':
				case 'seconds':
					precision = values[3] !== 0 ? 3 : values[2] !== 0 ? 2 : values[1] !== 0 ? 1 : 0;
					break;
				case 'ms':
				case 'millisec':
				case 'millisecond':
				case 'milliseconds':
					precision = values[4] !== 0 ? 4 : values[3] !== 0 ? 3 : values[2] !== 0 ? 2 : values[1] !== 0 ? 1 : 0;
					break;
			}
			// some localisation shenanigans
			switch(moment.locale()){
				case "fr": units[0] = 'j '; break;
			}

			// if precision = ms and unit bigger than s we want to display 12.525s and not 12s525ms
			if(unit <= 3 && precision === 4){ units[3] = '.'; units[4] = 's'; }
			if(unit <= 1 && precision === 2){ units[2] = ''; }
			if(unit === 2 && precision === 3){ units[3] = ''; }

			var format = function(value, u){
				if (u === unit){
					return value + units[u];
				}
				if (u === 2 || u === 3){
					return (value < 10 ? '0' + value : value) + units[u];
				}
				if (u === 4){
					return (value < 10 ? '00' + value : value < 100 ? '0' + value : value) + units[u];
				}
				return value + units[u];
			};
			var result = '';
			for(var i = unit; i <= precision; i++){
				result += format(values[i],i);
			}

			// add prefix
			var prefix = '';
			if (_sign && !!result) {
				if (d.asMilliseconds() > 0) {
					prefix = '+';
				} else if (d.asMilliseconds() < 0) {
					prefix = '-';
				}
			}

			return prefix + result;
		};
	}])
	.filter('luifHumanize', function () {
		return function (_duration, suffix) {
			suffix = !!suffix;
			var d = moment.duration(_duration);
			return d.humanize(suffix);
		};
	});
})();
