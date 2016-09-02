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
		function link(scope, element, attrs, ctrls) {
			function format(startsOn, endsOn) {
				var startProperty = scope.startProperty || 'startsOn';
				var endProperty = scope.endProperty || 'endsOn';
				var result = {};
				var mstart = moment(startsOn);
				var mend = moment(endsOn);
				if (scope.excludeEnd) {	mend.add(1, 'd'); }

				switch (scope.format || "moment"){
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
						break;
				}

				return result;
			}

			function parse (viewValue){
				var mstart, mend;
				var startProperty = scope.startProperty || 'startsOn';
				var endProperty = scope.endProperty || 'endsOn';

				switch(scope.format || "moment"){
					case "moment":
					case "date":
						mstart = moment(viewValue[startProperty]);
						mend = moment(viewValue[endProperty]);
						break;
					default:
						mstart = moment(viewValue[startProperty], scope.format);
						mend = moment(viewValue[endProperty], scope.format);
						break;
				}

				if (scope.excludeEnd){ mend.add(-1, 'd'); }

				return { startsOn: mstart.toDate(), endsOn:mend.toDate() };
			}

			function unpin(){
				scope.popoverOpened = false;
				drCtrl.unpinPopover();
				scope.$apply(); // commits changes to popoverOpened and hide the popover
			}

			var ngModelCtrl = ctrls[1];
			var drCtrl = ctrls[0];
			scope.internal = {};

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
			scope.$watch(function($scope){ return ngModelCtrl.$viewValue[$scope.startProperty || "startsOn"]; }, function() { ngModelCtrl.$render(); });
			scope.$watch(function($scope){ return ngModelCtrl.$viewValue[$scope.endProperty || "endsOn"]; }, function() { ngModelCtrl.$render(); });

			drCtrl.updateValue = function(startsOn, endsOn){
				var newValue = ngModelCtrl.$viewValue;
				var formatted = format(startsOn,endsOn);
				newValue[Object.keys(formatted)[0]] = formatted[Object.keys(formatted)[0]];
				newValue[Object.keys(formatted)[1]] = formatted[Object.keys(formatted)[1]];
				ngModelCtrl.$setViewValue(newValue);
				scope.$parent.$eval(attrs.ngChange);
			};
			drCtrl.pinPopover = function () { $timeout(function(){ $document.on("click", unpin); }, 10); };
			drCtrl.unpinPopover = function () { $document.off("click", unpin); };
		}

		return {
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
			if (moment($scope.internal.startsOn).diff($scope.internal.endsOn) > 0) {
				$scope.internal.endsOn = moment($scope.internal.startsOn);
			}

			// HACKS
			$scope.hackRefresh = !$scope.hackRefresh;

			ctrl.updateValue($scope.internal.startsOn, $scope.internal.endsOn);
			$scope.internal.strFriendly = $filter("luifFriendlyRange")($scope.internal);
		};
		$scope.goToPeriod = function(period) {
			$scope.internal.startsOn = moment(period.startsOn).toDate();
			$scope.internal.endsOn = moment(period.endsOn).toDate();
			if ($scope.excludeEnd){ $scope.internal.endsOn = moment(period.endsOn).add(-1,'day').toDate(); }
			$scope.internalUpdated();
		};

		// Popover display
		$scope.popoverOpened = false;
		$scope.togglePopover = function() {
			$scope.popoverOpened = !$scope.popoverOpened;
			if($scope.popoverOpened){
				ctrl.pinPopover();
			} else {
				ctrl.unpinPopover();
			}
		};

		$scope.doCloseAction = function() {
			$scope.togglePopover();
			if(!!$scope.closeAction){ $scope.closeAction(); }
		};

		$scope.clickInside = function(e) {
			e.preventDefault();
			e.stopPropagation();
		};

		// datepickers stuff
		var dayClass = function(data){
			var date = data.date;
			var mode = data.mode;
 			var className = '';
			if (mode == 'day') {
				if (moment(date).diff($scope.internal.startsOn) === 0) { className = 'start'; }
				if (moment(date).diff($scope.internal.endsOn) === 0) { className += 'end'; }
				if (moment(date).isAfter($scope.internal.startsOn) && moment(date).isBefore($scope.internal.endsOn)) { className += 'in-between'; }
			}
			return className;
		};
		var startingDay = moment.localeData().firstDayOfWeek();
		$scope.dpOptions = {
			showWeeks: false,
			customClass: dayClass,
			startingDay: startingDay
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
			"	<uib-datepicker ng-if='hackRefresh' class='lui datepicker start-date' ng-model='internal.startsOn' datepicker-options='dpOptions' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='hackRefresh' class='lui datepicker end-date' ng-model='internal.endsOn' datepicker-options='dpOptions' min-date='internal.startsOn' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='!hackRefresh' class='lui datepicker start-date' ng-model='internal.startsOn' datepicker-options='dpOptions' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='!hackRefresh' class='lui datepicker end-date' ng-model='internal.endsOn' datepicker-options='dpOptions' min-date='internal.startsOn' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<hr>" +
			"	<a class='lui right pulled primary button' ng-click='doCloseAction()'>{{closeLabel || 'Ok'}}</a>" +
			"</div>" +
			"");
	}]);
})();;/* global angular */
(function(){
	'use strict';
	var DayBlockDirective = function () {
		return {
			template : 
			'<div>'+

			'<div ng-style="controller.weekdayStyleOverride()" '+
			'ng-if = "controller.showDay" class="weekday">{{controller.date | luifMoment: \'dddd\'}}'+
			'</div>'+

			'<div ng-style="controller.dayStyleOverride()" ' +
			'class="day">{{controller.date | luifMoment:\'DD\'}}'+
			'</div>'+

			'<div ng-style="controller.monthStyleOverride()" ' +
			'class="month">{{controller.date | luifMoment: \'MMM\'}}'+
			'</div>'+

			'<div ng-style="controller.yearStyleOverride()" ' +
			'class="year">{{controller.date | luifMoment: \'YYYY\'}}'+
			'</div>'+

			'</div>',

			scope : {
				date: '=',
				showDay: '=',
				primaryColor: '=',
				secondaryColor: '='
			},

			restrict : 'E',
			bindToController : true,
			controllerAs : 'controller',
			controller : 'luidDayBlockController'
		};
	};


	angular
	.module('lui.directives')
	.directive('luidDayBlock', DayBlockDirective)
	.controller('luidDayBlockController', function(){
		var controller = this;

		controller.weekdayStyleOverride = function() {
			return { 
				color: controller.primaryColor, 
			};
		};
		controller.dayStyleOverride = function() {
			return { 
				"background-color": controller.primaryColor, 
				"border-color": controller.primaryColor, 
				"color": controller.secondaryColor, 
			};
		};
		controller.monthStyleOverride = function() {
			return { 
				"background-color": controller.secondaryColor, 
				"border-color": controller.primaryColor, 
				"color": controller.primaryColor, 
			};
		};
		controller.yearStyleOverride = function() {
			return { 
				"background-color": controller.secondaryColor, 
				"border-color": controller.primaryColor, 
				"color": controller.primaryColor, 
			};
		};


	});

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
				setTimeout( function() { elem[0].focus(); scope.$apply(); }, 1);
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

			scope.hasButtons = attrs.showButtons !== undefined;

			// display the value i on two chars
			if(!!attrs.format){ // allows to have a ng-model of type string, not moment
				var format = scope.$eval(attrs.format);

				ngModelCtrl.$render = function() {
					var momentValue = moment(this.$viewValue, format);
					var condition = this.$viewValue && momentValue.isValid();

					scope.hours = condition ? momentValue.format('HH') : undefined;
					scope.mins = condition ? momentValue.format('mm') : undefined;
					ngModelCtrl.$validate();
				};

				ngModelCtrl.setValue = function(newMomentValue) {
					ngModelCtrl.$setViewValue(!newMomentValue ? undefined : newMomentValue.format(format));
				};
				ngModelCtrl.$validators.min = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMin(moment(modelValue, format));
				};
				ngModelCtrl.$validators.max = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMax(moment(modelValue, format));
				};
			} else {
				ngModelCtrl.$render = function() {
					var condition = this.$viewValue && !!this.$viewValue.isValid && this.$viewValue.isValid();
					scope.hours = condition ? this.$viewValue.format('HH') : undefined;
					scope.mins = condition ? this.$viewValue.format('mm') : undefined;
					ngModelCtrl.$validate();
				};
				ngModelCtrl.setValue = function(newMomentValue) {
					ngModelCtrl.$setViewValue(newMomentValue);
				};
				ngModelCtrl.$validators.min = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMin(modelValue);
				};
				ngModelCtrl.$validators.max = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMax(modelValue);
				};
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$validators.hours = function (modelValue,viewValue) {
				return scope.hours !== undefined && scope.hours !== "" && !isNaN(parseInt(scope.hours));
			};
			ngModelCtrl.$validators.minutes = function (modelValue,viewValue) {
				return scope.mins !== undefined && scope.mins !== "" && parseInt(scope.mins) < 60;
			};

			var inputs = element.find('input');
			mpCtrl.setupEvents(angular.element(inputs[0]), angular.element(inputs[1]));

			// reexecute validators if min or max change
			// will not be reexecuted if min is a moment and something like `min.add(3, 'h')` is called
			scope.$watch('min', function(){
				ngModelCtrl.$validate();
			});
			scope.$watch('max', function(){
				ngModelCtrl.$validate();
			});

		}

		return {
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
	.controller('luidMomentController', ['$scope', '$timeout', 'moment', function($scope, $timeout, moment) {
		function incr(step) {
			function calculateNewValue() {
				function contains(array, value) { return array.indexOf(value) !== -1; }

				var curr = moment(currentValue());
				if (!curr || !curr.isValid()) { curr = getRefDate().startOf('day'); }
				if (contains(specialSteps, Math.abs(step)) && curr.minutes() % step !== 0) {
					step = step < 0 ? - (curr.minutes() % step) : -curr.minutes() % step + step;
				}

				var newValue = curr.add(step,'m');
				newValue.seconds(0);
				return newValue;
			}

			if ($scope.disabled) { return; }
			// $scope.ngModelCtrl.$setValidity('pattern', true);

			update(calculateNewValue(), true);
		}

		function update(newValue, autoCorrect) {
			updateWithoutRender(newValue, autoCorrect);
			$scope.ngModelCtrl.$render();
		}

		function updateWithoutRender(newValue, autoCorrect) {
			function correctedValue(newValue, min, max) {
				switch(true){
					case (!newValue) : return newValue;
					case (min && min.diff(newValue) > 0) : return min;
					case (max && max.diff(newValue) < 0) : return max;
					default : return newValue;
				}
			}
			var min = getMin();
			var max = getMax();
			if(autoCorrect){
				newValue = correctedValue(newValue, min, max);
			}
			$scope.maxed = newValue && max && max.diff(newValue) <= 0;
			$scope.mined = newValue && min && min.diff(newValue) >= 0;

			$scope.ngModelCtrl.setValue(newValue);
		}

		// translate between string values and viewvalue
		function undefinedHoursOrMinutes() {
			return $scope.hours === undefined || $scope.hours === "" || $scope.mins === undefined || $scope.mins === "";
		}

		function getInputedTime() {
			if (undefinedHoursOrMinutes()) {
				return undefined;
			}

			var intHours = parseInt($scope.hours);
			var intMinutes = parseInt($scope.mins);
			// if (intHours != intHours) { intHours = 0; } // intHour isNaN
			// if (intMinutes != intMinutes) { intMinutes = 0; } // intMins isNaN
			if (intMinutes > 60) { intMinutes = 59; $scope.mins = "59"; }

			return getRefDate().hours(intHours).minutes(intMinutes).seconds(0);
		}

		function cancelTimeouts() {
			function cancel(timeout){
				if (!!timeout) {
					$timeout.cancel(timeout);
					timeout = undefined;
				}
			}
			cancel(hoursFocusTimeout);
			cancel(minsFocusTimeout);
		}

		function correctValue() {
			update(currentValue(), $scope.enforceValid);
		}

		function getStep() { return isNaN(parseInt($scope.step)) ? 5 : parseInt($scope.step); }

		function getRefDate() {
			function toMoment(value) { return (!!value && moment(value).isValid()) ? moment(value) : undefined; }

			return toMoment($scope.referenceDate) || toMoment($scope.min) || toMoment($scope.max) || moment();
		}

		function getExtremum(extremum, offset, checkMidnight) {
			function rawExtremum(){
				switch(true){
					// check if min/max is a valid moment
					case (!!extremum.isValid && !!extremum.isValid()) : return moment(extremum);
					// check if min/max is parsable by moment
					case (moment(extremum,'YYYY-MM-DD HH:mm').isValid()) : return moment(extremum,'YYYY-MM-DD HH:mm');
					// check if min/max is like '23:15'
					case (moment(extremum, 'HH:mm').isValid()) :
						var refDate = getRefDate();
						var extrem = moment(extremum, 'HH:mm').year(refDate.year()).month(refDate.month()).date(refDate.date());
						// a min/max time of '00:00' means midnight tomorrow
						if (checkMidnight && extrem.hours() + extrem.minutes() === 0) { extrem.add(1,'d');}
						return extrem;
				}
			}

			// min/max attr not specified
			if (!extremum) { return undefined; }
			var extrem = rawExtremum();
			extrem.add(moment.duration(offset));
			return extrem;
		}

		function getMin() {	return getExtremum($scope.min, $scope.minOffset, false); }
		function getMax() {	return getExtremum($scope.max, $scope.maxOffset, true);	}

		function currentValue() { return !$scope.format ? $scope.ngModelCtrl.$viewValue : moment($scope.ngModelCtrl.$viewValue, $scope.format); }

		function incrementEvent(eventName, value) {
			cancelTimeouts();
			incr(value);
			$scope.$broadcast(eventName);
		}

		function focusEvent(isMinute) {
			cancelTimeouts();
			$scope.minsFocused = !!isMinute;
			$scope.hoursFocused = !isMinute;
		}

		function changeInput(field, validator) {
			updateWithoutRender(getInputedTime());
		}

		function blurEvent(timeout, isFocused){
			timeout = $timeout(function(){
					timeout = false;
					correctValue();
			}, 200);
		}

		var hoursFocusTimeout, minsFocusTimeout;
		var specialSteps = [5, 10, 15, 20, 30];
		var mpCtrl = this;
		$scope.pattern = /^([0-9]{0,2})?$/;

		// stuff to control the focus of the different elements and the clicky bits on the + - buttons
		// what we want is show the + - buttons if one of the inputs is displayed
		// and we want to be able to click on said buttons without loosing focus (obv)
		$scope.incrHours = function() {	incrementEvent('focusHours', 60); };
		$scope.decrHours = function() {	incrementEvent('focusHours', -60); };
		$scope.incrMins = function() {	incrementEvent('focusMinutes', getStep()); };
		$scope.decrMins = function() {	incrementEvent('focusMinutes', -getStep()); };

		function isUndefinedOrEmpty(val) {
			return val === undefined || val === "";
		}

		// string value changed
		$scope.changeHours = function(){
			if(isUndefinedOrEmpty($scope.hours)){
				return updateWithoutRender(undefined);
			}

			if(isUndefinedOrEmpty($scope.mins)){
				$scope.mins = "00";
			}

			if ($scope.hours.length == 2) {
				if (parseInt($scope.hours) > 23) { $scope.hours = '23'; }
				$scope.$broadcast('focusMinutes');
			} else if ($scope.hours.length == 1 && parseInt($scope.hours) > 2) {
				$scope.hours = 0 + $scope.hours;
				$scope.$broadcast('focusMinutes');
			}
			updateWithoutRender(getInputedTime());
		};

		$scope.changeMins = function() {
			updateWithoutRender(getInputedTime());
			// changeInput($scope.mins, function(){});
		};

		// display stuff
		$scope.formatInputValue = function() { $scope.ngModelCtrl.$render(); };

		$scope.getDayGap = function(){
			var refDate = getRefDate().startOf('day');
			return moment.duration(moment(currentValue()).startOf('d').diff(refDate)).asDays();
		};

		$scope.blurHours = function() { blurEvent(hoursFocusTimeout, $scope.hoursFocused); };
		$scope.blurMins = function() {
			if(!$scope.mins) {
				if($scope.hours === "" || $scope.hours === undefined){
					$scope.mins = undefined;
				} else {
					$scope.mins = "00";
				}
			}
			blurEvent(minsFocusTimeout, $scope.minsFocused);
		};

		$scope.focusHours = function() { focusEvent(false); };
		$scope.focusMins = function() { focusEvent(true); };

		this.checkMin = function(newValue) {
			var min = getMin();
			return !min || min.diff(newValue) <= 0;
		};

		this.checkMax = function(newValue) {
			var max = getMax();
			return !max || max.diff(newValue) >= 0;
		};

		// events - mousewheel and arrowkeys
		this.setupEvents = function(hoursInput, minsInput){
			function setupArrowkeyEvents(hoursInput, minsInput) {
				function subscription(e, step){
					switch(e.which){
						case 38:// up
							e.preventDefault();
							incr(step);
							$scope.$apply();
						break;
						case 40:// down
							e.preventDefault();
							incr(-step);
							$scope.$apply();
						break;
						case 13:// enter
							e.preventDefault();
							$scope.formatInputValue();
							$scope.$apply();
						break;
					}
				}
				var step = getStep();
				hoursInput.bind('keydown', function(e) { subscription(e, 60); });
				minsInput.bind('keydown', function(e) { subscription(e, step); });
			}

			function setupMousewheelEvents(hoursInput, minsInput) {
				function isScrollingUp(e) {
					e = e.originalEvent ? e.originalEvent : e;
					//pick correct delta variable depending on event
					var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
					return (e.detail || delta > 0);
				}

				function subscription(e, incrStep){
					if(!$scope.disabled){
						$scope.$apply( incr((isScrollingUp(e)) ? incrStep : -incrStep ));
						e.preventDefault();
					}
				}
				var step = getStep();

				hoursInput.bind('mousewheel wheel', function(e) { subscription(e, 60); });
				minsInput.bind('mousewheel wheel', function(e) { subscription(e, step); });
			}

			setupArrowkeyEvents( hoursInput, minsInput);
			setupMousewheelEvents( hoursInput, minsInput);
		};

	}]);

	angular.module("lui.templates.momentpicker").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidMoment.html",
			"<div class='lui moment input' ng-class='{disabled:disabled}'>" +
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
			template:
				"<div class='lui input'>" +
					"<input type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-model='intPct' ng-change='updateValue()' ng-blur='formatInputValue()'>" +
					"<span class='unit'>%</span>" +
				"</div>"
		};
	})
	.controller('luidPercentageController', ['$scope', function ($scope) {

		// private - updates of some kinds
		// incr value by `step` minutes
		function incr(step) {
			update(parseFloat($scope.intPct) + step);
		}

		// sets viewValue and renders
		function update(duration) {
			updateWithoutRender(duration);
			$scope.ngModelCtrl.$render();
		}

		function updateWithoutRender(duration) {
			function format(pct) {
				switch($scope.format || "0.XX"){
					case "XX" :		return pct;
					case "0.XX" :	return pct/100;
					case "1.XX" :	return (pct/100) + 1;
					default : 		return 0;
				}
			}

			var newValue = duration === undefined ? undefined : format(duration);
			$scope.ngModelCtrl.$setViewValue(newValue);
		}

		// events - key 'enter'
		this.setupEvents = function (elt) {
			function getStep(){ return isNaN(parseInt($scope.step)) ? 5 : parseInt($scope.step);}
			function setupKeyEvents(elt) {
				var step = getStep();
				elt.bind('keydown', function (e) {
					switch(e.which){
						case 38:// up
							e.preventDefault();
							incr(step);
							$scope.$apply();
						break;
						case 40:// down
							e.preventDefault();
							incr(-step);
							$scope.$apply();
						break;
						case 13:// enter
							e.preventDefault();
							$scope.formatInputValue();
							$scope.$apply();
						break;
					}
				});
			}
			function setupMousewheelEvents(elt) {
				function isScrollingUp(e) {
					e = e.originalEvent ? e.originalEvent : e;
					//pick correct delta variable depending on event
					var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
					return (e.detail || delta > 0);
				}

				var step = getStep();
				elt.bind('mousewheel wheel', function (e) {
					if (this === document.activeElement) {
						$scope.$apply(incr((isScrollingUp(e)) ? step : -step));
						e.preventDefault();
					}
				});
			}

			setupKeyEvents(elt);
			setupMousewheelEvents(elt);
		};

		// public methods for update
		$scope.updateValue = function () {
			updateWithoutRender($scope.intPct);
		};

		$scope.parse = function (intInput) {
			switch($scope.format || "0.XX"){
				case "XX":		return intInput;
				case "0.XX":	return Math.round(10000 * intInput) / 100;
				case "1.XX":	return Math.round((intInput-1) * 10000) / 100;
				default : 		return 0;
			}
		};

		// display stuff
		$scope.formatInputValue = function () {
			$scope.ngModelCtrl.$render();
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
			scope.pattern = /^\-?([0-9]+)((h([0-9]{2})?)?(m(in)?)?)?$/i;
			if (!!attrs.unit) {
				var unit = scope.$eval(attrs.unit);
				if (unit == 'h' || unit == 'hour' || unit == 'hours') {
					scope.useHours = true;
				}
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$render = function () {
				scope.strDuration = '';
				if (!this.$viewValue) {
					return;
				}
				var currentDuration = moment.duration(this.$viewValue);
				if (currentDuration < 0) {
					scope.strDuration += "-";
					currentDuration = moment.duration(-currentDuration);
				}
				var hours = Math.floor(currentDuration.asHours());
				var minutes = currentDuration.minutes();
				if (hours === 0) {
					scope.strDuration += minutes + 'm';
				} else {
					scope.strDuration += (hours < 10 ? '0' : '') + hours + 'h' + (minutes < 10 ? '0' : '') + minutes;
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
				min: '=', //min value
				max: '=', //max value
			},
			restrict: 'EA',
			link: link,
			template:
				"<div class='lui timespan input'>" +
					"<input type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-pattern='pattern' ng-model='strDuration' ng-change='updateValue()' ng-blur='formatInputValue()'>" +
				"</div>"
		};
	}])
	.controller('luidTimespanController', ['$scope', 'moment', function ($scope, moment) {
		var ctrl = this;

		function parse(strInput) {
			// parsing str to moment.duration
			function parseHoursAndMinutes(strInput) {
				var d = moment.duration();
				var splitted = strInput.split(/h/i);
				var isPositive = parseInt(splitted[0]) >= 0;
				d.add(parseInt(splitted[0]), 'hours');
				var strMin = splitted[1];
				if (!!strMin && strMin.length >= 2) {
					if (isPositive){
						d.add(parseInt(strMin.substring(0, 2)), 'minutes');
					} else {
						d.subtract(parseInt(strMin.substring(0, 2)), 'minutes');
					}
				}
				return d;
			}

			function parseMinutes(strInput) {
				var d = moment.duration();
				var splitted = strInput.split(/m/i);
				d.add(parseInt(splitted[0]), 'minutes');
				return d;
			}

			function parseHours(strInput) {
				var d = moment.duration();
				var splitted = strInput.split(/h/i);
				d.add(parseInt(splitted[0]), 'hours');
				return d;
			}

			switch(true){
				case (/h/i.test(strInput)) : 	return parseHoursAndMinutes(strInput);
				case (/m/i.test(strInput)) : 	return parseMinutes(strInput);
				case ($scope.useHours) : 		return parseHours(strInput);
				default : 						return parseMinutes(strInput);
			}
		}

		// updates of some kinds
		// incr value by `step` minutes
		function incr(step) {
			var newDur = moment.duration(currentValue()).add(step, 'minutes');
			if (newDur.asMilliseconds() < 0) {
				newDur = moment.duration();
			}
			update(newDur);
		}

		// sets viewValue and renders
		function update(newDuration) {
			updateWithoutRender(newDuration);
			$scope.ngModelCtrl.$render();
		}

		function updateWithoutRender(newDuration) {
			// Handle min/max values
			function correctValue(newValue){
				function correctedMinValue(newValue) {
					var min = !$scope.min ? undefined : moment.duration($scope.min);
					return (!min || min <= newValue) ? newValue : min;
				}

				function correctedMaxValue(newValue) {
					var max = !$scope.max ? undefined : moment.duration($scope.max);
					return (!max || max >= newValue) ?  newValue : max;
				}

				return correctedMaxValue(correctedMinValue(newValue));
			}

			function format(dur) {
				if (ctrl.mode === 'timespan') {
					var timespan = "";
					if (dur.asMilliseconds() < 0){
						timespan += "-";
						dur = moment.duration(-dur);
					}
					timespan += (dur.days() > 0 ? Math.floor(dur.asDays()) + '.' : '') + (dur.hours() < 10 ? '0' : '') + dur.hours() + ':' + (dur.minutes() < 10 ? '0' : '') + dur.minutes() + ':00';
					return timespan;
				}
				return dur;
			}

			if (newDuration === undefined) {
				return $scope.ngModelCtrl.$setViewValue(undefined);
			}

			// Check min/max values
			newDuration = correctValue(newDuration);
			var formattedValue = format(newDuration);

			$scope.ngModelCtrl.$setViewValue(formattedValue);
		}

		function currentValue() {
			return $scope.ngModelCtrl.$viewValue;
		}

		// events - key 'enter'
		this.setupEvents = function (elt) {
			function getStep(){ return isNaN(parseInt($scope.step)) ? 5 : parseInt($scope.step);}
			function setupKeyEvents(elt) {
				var step = getStep();
				elt.bind('keydown', function (e) {
					switch(e.which){
						case 38:// up
							e.preventDefault();
							incr(step);
							$scope.$apply();
						break;
						case 40:// down
							e.preventDefault();
							incr(-step);
							$scope.$apply();
						break;
						case 13:// enter
							e.preventDefault();
							$scope.formatInputValue();
							$scope.$apply();
						break;
					}
				});
			}

			function setupMousewheelEvents(elt) {
				function isScrollingUp(e) {
					e = e.originalEvent ? e.originalEvent : e;
					//pick correct delta variable depending on event
					var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
					return (e.detail || delta > 0);
				}

				var step = getStep();
				elt.bind('mousewheel wheel', function (e) {
					if (this === document.activeElement) {
						$scope.$apply(incr((isScrollingUp(e)) ? step : -step));
						e.preventDefault();
					}
				});
			}

			setupKeyEvents(elt);
			setupMousewheelEvents(elt);
		};

		// public methods for update
		$scope.updateValue = function () {

			// is only fired when pattern is valid or when it goes from valid to invalid
			// improvement possible - check the pattern and set the validity of the all directive via ngModelCtrl.$setValidity
			// currently when pattern invalid, the viewValue is set to '00:00:00'
			if (!$scope.strDuration) { return updateWithoutRender(undefined); } // empty input => 00:00:00

			// parse the strDuration to build newDuration
			// the duration of the parsed strDuration
			var newDuration = parse($scope.strDuration);

			// update viewvalue
			updateWithoutRender(newDuration);
		};

		// display stuff
		$scope.formatInputValue = function () {
			$scope.ngModelCtrl.$render();
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

			function getRightSpan(decimalPart, separator) {
				if (decimalPart === undefined) { return "<span style=\"opacity:0\"></span>"; }
				if (parseInt(decimalPart) === 0) { return "<span style=\"opacity:0\">" + separator + decimalPart + "</span>"; }
				return "<span>" + separator + decimalPart + "</span>";
			}

			var placeholder = _placeholder === undefined ? '' : _placeholder;
			// alert(_input + " " + (!!_input.isNaN && _input.isNaN()));
			var input = _input === undefined || _input === null || _input === "" || _input != _input ? placeholder : _input; // the last check is to check if _input is NaN
			var separator = $filter("number")(1.1,1)[1];
			var precision = _precision === undefined || _precision === null || _precision != _precision ? 2 : _precision;

			var text = $filter("number")(input, precision);
			var decimalPart = (text || $filter("number")(0, precision)).split(separator)[1];
			var rightSpan = getRightSpan(decimalPart, separator);

			if (input === '' || !text){
				// the _input or the _placeholder was not parsable by the number $filter, just return input but trusted as html
				return $sce.trustAsHtml(input + rightSpan);
			}

			var integerPart = text.split(separator)[0];
			return $sce.trustAsHtml(integerPart + rightSpan);
		};
	}]);
})();
;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment
	**/
	var formatMoment = function (_moment, _format) { //expects a moment
		if (!_moment) {
			return "";
		}
		var m = moment(_moment);
		return m.isValid() ? m.format(_format) : _moment;
	};

	angular.module('lui.filters')
	.filter('luifFriendlyRange', function () {
		var translations = {
			'en': {
				sameDay: 'start(dddd, LL)',
				sameDayThisYear: 'start(dddd, MMMM Do)',
				sameMonth: 'start(MMMM Do) - end(Do\, YYYY)',
				sameMonthThisYear: 'start(MMMM Do) - end(Do)',
				sameYear: 'start(MMMM Do) - end(LL)',
				sameYearThisYear: 'start(MMMM Do) - end(MMMM Do)',
				other: 'start(LL) - end(LL)'
			},
			'fr': {
				sameDay: 'le start(dddd LL)',
				sameDayThisYear: 'le start(dddd Do MMMM)',
				sameMonth: 'du start(Do) au end(LL)',
				sameMonthThisYear: 'du start(Do) au end(Do MMMM)',
				sameYear: 'du start(Do MMMM) au end(LL)',
				sameYearThisYear: 'du start(Do MMMM) au end(Do MMMM)',
				other: 'du start(LL) au end(LL)'
			},
			'de': {
				sameDay: 'der start(dddd LL)',
				sameDayThisYear: 'der start(dddd Do MMMM)',
				sameMonth: 'von start(Do) bis end(LL)',
				sameMonthThisYear: 'von start(Do) bis end(Do MMMM)',
				sameYear: 'von start(Do MMMM) bis end(LL)',
				sameYearThisYear: 'von start(Do MMMM) bis end(Do MMMM)',
				other: 'von start(LL) bis end(LL)'
			}
		};
		return function (_block, _excludeEnd, _ampm, _translations) {
			if(!_block){ return; }
			var start = _block.startsAt || _block.startsOn || _block.startDate || _block.start;
			var end = _block.endsAt || _block.endsOn || _block.endDate || _block.end;
			if (!start && !end) {
				return "";
			}
			start = moment(start);
			end = moment(end);
			if(_excludeEnd){
				end.add(-1,'minutes');
			}
			var trads = translations[moment.locale()] || translations.en;
			var format = start.year() === end.year() ? start.month() === end.month() ? start.date() === end.date() ? 'sameDay' : 'sameMonth' : 'sameYear' : 'other';
			if(moment().year() === start.year() && moment().year() === end.year()){
				format += "ThisYear";
			}

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

			return m.isValid() ? m.calendar(_refDate) : _moment;
		};
	})
	.filter('luifDuration', ['$filter', function ($filter) {
		//expects a duration, returns the duration in the given unit with the given precision
		return function (_duration, _sign, _unit, _precision) {
			function getConfigIndex(expectedUnit){
				switch(expectedUnit){
					case 'd':
					case 'day':
					case 'days': return 0;
					case undefined:
					case '':
					case 'h':
					case 'hour':
					case 'hours': return 1;// default
					case 'm':
					case 'min':
					case 'mins':
					case 'minute':
					case 'minutes': return 2;
					case 's':
					case 'sec':
					case 'second':
					case 'seconds': return 3;
					case 'ms':
					case 'millisec':
					case 'millisecond':
					case 'milliseconds': return 4;
				}
			}

			function getNextNotNull(array, startIndex){
				return startIndex === 4 ? 4 : array[startIndex] !== 0 ? startIndex : getNextNotNull(array, startIndex + 1);
			}

			function getPrevNotNull(array, startIndex){
				return startIndex === 0 ? 0 : array[startIndex] !== 0 ? startIndex : getPrevNotNull(array, startIndex - 1);
			}

			function getDecimalNumber(days){
				switch(true){
					case (Math.floor((days * 10) % 10) === 0 && Math.floor((days * 100) % 10) === 0):	return 0;
					case (Math.floor((days * 100) % 10) === 0):											return 1;
					default: 																			return 2;
				}
			}

			function formatValue (value, u, expectedUnit){
				switch(u){
					case expectedUnit :	return value;
					case 2 :
					case 3 : 			return (value < 10 ? '0' + value : value);
					case 4 : 			return (value < 10 ? '00' + value : value < 100 ? '0' + value : value);
					default : 			return value;
				}
			}

			function getPrefix(sign, duration){
				if (sign) {
					if (duration.asMilliseconds() > 0) { return '+'; }
					else if (duration.asMilliseconds() < 0) { return '-'; }
				}
				return '';
			}

			// some localisation shenanigans
			function getUnitSymbols(unit, precision){
				var result = ['d ', 'h', 'm', 's', 'ms'];
				switch(moment.locale()){
					case "fr": result[0] = 'j '; break;
				}

				// if precision = ms and unit bigger than s we want to display 12.525s and not 12s525ms
				if(unit <= 3 && precision === 4) { result[3] = '.'; result[4] = 's'; }
				if(unit <= 1 && precision === 2) { result[2] = ''; }
				if(unit === 2 && precision === 3) { result[3] = ''; }

				return result;
			}

			var unitConfigs = [
				{
					index: 0,
					unit: 'd',
					dateConversion : 'asDays',
					expectedPrecision : 'h'
				},
				{
					index: 1,
					unit: 'h',
					dateConversion : 'asHours',
					expectedPrecision :'m'
				},
				{
					index: 2,
					unit: 'm',
					dateConversion : 'asMinutes',
					expectedPrecision : 's'
				},
				{
					index: 3,
					unit: 's',
					dateConversion : 'asSeconds',
					expectedPrecision : 's'
				},
				{
					index: 4,
					unit: 'ms',
					dateConversion : 'asMilliseconds',
					expectedPrecision : 'ms'
				},
			];

			var d = moment.duration(_duration);

			if (d.asMilliseconds() === 0) { return ''; }

			var values = [Math.abs(d.days()), Math.abs(d.hours()), Math.abs(d.minutes()), Math.abs(d.seconds()), Math.abs(d.milliseconds())];
			var config = unitConfigs[getConfigIndex(_unit)];
			var minimumUnit = Math.max(config.index, getNextNotNull(values, 0));
			values[config.index] = Math.abs(d[config.dateConversion]() >= 0 ? Math.floor(d[config.dateConversion]()) : Math.ceil(d[config.dateConversion]()));

			if (config.index === 0 && getConfigIndex(_precision) === 0 && d.asDays() > 0){
				var myDays = d.asDays();
				var decimalNumber = getDecimalNumber(myDays);
				minimumUnit = 0;
				values[0] = $filter("number")(myDays, decimalNumber);
			}

			var precision = getPrevNotNull(values, getConfigIndex(_precision || config.expectedPrecision));
			var units = getUnitSymbols(minimumUnit, precision);

			var result = '';
			for(var i = minimumUnit; i <= precision; i++){
				result += formatValue(values[i], i, minimumUnit) + units[i];
			}

			var prefix = !!result ? getPrefix(_sign, d) : '';
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
;var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lui;
(function (Lui) {
    "use strict";
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Service;
    (function (Service) {
        "use strict";
        var LuipConfig = (function () {
            function LuipConfig($uibModalProvider) {
                var _this = this;
                this.$get = ["$log", function ($log) {
                        return new Config(_this.config, $log);
                    }];
                this.config = {};
                this.$uibModalProvider = $uibModalProvider;
            }
            LuipConfig.prototype.setConfig = function (config) {
                this.config = config;
                var conf = new Config(this.config);
                this.configureNguibs(conf);
            };
            LuipConfig.prototype.configureNguibs = function (config) {
                this.$uibModalProvider.options = {
                    windowClass: config.prefix,
                    backdropClass: config.prefix,
                    animation: true,
                    backdrop: true,
                    appendTo: config.parentElt,
                    size: "large",
                };
            };
            LuipConfig.$inject = ["$uibModalProvider"];
            return LuipConfig;
        }());
        var Config = (function () {
            function Config(conf, $log, cgNotify) {
                _.extend(this, conf);
                if (!this.parentElt && !!this.parentTagIdClass) {
                    var parentTagIdClass = this.parentTagIdClass || "body";
                    var byTag = document.getElementsByTagName(parentTagIdClass);
                    var byId = document.getElementById(parentTagIdClass);
                    var byClass = document.getElementsByClassName(parentTagIdClass);
                    if (!!byTag && byTag.length) {
                        this.parentElt = angular.element(byTag[0]);
                    }
                    else if (!!byId) {
                        this.parentElt = angular.element(byId);
                    }
                    else if (!!byClass && byClass.length) {
                        this.parentElt = angular.element(byClass[0]);
                    }
                    else if (!!$log) {
                        $log.warn("luisConfig - could not find a suitable element for tag/id/class: " + parentTagIdClass);
                    }
                }
                this.prefix = this.prefix || "lui";
                this.startTop = this.startTop || 40;
                this.okLabel = this.okLabel || "Ok";
                this.cancelLabel = this.cancelLabel || "Cancel";
                this.canDismissConfirm = this.canDismissConfirm;
            }
            return Config;
        }());
        angular.module("lui.services").provider("luisConfig", LuipConfig);
    })(Service = Lui.Service || (Lui.Service = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
        var CalendarMonth = (function () {
            function CalendarMonth(date) {
                this.date = moment(date).startOf("month");
                this.weeks = [];
                this.currentYear = this.date.year() === moment().year();
            }
            return CalendarMonth;
        }());
        Directives.CalendarMonth = CalendarMonth;
        var CalendarWeek = (function () {
            function CalendarWeek() {
            }
            return CalendarWeek;
        }());
        Directives.CalendarWeek = CalendarWeek;
        var CalendarDay = (function () {
            function CalendarDay(date) {
                this.date = date;
                this.dayNum = date.date();
            }
            return CalendarDay;
        }());
        Directives.CalendarDay = CalendarDay;
        var Shortcut = (function () {
            function Shortcut() {
            }
            return Shortcut;
        }());
        Directives.Shortcut = Shortcut;
        var CalendarController = (function () {
            function CalendarController($scope, $log) {
                this.$scope = $scope;
                this.$log = $log;
                this.initCalendarScopeMethods($scope);
            }
            CalendarController.prototype.setMonthsCnt = function (cntStr, inAPopover) {
                this.monthsCnt = parseInt(cntStr, 10) || 1;
                if (inAPopover && this.monthsCnt > 2) {
                    this.monthsCnt = 2;
                    this.$log.warn("no more than 2 months displayed in a date-picker popover");
                }
            };
            CalendarController.prototype.constructMonths = function () {
                var _this = this;
                return _.map(_.range(this.monthsCnt), function (offset) {
                    return _this.constructMonth(moment(_this.currentMonth).add(offset, "months").startOf("month"));
                });
            };
            CalendarController.prototype.constructDayLabels = function () {
                return _.map(_.range(7), function (i) {
                    return moment().startOf("week").add(i, "days").format("dd");
                });
            };
            CalendarController.prototype.assignClasses = function () {
                var _this = this;
                var days = this.extractDays();
                _.each(days, function (day) {
                    day.selected = false;
                    day.start = false;
                    day.end = false;
                    day.inBetween = false;
                    if (!!_this.selected && day.date.format("YYYYMMDD") === moment(_this.selected).format("YYYYMMDD")) {
                        day.selected = true;
                    }
                    if (!!_this.start && day.date.format("YYYYMMDD") === moment(_this.start).format("YYYYMMDD")) {
                        day.start = true;
                    }
                    if (!!_this.end && day.date.format("YYYYMMDD") === moment(_this.end).format("YYYYMMDD")) {
                        day.end = true;
                    }
                    if (!!_this.start && !!_this.end && day.date.isSameOrAfter(_this.start) && day.date.isSameOrBefore(_this.end)) {
                        day.inBetween = true;
                    }
                    if (!!_this.min && _this.min.diff(day.date) > 0) {
                        day.disabled = true;
                    }
                    if (!!_this.max && _this.max.diff(day.date) < 0) {
                        day.disabled = true;
                    }
                    if (!!_this.$scope.customClass) {
                        day.customClass = _this.$scope.customClass(day.date);
                    }
                });
            };
            CalendarController.prototype.initCalendarScopeMethods = function ($scope) {
                var _this = this;
                $scope.dayLabels = this.constructDayLabels();
                $scope.nextMonth = function () {
                    _this.currentMonth.add(1, "month");
                    $scope.months = _this.constructMonths();
                    $scope.direction = "next";
                    _this.assignClasses();
                };
                $scope.previousMonth = function () {
                    _this.currentMonth.add(-1, "month");
                    $scope.months = _this.constructMonths();
                    $scope.direction = "previous";
                    _this.assignClasses();
                };
            };
            CalendarController.prototype.constructMonth = function (monthStart) {
                var month = new CalendarMonth(monthStart);
                var weekStart = moment(month.date).startOf("week");
                while (weekStart.month() === month.date.month() || moment(weekStart).endOf("week").month() === month.date.month()) {
                    month.weeks.push(this.constructWeek(weekStart, month.date));
                    weekStart.add(1, "week");
                }
                return month;
            };
            CalendarController.prototype.constructWeek = function (weekStart, monthStart) {
                var week = { days: [] };
                week.days = _.map(_.range(7), function (i) {
                    var day = new CalendarDay(moment(weekStart).add(i, "days"));
                    if (day.date.month() !== monthStart.month()) {
                        day.empty = true;
                    }
                    return day;
                });
                return week;
            };
            CalendarController.prototype.extractDays = function () {
                return _.chain(this.$scope.months)
                    .pluck("weeks")
                    .flatten()
                    .pluck("days")
                    .flatten()
                    .reject(function (day) {
                    return day.empty;
                })
                    .value();
            };
            return CalendarController;
        }());
        Directives.CalendarController = CalendarController;
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
        var LuidDatePicker = (function () {
            function LuidDatePicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/date-picker/datepicker-inline.html";
                this.require = ["ngModel", "luidDatePicker"];
                this.scope = {
                    format: "@",
                    displayedMonths: "@",
                    min: "=",
                    max: "=",
                    customClass: "=",
                };
                this.controller = LuidDatePickerController.IID;
            }
            LuidDatePicker.factory = function () {
                var directive = function () {
                    return new LuidDatePicker();
                };
                return directive;
            };
            LuidDatePicker.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var datePickerCtrl = ctrls[1];
                datePickerCtrl.setNgModelCtrl(ngModelCtrl);
                datePickerCtrl.setFormat(scope.format);
                datePickerCtrl.setMonthsCnt(scope.displayedMonths);
            };
            LuidDatePicker.IID = "luidDatePicker";
            return LuidDatePicker;
        }());
        var LuidDatePickerPopup = (function () {
            function LuidDatePickerPopup() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/date-picker/datepicker-popup.html";
                this.require = ["ngModel", "luidDatePickerPopup"];
                this.scope = {
                    format: "@",
                    displayFormat: "@",
                    displayedMonths: "@",
                    min: "=",
                    max: "=",
                    customClass: "=",
                    shortcuts: "=",
                    groupedShortcuts: "=",
                };
                this.controller = LuidDatePickerController.IID;
            }
            LuidDatePickerPopup.factory = function () {
                var directive = function () {
                    return new LuidDatePickerPopup();
                };
                return directive;
            };
            LuidDatePickerPopup.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var datePickerCtrl = ctrls[1];
                datePickerCtrl.setElement(element);
                datePickerCtrl.setNgModelCtrl(ngModelCtrl);
                datePickerCtrl.setFormat(scope.format, scope.displayFormat);
                datePickerCtrl.setMonthsCnt(scope.displayedMonths, true);
                datePickerCtrl.setPopoverTrigger(element, scope);
            };
            LuidDatePickerPopup.IID = "luidDatePickerPopup";
            return LuidDatePickerPopup;
        }());
        var LuidDatePickerController = (function (_super) {
            __extends(LuidDatePickerController, _super);
            function LuidDatePickerController($scope, $log) {
                var _this = this;
                _super.call(this, $scope, $log);
                this.$scope = $scope;
                $scope.selectDay = function (day) {
                    _this.setViewValue(day.date);
                    $scope.displayStr = _this.getDisplayStr(day.date);
                    _this.selected = day.date;
                    _this.assignClasses();
                    _this.closePopover();
                };
                $scope.togglePopover = function ($event) {
                    _this.togglePopover($event);
                };
                $scope.openPopover = function ($event) {
                    _this.openPopover($event);
                };
                $scope.closePopover = function ($event) {
                    _this.closePopover();
                };
                $scope.$watch("min", function () {
                    _this.min = _this.formatter.parseValue($scope.min);
                    _this.validate();
                    _this.selected = _this.getViewValue();
                    _this.assignClasses();
                });
                $scope.$watch("max", function () {
                    _this.max = _this.formatter.parseValue($scope.max);
                    _this.validate();
                    _this.selected = _this.getViewValue();
                    _this.assignClasses();
                });
                $scope.clear = function ($event) {
                    _this.setViewValue(undefined);
                    _this.$scope.displayStr = "";
                    _this.closePopover();
                    _this.selected = undefined;
                    _this.assignClasses();
                    $event.stopPropagation();
                };
                $scope.selectShortcut = function (shortcut) {
                    var date = _this.formatter.parseValue(shortcut.date);
                    _this.setViewValue(date);
                    _this.$scope.displayStr = _this.getDisplayStr(date);
                    _this.closePopover();
                    _this.selected = date;
                    _this.assignClasses();
                };
            }
            LuidDatePickerController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                ngModelCtrl.$render = function () {
                    var date = _this.formatter.parseValue(ngModelCtrl.$viewValue);
                    _this.currentMonth = moment(date).startOf("month");
                    _this.$scope.months = _this.constructMonths();
                    _this.selected = date;
                    _this.min = _this.formatter.parseValue(_this.$scope.min);
                    _this.max = _this.formatter.parseValue(_this.$scope.max);
                    _this.assignClasses();
                    _this.$scope.displayStr = _this.getDisplayStr(date);
                };
                ngModelCtrl.$validators.min = function (modelValue, viewValue) {
                    var min = _this.min;
                    var value = _this.getViewValue();
                    return !value || !min || min.diff(value) <= 0;
                };
                ngModelCtrl.$validators.max = function (modelValue, viewValue) {
                    var max = _this.max;
                    var value = _this.getViewValue();
                    return !value || !max || max.diff(value) >= 0;
                };
            };
            LuidDatePickerController.prototype.setFormat = function (format, displayFormat) {
                this.formatter = new Lui.Utils.MomentFormatter(format);
                if (format !== "moment" && format !== "date") {
                    this.displayFormat = displayFormat || format || "L";
                }
                else {
                    this.displayFormat = displayFormat || "L";
                }
            };
            LuidDatePickerController.prototype.setPopoverTrigger = function (elt, $scope) {
                var _this = this;
                var onClosing = function () {
                    _this.ngModelCtrl.$setTouched();
                    _this.closePopover();
                };
                this.popoverController = new Lui.Utils.ClickoutsideTrigger(elt, $scope, onClosing);
                $scope.popover = { isOpen: false };
                $scope.togglePopover = function ($event) {
                    _this.togglePopover($event);
                };
            };
            LuidDatePickerController.prototype.setElement = function (element) {
                this.element = element;
            };
            LuidDatePickerController.prototype.setViewValue = function (value) {
                this.ngModelCtrl.$setViewValue(this.formatter.formatValue(value));
                this.ngModelCtrl.$setTouched();
            };
            LuidDatePickerController.prototype.getViewValue = function () {
                return this.formatter.parseValue(this.ngModelCtrl.$viewValue);
            };
            LuidDatePickerController.prototype.validate = function () {
                this.ngModelCtrl.$validate();
            };
            LuidDatePickerController.prototype.togglePopover = function ($event) {
                if (this.$scope.popover.isOpen) {
                    this.closePopover();
                }
                else {
                    this.openPopover($event);
                }
            };
            LuidDatePickerController.prototype.closePopover = function () {
                this.$scope.direction = "";
                this.element.removeClass("ng-open");
                if (!!this.popoverController) {
                    this.popoverController.close();
                }
            };
            LuidDatePickerController.prototype.openPopover = function ($event) {
                this.element.addClass("ng-open");
                this.$scope.direction = "";
                if (!!this.popoverController) {
                    this.popoverController.open($event);
                }
            };
            LuidDatePickerController.prototype.getDisplayStr = function (date) {
                return !!date ? date.format(this.displayFormat) : undefined;
            };
            LuidDatePickerController.IID = "luidDatePickerController";
            LuidDatePickerController.$inject = ["$scope", "$log"];
            return LuidDatePickerController;
        }(Directives.CalendarController));
        angular.module("lui.directives").controller(LuidDatePickerController.IID, LuidDatePickerController);
        angular.module("lui.directives").directive(LuidDatePicker.IID, LuidDatePicker.factory());
        angular.module("lui.directives").directive(LuidDatePickerPopup.IID, LuidDatePickerPopup.factory());
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
        var LuidDaterangePicker = (function () {
            function LuidDaterangePicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/date-picker/daterangepicker.html";
                this.require = ["ngModel", "luidDaterangePicker"];
                this.scope = {
                    format: "@",
                    displayFormat: "@",
                    min: "=",
                    max: "=",
                    customClass: "=",
                    excludeEnd: "@",
                    startProperty: "@",
                    endProperty: "@",
                    shortcuts: "=",
                    groupedShortcuts: "=",
                };
                this.controller = LuidDaterangePickerController.IID;
            }
            LuidDaterangePicker.factory = function () {
                var directive = function () {
                    return new LuidDaterangePicker();
                };
                return directive;
            };
            LuidDaterangePicker.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var drCtrl = ctrls[1];
                drCtrl.setNgModelCtrl(ngModelCtrl);
                drCtrl.setFormat(scope.format, scope.displayFormat);
                drCtrl.setMonthsCnt("2");
                drCtrl.setPopoverTrigger(element, scope);
                drCtrl.setExcludeEnd(scope.excludeEnd);
                drCtrl.setProperties(scope.startProperty, scope.endProperty);
                drCtrl.setElement(element);
            };
            LuidDaterangePicker.IID = "luidDaterangePicker";
            return LuidDaterangePicker;
        }());
        var LuidDaterangePickerController = (function (_super) {
            __extends(LuidDaterangePickerController, _super);
            function LuidDaterangePickerController($scope, $filter, $log) {
                var _this = this;
                _super.call(this, $scope, $log);
                this.$scope = $scope;
                this.$filter = $filter;
                switch (moment.locale()) {
                    case "fr":
                        $scope.fromLabel = "Du";
                        $scope.toLabel = "Au";
                        break;
                    default:
                        $scope.fromLabel = "From";
                        $scope.toLabel = "To";
                        break;
                }
                $scope.selectDay = function (day) {
                    if ($scope.editingStart || (!!$scope.period.start && day.date.isBefore($scope.period.start))) {
                        $scope.period.start = day.date;
                        _this.start = day.date;
                        $scope.editEnd();
                        if (!!$scope.period.end && $scope.period.start.isAfter($scope.period.end)) {
                            $scope.period.end = undefined;
                            _this.end = undefined;
                        }
                        _this.assignClasses();
                    }
                    else if (!$scope.editingStart && !!$scope.period.start) {
                        $scope.period.end = day.date;
                        _this.closePopover();
                    }
                    else {
                        $scope.period.end = day.date;
                        $scope.editStart();
                    }
                };
                $scope.selectShortcut = function (shortcut) {
                    $scope.period = _this.toPeriod(shortcut);
                    $scope.displayStr = _this.$filter("luifFriendlyRange")(_this.$scope.period);
                    _this.setViewValue($scope.period);
                    _this.closePopover();
                };
                $scope.editStart = function ($event) {
                    if (!!$event) {
                        $event.stopPropagation();
                    }
                    $scope.editingStart = true;
                    if (!!_this.$scope.period.start && moment(_this.currentMonth).diff(_this.$scope.period.start) > 0) {
                        _this.currentMonth = moment(_this.$scope.period.start).startOf("month");
                        _this.$scope.months = _this.constructMonths();
                        _this.assignClasses();
                    }
                };
                $scope.editEnd = function ($event) {
                    if (!!$event) {
                        $event.stopPropagation();
                    }
                    $scope.editingStart = false;
                    if (!!_this.$scope.period.end && moment(_this.currentMonth).add(_this.monthsCnt, "months").diff(_this.$scope.period.end) <= 0) {
                        _this.currentMonth = moment(_this.$scope.period.end).add(-_this.monthsCnt + 1, "months").startOf("month");
                        _this.$scope.months = _this.constructMonths();
                        _this.assignClasses();
                    }
                };
                $scope.onMouseEnter = function (day, $event) {
                    if (!$scope.editingStart && !_this.$scope.period.end) {
                        _this.end = day.date;
                        _this.assignClasses();
                    }
                };
                $scope.onMouseLeave = function (day, $event) {
                    if (!$scope.editingStart && !_this.$scope.period.end) {
                        _this.end = undefined;
                        _this.assignClasses();
                    }
                };
                $scope.popover = { isOpen: false };
                $scope.clear = function ($event) {
                    $scope.period.start = undefined;
                    $scope.period.end = undefined;
                    _this.setViewValue(undefined);
                    _this.closePopover();
                    $event.stopPropagation();
                };
            }
            LuidDaterangePickerController.prototype.setElement = function (element) {
                this.element = element;
            };
            LuidDaterangePickerController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                ngModelCtrl.$render = function () {
                    if (ngModelCtrl.$viewValue) {
                        _this.$scope.period = _this.getViewValue();
                        _this.$scope.displayStr = _this.$filter("luifFriendlyRange")(_this.$scope.period);
                    }
                    else {
                        _this.$scope.period = undefined;
                        _this.$scope.displayStr = undefined;
                    }
                };
                ngModelCtrl.$validators.min = function (modelValue, viewValue) {
                    var start = _this.getViewValue().start;
                    var min = _this.formatter.parseValue(_this.$scope.min);
                    return !start || !min || min.diff(start) <= 0;
                };
                ngModelCtrl.$validators.max = function (modelValue, viewValue) {
                    var end = _this.getViewValue().end;
                    var max = _this.formatter.parseValue(_this.$scope.max);
                    return !end || !max || max.diff(end) >= 0;
                };
            };
            LuidDaterangePickerController.prototype.setProperties = function (startProperty, endProperty) {
                this.startProperty = startProperty || "start";
                this.endProperty = endProperty || "end";
            };
            LuidDaterangePickerController.prototype.setExcludeEnd = function (excludeEnd) {
                this.excludeEnd = excludeEnd === "true";
            };
            LuidDaterangePickerController.prototype.setFormat = function (format, displayFormat) {
                this.formatter = new Lui.Utils.MomentFormatter(format);
                if (format !== "moment" && format !== "date") {
                    this.$scope.momentFormat = displayFormat || format || "L";
                }
                else {
                    this.$scope.momentFormat = displayFormat || "L";
                }
            };
            LuidDaterangePickerController.prototype.setPopoverTrigger = function (elt, scope) {
                var _this = this;
                var onClosing = function () {
                    _this.closePopover();
                };
                this.popoverController = new Lui.Utils.ClickoutsideTrigger(elt, scope, onClosing);
                scope.togglePopover = function ($event) {
                    _this.togglePopover($event);
                };
            };
            LuidDaterangePickerController.prototype.setViewValue = function (value) {
                var period = this.ngModelCtrl.$viewValue || {};
                if (!value || !value.start || !value.end) {
                    period = undefined;
                }
                else {
                    period[this.startProperty] = this.formatter.formatValue(moment(value.start));
                    period[this.endProperty] = this.formatter.formatValue(this.excludeEnd ? moment(value.end).add(1, "day") : moment(value.end));
                }
                this.ngModelCtrl.$setViewValue(period);
            };
            LuidDaterangePickerController.prototype.getViewValue = function () {
                if (!!this.ngModelCtrl.$viewValue) {
                    return this.toPeriod(this.ngModelCtrl.$viewValue);
                }
                return { start: undefined, end: undefined };
            };
            LuidDaterangePickerController.prototype.toPeriod = function (v) {
                var iperiod = {};
                iperiod.start = v[this.startProperty];
                iperiod.end = v[this.endProperty];
                var period = new Lui.Period(iperiod, this.formatter);
                if (this.excludeEnd && !!period.end) {
                    period.end.add(-1, "day");
                }
                return period;
            };
            LuidDaterangePickerController.prototype.togglePopover = function ($event) {
                if (this.$scope.popover.isOpen) {
                    this.closePopover();
                }
                else {
                    this.openPopover($event);
                }
            };
            LuidDaterangePickerController.prototype.closePopover = function () {
                this.$scope.direction = "";
                if (!!this.$scope.period.start && !!this.$scope.period.end) {
                    this.setViewValue(this.$scope.period);
                    this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period);
                }
                else {
                    this.$scope.period = this.getViewValue();
                    this.$scope.displayStr = "";
                }
                this.element.removeClass("ng-open");
                this.popoverController.close();
            };
            LuidDaterangePickerController.prototype.openPopover = function ($event) {
                var vv = this.getViewValue();
                this.$scope.period = vv || { start: undefined, end: undefined };
                this.currentMonth = (!!vv ? moment(vv.start) : moment()).startOf("month");
                this.$scope.months = this.constructMonths();
                if (!!vv) {
                    this.start = vv.start;
                    this.end = vv.end;
                }
                this.min = this.formatter.parseValue(this.$scope.min);
                this.max = this.formatter.parseValue(this.$scope.max);
                this.assignClasses();
                this.$scope.editingStart = true;
                this.element.addClass("ng-open");
                this.popoverController.open($event);
            };
            LuidDaterangePickerController.IID = "luidDaterangePickerController";
            LuidDaterangePickerController.$inject = ["$scope", "$filter", "$log"];
            return LuidDaterangePickerController;
        }(Directives.CalendarController));
        angular.module("lui.directives").controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);
        angular.module("lui.directives").directive(LuidDaterangePicker.IID, LuidDaterangePicker.factory());
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
angular.module("lui.directives").directive("deferredCloak", ["$timeout", function ($timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                $timeout(function () {
                    attrs.$set("deferredCloak", undefined);
                    element.removeClass("deferred-cloak");
                }, 0);
            },
        };
    },]);
var Lui;
(function (Lui) {
    "use strict";
    var Period = (function () {
        function Period(unformatted, formatter) {
            var start = unformatted.start || unformatted.startsOn || unformatted.startsAt;
            var end = unformatted.end || unformatted.endsOn || unformatted.endsAt;
            this.start = formatter.parseValue(start);
            this.end = formatter.parseValue(end);
        }
        return Period;
    }());
    Lui.Period = Period;
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Filters;
    (function (Filters) {
        "use strict";
        var diacriticsMap = [
            { "base": "A", "letters": /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
            { "base": "AA", "letters": /[\uA732]/g },
            { "base": "AE", "letters": /[\u00C6\u01FC\u01E2]/g },
            { "base": "AO", "letters": /[\uA734]/g },
            { "base": "AU", "letters": /[\uA736]/g },
            { "base": "AV", "letters": /[\uA738\uA73A]/g },
            { "base": "AY", "letters": /[\uA73C]/g },
            { "base": "B", "letters": /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
            { "base": "C", "letters": /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
            { "base": "D", "letters": /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
            { "base": "DZ", "letters": /[\u01F1\u01C4]/g },
            { "base": "Dz", "letters": /[\u01F2\u01C5]/g },
            { "base": "E", "letters": /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
            { "base": "F", "letters": /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
            { "base": "G", "letters": /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
            { "base": "H", "letters": /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
            { "base": "I", "letters": /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
            { "base": "J", "letters": /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
            { "base": "K", "letters": /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
            { "base": "L", "letters": /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
            { "base": "LJ", "letters": /[\u01C7]/g },
            { "base": "Lj", "letters": /[\u01C8]/g },
            { "base": "M", "letters": /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
            { "base": "N", "letters": /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
            { "base": "NJ", "letters": /[\u01CA]/g },
            { "base": "Nj", "letters": /[\u01CB]/g },
            { "base": "O", "letters": /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
            { "base": "OI", "letters": /[\u01A2]/g },
            { "base": "OO", "letters": /[\uA74E]/g },
            { "base": "OU", "letters": /[\u0222]/g },
            { "base": "P", "letters": /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
            { "base": "Q", "letters": /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
            { "base": "R", "letters": /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
            { "base": "S", "letters": /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
            { "base": "T", "letters": /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
            { "base": "TZ", "letters": /[\uA728]/g },
            { "base": "U", "letters": /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
            { "base": "V", "letters": /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
            { "base": "VY", "letters": /[\uA760]/g },
            { "base": "W", "letters": /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
            { "base": "X", "letters": /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
            { "base": "Y", "letters": /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
            { "base": "Z", "letters": /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
            { "base": "a", "letters": /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
            { "base": "aa", "letters": /[\uA733]/g },
            { "base": "ae", "letters": /[\u00E6\u01FD\u01E3]/g },
            { "base": "ao", "letters": /[\uA735]/g },
            { "base": "au", "letters": /[\uA737]/g },
            { "base": "av", "letters": /[\uA739\uA73B]/g },
            { "base": "ay", "letters": /[\uA73D]/g },
            { "base": "b", "letters": /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
            { "base": "c", "letters": /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
            { "base": "d", "letters": /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
            { "base": "dz", "letters": /[\u01F3\u01C6]/g },
            { "base": "e", "letters": /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
            { "base": "f", "letters": /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
            { "base": "g", "letters": /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
            { "base": "h", "letters": /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
            { "base": "hv", "letters": /[\u0195]/g },
            { "base": "i", "letters": /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
            { "base": "j", "letters": /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
            { "base": "k", "letters": /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
            { "base": "l", "letters": /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
            { "base": "lj", "letters": /[\u01C9]/g },
            { "base": "m", "letters": /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
            { "base": "n", "letters": /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
            { "base": "nj", "letters": /[\u01CC]/g },
            { "base": "o", "letters": /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
            { "base": "oi", "letters": /[\u01A3]/g },
            { "base": "ou", "letters": /[\u0223]/g },
            { "base": "oo", "letters": /[\uA74F]/g },
            { "base": "p", "letters": /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
            { "base": "q", "letters": /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
            { "base": "r", "letters": /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
            { "base": "s", "letters": /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
            { "base": "t", "letters": /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
            { "base": "tz", "letters": /[\uA729]/g },
            { "base": "u", "letters": /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
            { "base": "v", "letters": /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
            { "base": "vy", "letters": /[\uA761]/g },
            { "base": "w", "letters": /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
            { "base": "x", "letters": /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
            { "base": "y", "letters": /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
            { "base": "z", "letters": /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
        ];
        function luifStripAccents() {
            return function (input) {
                if (input === null || input === undefined) {
                    return "";
                }
                _.each(diacriticsMap, function (row) {
                    input = input.replace(row.letters, row.base);
                });
                return input;
            };
        }
        angular.module("lui.filters").filter("luifStripAccents", luifStripAccents);
    })(Filters = Lui.Filters || (Lui.Filters = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    "use strict";
    angular.module("lui.formlytemplates")
        .config(["formlyConfigProvider", function (formlyConfigProvider) {
            formlyConfigProvider.setType({
                name: "text",
                templateUrl: "lui/templates/formly/fields/text.html",
            });
            formlyConfigProvider.setType({
                name: "email",
                templateUrl: "lui/templates/formly/fields/email.html",
            });
            formlyConfigProvider.setType({
                name: "date",
                templateUrl: "lui/templates/formly/fields/date.html",
            });
            formlyConfigProvider.setType({
                name: "select",
                templateUrl: "lui/templates/formly/fields/select.html",
            });
            formlyConfigProvider.setType({
                name: "checkbox",
                templateUrl: "lui/templates/formly/fields/checkbox.html",
            });
            formlyConfigProvider.setType({
                name: "radio",
                templateUrl: "lui/templates/formly/fields/radio.html",
            });
            formlyConfigProvider.setType({
                name: "portrait",
                templateUrl: "lui/templates/formly/fields/portrait.html",
            });
            formlyConfigProvider.setType({
                name: "user",
                templateUrl: "lui/templates/formly/fields/user.html",
            });
            formlyConfigProvider.setType({
                name: "user_multiple",
                templateUrl: "lui/templates/formly/fields/user-multiple.html",
            });
            formlyConfigProvider.setType({
                name: "api_select",
                templateUrl: "lui/templates/formly/fields/api-select.html",
            });
            formlyConfigProvider.setType({
                name: "api_select_multiple",
                templateUrl: "lui/templates/formly/fields/api-select-multiple.html",
            });
        }]);
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    "use strict";
})(Lui || (Lui = {}));
var dir;
(function (dir) {
    var directives;
    (function (directives) {
        "use strict";
        var MAGIC_PAGING = "0,10";
        var ApiSelect = (function () {
            function ApiSelect() {
                this.restrict = "AE";
                this.templateUrl = "lui/templates/formly/inputs/api-select.html";
                this.scope = {
                    api: "=",
                    filter: "=",
                    placeholder: "@",
                };
                this.controller = ApiSelectController.IID;
            }
            ApiSelect.factory = function () {
                var directive = function () {
                    return new ApiSelect();
                };
                return directive;
            };
            ApiSelect.IID = "luidApiSelect";
            return ApiSelect;
        }());
        var ApiSelectMultiple = (function () {
            function ApiSelectMultiple() {
                this.restrict = "AE";
                this.templateUrl = "lui/templates/formly/inputs/api-select-multiple.html";
                this.scope = {
                    api: "=",
                    filter: "=",
                    placeholder: "@",
                };
                this.controller = ApiSelectController.IID;
            }
            ApiSelectMultiple.factory = function () {
                var directive = function () {
                    return new ApiSelectMultiple();
                };
                return directive;
            };
            ApiSelectMultiple.IID = "luidApiSelectMultiple";
            return ApiSelectMultiple;
        }());
        var StandardApiService = (function () {
            function StandardApiService($http) {
                this.$http = $http;
            }
            StandardApiService.prototype.get = function (clue, api, additionalFilter) {
                var clueFilter = !!clue ? "name=like," + clue : "paging=" + MAGIC_PAGING;
                var filter = clueFilter + (!!additionalFilter ? "&" + additionalFilter : "");
                return this.$http.get(api + "?" + filter + "&fields=id,name")
                    .then(function (response) {
                    return response.data.data.items;
                });
            };
            StandardApiService.IID = "luisStandardApiService";
            StandardApiService.$inject = ["$http"];
            return StandardApiService;
        }());
        var ApiSelectController = (function () {
            function ApiSelectController($scope, service) {
                $scope.refresh = function (clue) {
                    service.get(clue, $scope.api, $scope.filter)
                        .then(function (choices) {
                        $scope.choices = choices;
                    });
                };
            }
            ApiSelectController.IID = "luidApiSelectController";
            ApiSelectController.$inject = [
                "$scope",
                StandardApiService.IID,
            ];
            return ApiSelectController;
        }());
        angular.module("lui.directives").controller(ApiSelectController.IID, ApiSelectController);
        angular.module("lui.directives").directive(ApiSelect.IID, ApiSelect.factory());
        angular.module("lui.directives").directive(ApiSelectMultiple.IID, ApiSelectMultiple.factory());
        angular.module("lui.directives").service(StandardApiService.IID, StandardApiService);
    })(directives = dir.directives || (dir.directives = {}));
})(dir || (dir = {}));
var Lui;
(function (Lui) {
    "use strict";
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
        var LuidImageCropper = (function () {
            function LuidImageCropper() {
                this.controller = LuidImageCropperController.IID;
                this.restrict = "AE";
                this.scope = {
                    onCropped: "=",
                    onCancelled: "=",
                    croppingRatio: "=",
                    croppingDisabled: "=",
                };
                this.link = function (scope, element, attrs) {
                    var handleFileSelect = function (evt) {
                        var file = evt.currentTarget.files[0];
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            scope.$apply(function ($scope) {
                                scope.image = event.target.result;
                                if (!scope.croppingDisabled) {
                                    scope.openCropper();
                                }
                                else {
                                    scope.onCropped(scope.image);
                                }
                            });
                        };
                        reader.readAsDataURL(file);
                    };
                    angular.element(element[0]).on("change", handleFileSelect);
                };
            }
            LuidImageCropper.Factory = function () {
                var directive = function () { return new LuidImageCropper(); };
                directive.$inject = [];
                return directive;
            };
            ;
            ;
            LuidImageCropper.IID = "luidImageCropper";
            return LuidImageCropper;
        }());
        Directives.LuidImageCropper = LuidImageCropper;
        var LuidImageCropperController = (function () {
            function LuidImageCropperController($scope, moment, $uibModal, luisConfig) {
                $scope.image = "";
                $scope.cropped = "";
                $scope.openCropper = function () {
                    var modalOptions = {
                        templateUrl: "lui/templates/image-picker/image-cropper.modal.html",
                        controller: LuidImageCropperModalController.IID,
                        size: "desktop",
                        resolve: {
                            image: function () {
                                return $scope.image;
                            },
                            croppingRatio: function () {
                                return $scope.croppingRatio;
                            },
                            cancelLabel: function () {
                                return luisConfig.cancelLabel;
                            }
                        },
                    };
                    var modalInstance = $uibModal.open(modalOptions);
                    modalInstance.result.then(function (cropped) {
                        $scope.cropped = cropped;
                        $scope.onCropped(cropped);
                    }, function () {
                        if (!!$scope.onCancelled) {
                            $scope.onCancelled();
                        }
                    });
                };
            }
            LuidImageCropperController.IID = "luidImageCropperController";
            LuidImageCropperController.$inject = ["$scope", "moment", "$uibModal", "luisConfig"];
            return LuidImageCropperController;
        }());
        var LuidImageCropperModalController = (function () {
            function LuidImageCropperModalController($scope, $uibModalInstance, moment, image, croppingRatio, cancelLabel) {
                var doClose = false;
                $scope.image = image;
                $scope.cancelLabel = cancelLabel;
                $scope.croppingRatio = croppingRatio;
                $scope.crop = function () {
                    doClose = true;
                    $uibModalInstance.close($scope.cropped);
                };
                $scope.donotcrop = function () {
                    doClose = true;
                    $uibModalInstance.close($scope.image);
                };
                $scope.cancel = function () {
                    doClose = true;
                    $uibModalInstance.dismiss();
                };
                $scope.$on("modal.closing", function ($event) {
                    if (!doClose) {
                        $event.preventDefault();
                    }
                });
            }
            LuidImageCropperModalController.IID = "luidImageCropperModalController";
            LuidImageCropperModalController.$inject = ["$scope", "$uibModalInstance", "moment", "image", "croppingRatio", "cancelLabel"];
            return LuidImageCropperModalController;
        }());
        angular.module("lui.directives").directive(LuidImageCropper.IID, LuidImageCropper.Factory());
        angular.module("lui.directives").controller(LuidImageCropperController.IID, LuidImageCropperController);
        angular.module("lui.directives").controller(LuidImageCropperModalController.IID, LuidImageCropperModalController);
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
        var LuidImagePicker = (function () {
            function LuidImagePicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/image-picker/image-picker.html";
                this.require = ["ngModel", LuidImagePicker.IID];
                this.scope = {
                    placeholderUrl: "@",
                    croppingRatio: "=",
                    croppingDisabled: "=",
                };
                this.controller = LuidImagePickerController.IID;
            }
            LuidImagePicker.factory = function () {
                var directive = function () {
                    return new LuidImagePicker();
                };
                return directive;
            };
            LuidImagePicker.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var imgPickerCtrl = ctrls[1];
                imgPickerCtrl.setNgModelCtrl(ngModelCtrl);
                imgPickerCtrl.setPlaceholder(scope.placeholderUrl);
            };
            LuidImagePicker.IID = "luidImagePicker";
            return LuidImagePicker;
        }());
        var LuidImagePickerController = (function () {
            function LuidImagePickerController($scope, uploaderService) {
                var _this = this;
                this.$scope = $scope;
                $scope.setTouched = function () {
                    _this.ngModelCtrl.$setTouched();
                };
                $scope.onCropped = function (cropped) {
                    $scope.uploading = true;
                    uploaderService.postDataURI(cropped)
                        .then(function (file) {
                        $scope.uploading = false;
                        _this.setViewValue(file);
                        _this.$scope.pictureStyle = { "background-image": "url('" + file.href + "')" };
                    }, function (message) {
                        _this.ngModelCtrl.$setTouched();
                        $scope.uploading = false;
                    });
                };
                $scope.onCancelled = function () {
                    $scope.file = undefined;
                    _this.ngModelCtrl.$setTouched();
                };
            }
            LuidImagePickerController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                ngModelCtrl.$render = function () {
                    var vv = _this.getViewValue();
                    if (!!vv && !!vv.href) {
                        _this.$scope.pictureStyle = { "background-image": "url('" + vv.href + "')" };
                    }
                    else {
                        _this.$scope.pictureStyle = { "background-image": "url('" + _this.placeholder + "')" };
                    }
                };
            };
            LuidImagePickerController.prototype.setPlaceholder = function (placeholder) {
                this.placeholder = placeholder || "/static/common/images/placeholder-pp.png";
            };
            LuidImagePickerController.prototype.getViewValue = function () {
                return this.ngModelCtrl.$viewValue;
            };
            LuidImagePickerController.prototype.setViewValue = function (file) {
                this.ngModelCtrl.$setTouched();
                this.ngModelCtrl.$setViewValue(file);
            };
            LuidImagePickerController.IID = "luidImagePickerController";
            LuidImagePickerController.$inject = ["$scope", "uploaderService"];
            return LuidImagePickerController;
        }());
        angular.module("lui.directives").directive(LuidImagePicker.IID, LuidImagePicker.factory());
        angular.module("lui.directives").controller(LuidImagePickerController.IID, LuidImagePickerController);
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directive;
    (function (Directive) {
        "use strict";
        angular.module("lui.translates.imagepicker").config(["$translateProvider", function ($translateProvider) {
                $translateProvider.translations("en", {
                    "LUIIMGPICKER_UPLOAD_IMAGE": "change picture",
                    "LUIIMGCROPPER_CROP": "Crop",
                    "LUIIMGCROPPER_DO_NOT_CROP": "Do not crop",
                });
                $translateProvider.translations("de", {});
                $translateProvider.translations("es", {});
                $translateProvider.translations("fr", {
                    "LUIIMGPICKER_UPLOAD_IMAGE": "changer l'image",
                    "LUIIMGCROPPER_CROP": "Recadrer",
                    "LUIIMGCROPPER_DO_NOT_CROP": "Ne pas recadrer",
                });
                $translateProvider.translations("it", {});
                $translateProvider.translations("nl", {});
            }]);
    })(Directive = Lui.Directive || (Lui.Directive = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Service;
    (function (Service) {
        "use strict";
        var UploaderService = (function () {
            function UploaderService($http, $q, _, moment) {
                this.mainApiUrl = "/api/files";
                this.$http = $http;
                this.$q = $q;
                this._ = _;
                this.moment = moment;
            }
            UploaderService.prototype.postFromUrl = function (url) {
                var _this = this;
                var dfd = this.$q.defer();
                var req = new XMLHttpRequest();
                req.open("GET", url, true);
                req.responseType = "arraybuffer";
                req.onload = function (event) {
                    var blob = new Blob([req.response], { type: "image/jpeg" });
                    _this.postBlob(blob)
                        .then(function (response) {
                        dfd.resolve(response);
                    }, function (response) {
                        dfd.reject(response.data.Message);
                    });
                };
                req.send();
                return dfd.promise;
            };
            UploaderService.prototype.postDataURI = function (dataURI) {
                var blob = this.dataURItoBlob(dataURI);
                return this.postBlob(blob);
            };
            UploaderService.prototype.postBlob = function (blob) {
                var dfd = this.$q.defer();
                var url = this.mainApiUrl;
                var fd = new FormData();
                fd.append("file", blob, "file.png");
                this.$http({
                    method: "POST",
                    url: url,
                    data: fd,
                    headers: {
                        "Content-Type": undefined,
                        "Accept": undefined,
                    },
                    transformRequest: angular.identity,
                })
                    .then(function (response) {
                    dfd.resolve(response.data.data);
                }, function (response) {
                    dfd.reject(response.data.Message);
                });
                return dfd.promise;
            };
            UploaderService.prototype.dataURItoBlob = function (dataURI) {
                var byteString = atob(dataURI.split(",")[1]);
                var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab], { type: mimeString });
                return bb;
            };
            UploaderService.IID = "uploaderService";
            UploaderService.$inject = ["$http", "$q", "_", "moment"];
            return UploaderService;
        }());
        var ApiResponseItem = (function () {
            function ApiResponseItem() {
            }
            return ApiResponseItem;
        }());
        var ApiError = (function () {
            function ApiError() {
            }
            return ApiError;
        }());
        angular.module("lui.services").service(UploaderService.IID, UploaderService);
    })(Service = Lui.Service || (Lui.Service = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Service;
    (function (Service) {
        "use strict";
        var LuiHttpInterceptor = (function () {
            function LuiHttpInterceptor($q, $cacheFactory, $timeout, progressBarService) {
                var _this = this;
                this.totalRequests = 0;
                this.completedRequests = 0;
                this.request = function (config) {
                    if (!_this.isCached(config)) {
                        _this.startRequest(config.method);
                    }
                    return config;
                };
                this.requestError = function (rejection) {
                    _this.startRequest("GET");
                    return _this.$q.reject(rejection);
                };
                this.response = function (response) {
                    if (!!response && !_this.isCached(response.config)) {
                        _this.endRequest(_this.extractMethod(response));
                    }
                    return response;
                };
                this.responseError = function (rejection) {
                    _this.endRequest("GET");
                    return (_this.$q.reject(rejection));
                };
                this.isCached = function (config) {
                    var cache;
                    var defaultCache = _this.$cacheFactory.get("$http");
                    if ((config.cache)
                        && config.cache !== false
                        && (config.method === "GET" || config.method === "JSONP")) {
                        if (angular.isObject(config.cache)) {
                            cache = config.cache;
                        }
                        else {
                            cache = defaultCache;
                        }
                    }
                    var cached = cache !== undefined ? cache.get(config.url) !== undefined : false;
                    if (config.cached !== undefined && cached !== config.cached) {
                        return config.cached;
                    }
                    config.cached = cached;
                    return cached;
                };
                this.extractMethod = function (response) {
                    try {
                        return (response.config.method);
                    }
                    catch (error) {
                        return ("GET");
                    }
                };
                this.startRequest = function (httpMethod) {
                    if (_this.progressBarService.isHttpResquestListening()) {
                        if (_this.progressBarService.getHttpRequestMethods().indexOf(httpMethod) > -1) {
                            if (_this.totalRequests === 0) {
                                _this.progressBarService.start();
                            }
                            _this.totalRequests++;
                        }
                    }
                    else {
                        _this.totalRequests = 0;
                        _this.completedRequests = 0;
                    }
                };
                this.setComplete = function () {
                    if (!!_this.completeTimeout) {
                        _this.$timeout.cancel(_this.completeTimeout);
                    }
                    _this.completeTimeout = _this.$timeout(function () {
                        _this.progressBarService.complete();
                        _this.totalRequests = 0;
                        _this.completedRequests = 0;
                    }, 200);
                };
                this.endRequest = function (httpMethod) {
                    if (_this.progressBarService.isHttpResquestListening()) {
                        if (_this.progressBarService.getHttpRequestMethods().indexOf(httpMethod) > -1) {
                            _this.completedRequests++;
                            if (_this.completedRequests >= _this.totalRequests) {
                                _this.setComplete();
                            }
                        }
                    }
                };
                this.$q = $q;
                this.$cacheFactory = $cacheFactory;
                this.$timeout = $timeout;
                this.progressBarService = progressBarService;
            }
            LuiHttpInterceptor.IID = "luiHttpInterceptor";
            LuiHttpInterceptor.$inject = ["$q", "$cacheFactory", "$timeout", "luisProgressBar"];
            return LuiHttpInterceptor;
        }());
        Service.LuiHttpInterceptor = LuiHttpInterceptor;
        angular.module("lui.services").service(LuiHttpInterceptor.IID, LuiHttpInterceptor);
    })(Service = Lui.Service || (Lui.Service = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Service;
    (function (Service) {
        "use strict";
        var ProgressBarService = (function () {
            function ProgressBarService($document, $window, $timeout, $interval, $log, luisConfig) {
                var _this = this;
                this.latencyThreshold = 200;
                this.httpResquestListening = false;
                this.status = 0;
                this.progressBarTemplate = '<div class="lui slim progressing progress progress-bar"><div class="indicator" data-percentage="0" style="width: 0%;"></div></div>';
                this.addProgressBar = function (palette) {
                    if (palette === void 0) { palette = "primary"; }
                    if (!!_this.progressbarEl) {
                        _this.progressbarEl.remove();
                    }
                    _this.progressbarEl = angular.element(_this.progressBarTemplate);
                    _this.progressbarEl.addClass(palette);
                    _this.luisConfig.parentElt.append(_this.progressbarEl);
                };
                this.startListening = function (httpRequestMethods) {
                    _this.httpResquestListening = true;
                    if (!!httpRequestMethods) {
                        _this.httpRequestMethods = httpRequestMethods;
                    }
                    else {
                        _this.httpRequestMethods = ["GET"];
                    }
                    _this.setStatus(0);
                };
                this.stopListening = function () {
                    _this.httpResquestListening = false;
                    _this.setStatus(0);
                };
                this.isHttpResquestListening = function () {
                    return _this.httpResquestListening;
                };
                this.getHttpRequestMethods = function () {
                    return _this.httpRequestMethods;
                };
                this.start = function () {
                    if (!_this.isStarted) {
                        _this.isStarted = true;
                        _this.$timeout.cancel(_this.completeTimeout);
                        _this.$interval.cancel(_this.currentPromiseInterval);
                        _this.show();
                        _this.currentPromiseInterval = _this.$interval(function () {
                            if (isNaN(_this.status)) {
                                _this.$interval.cancel(_this.currentPromiseInterval);
                                _this.setStatus(0);
                                _this.hide();
                            }
                            else {
                                var remaining = 100 - _this.status;
                                if (remaining > 30) {
                                    _this.setStatus(_this.status + (0.5 * Math.sqrt(remaining)));
                                }
                                else {
                                    _this.setStatus(_this.status + (0.15 * Math.pow(1 - Math.sqrt(remaining), 2)));
                                }
                            }
                        }, _this.latencyThreshold);
                    }
                };
                this.hide = function () {
                    _this.$timeout(function () {
                        if (!!_this.progressbarEl) {
                            _this.progressbarEl.removeClass("in");
                            _this.progressbarEl.addClass("out");
                            _this.setStatus(0);
                        }
                    }, 300);
                };
                this.show = function () {
                    if (!!_this.progressbarEl) {
                        _this.progressbarEl.removeClass("out");
                        _this.progressbarEl.addClass("in");
                        _this.setStatus(0);
                    }
                };
                this.setStatus = function (status) {
                    _this.status = status;
                    if (!!_this.progressbarEl) {
                        _this.progressbarEl.children().css("width", _this.status + "%");
                        _this.progressbarEl.children().attr("data-percentage", _this.status);
                    }
                };
                this.complete = function () {
                    _this.$interval.cancel(_this.currentPromiseInterval);
                    _this.isStarted = false;
                    _this.httpResquestListening = false;
                    _this.setStatus(100);
                    _this.hide();
                };
                this.getDomElement = function () {
                    return _this.progressbarEl;
                };
                this.$document = $document;
                this.$window = $window;
                this.$timeout = $timeout;
                this.$interval = $interval;
                this.$log = $log;
                this.luisConfig = luisConfig;
            }
            ProgressBarService.IID = "luisProgressBar";
            ProgressBarService.$inject = ["$document", "$window", "$timeout", "$interval", "$log", "luisConfig"];
            return ProgressBarService;
        }());
        Service.ProgressBarService = ProgressBarService;
        angular.module("lui.services").service(ProgressBarService.IID, ProgressBarService);
    })(Service = Lui.Service || (Lui.Service = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Utils;
    (function (Utils) {
        "use strict";
        var MomentFormatter = (function () {
            function MomentFormatter(format) {
                this.format = format || "moment";
            }
            MomentFormatter.prototype.parseValue = function (value) {
                switch (this.format) {
                    case "moment": return this.parseMoment(value);
                    case "date": return this.parseDate(value);
                    default: return this.parseString(value);
                }
            };
            MomentFormatter.prototype.formatValue = function (value) {
                if (!value) {
                    return value;
                }
                switch (this.format) {
                    case "moment": return this.formatMoment(value);
                    case "date": return this.formatDate(value);
                    default: return this.formatString(value);
                }
            };
            MomentFormatter.prototype.parseMoment = function (value) {
                return !!value ? moment(value) : undefined;
            };
            MomentFormatter.prototype.parseDate = function (value) {
                return !!value ? moment(value) : undefined;
            };
            MomentFormatter.prototype.parseString = function (value) {
                return !!value && moment(value, this.format).isValid() ? moment(value, this.format) : undefined;
            };
            MomentFormatter.prototype.formatMoment = function (value) {
                return moment(value);
            };
            MomentFormatter.prototype.formatDate = function (value) {
                return value.toDate();
            };
            MomentFormatter.prototype.formatString = function (value) {
                return value.format(this.format);
            };
            return MomentFormatter;
        }());
        Utils.MomentFormatter = MomentFormatter;
    })(Utils = Lui.Utils || (Lui.Utils = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Utils;
    (function (Utils) {
        "use strict";
        var ClickoutsideTrigger = (function () {
            function ClickoutsideTrigger(elt, $scope, clickedOutside) {
                this.elt = elt;
                this.body = angular.element(document.getElementsByTagName("body")[0]);
                this.$scope = $scope;
                this.clickedOutside = clickedOutside;
            }
            ClickoutsideTrigger.prototype.toggle = function ($event) {
                if (this.$scope.popover.isOpen) {
                    this.close($event);
                }
                else {
                    this.open($event);
                }
            };
            ClickoutsideTrigger.prototype.close = function ($event) {
                this.$scope.popover.isOpen = false;
                if (!!this.body) {
                    this.body.off("click");
                    this.elt.off("click");
                }
            };
            ClickoutsideTrigger.prototype.open = function ($event) {
                var _this = this;
                this.$scope.popover.isOpen = true;
                setTimeout(function () {
                    _this.body.on("click", function () {
                        _this.onClickedOutside();
                        _this.$scope.$digest();
                    });
                    _this.elt.on("click", function (otherEvent) {
                        otherEvent.stopPropagation();
                    });
                }, 1);
            };
            ClickoutsideTrigger.prototype.onClickedOutside = function ($event) {
                if (this.clickedOutside) {
                    this.clickedOutside();
                }
                else {
                    this.close();
                }
            };
            return ClickoutsideTrigger;
        }());
        Utils.ClickoutsideTrigger = ClickoutsideTrigger;
    })(Utils = Lui.Utils || (Lui.Utils = {}));
})(Lui || (Lui = {}));
;angular.module('lui.directives').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('lui/templates/date-picker/datepicker-inline.html',
    "<div class=calendars><button class=previous ng-click=previousMonth()></button> <button class=next ng-click=nextMonth()></button><table ng-repeat=\"month in months\" ng-class=[direction]><caption><span>{{ month.date | luifMoment : month.currentYear ? \"MMMM\" : \"MMMM - YYYY\" }}</span></caption><thead><th ng-repeat=\"dayLabel in dayLabels\">{{ ::dayLabel }}</th></thead><tbody><tr ng-repeat=\"week in month.weeks\"><td ng-repeat=\"day in week.days\" ng-class=\"[{empty: day.empty, selected: day.selected}, day.customClass]\" ng-disabled=day.disabled ng-click=selectDay(day)>{{ ::day.dayNum }}</td></tr></tbody></table></div><footer ng-if=\"!!shortcuts || !!groupedShortcuts\"><ul><li><ul><li class=shortcut ng-repeat=\"shortcut in shortcuts\"><a class=\"lui small grey wired button\" ng-click=selectShortcut(shortcut)>{{ ::shortcut.label }}</a></li></ul></li><li class=group ng-repeat=\"group in groupedShortcuts\"><ul><li class=shortcut ng-repeat=\"shortcut in group\"><a class=\"lui small grey wired button\" ng-click=selectShortcut(shortcut)>{{ ::shortcut.label }}</a></li></ul></li></ul></footer>"
  );


  $templateCache.put('lui/templates/date-picker/datepicker-popup.html',
    "<div uib-popover-template=\"'lui/templates/date-picker/datepicker-inline.html'\" popover-placement=bottom-left popover-trigger=none popover-is-open=popover.isOpen popover-class=\"lui luid-datepicker\" ng-click=openPopover($event) class=\"lui datepicker input\"><input ng-readonly=popover.isOpen ng-model=displayStr ng-focus=openPopover($event) ng-blur=closePopover($event)> <i class=empty ng-click=clear($event)></i></div>"
  );


  $templateCache.put('lui/templates/date-picker/daterangepicker-popover.html',
    "<div class=calendars><button class=previous ng-click=previousMonth()></button> <button class=next ng-click=nextMonth()></button><table ng-repeat=\"month in months\" ng-class=[direction]><caption><span>{{ month.date | luifMoment : month.currentYear ? \"MMMM\" : \"MMMM - YYYY\" }}</span></caption><thead><th ng-repeat=\"dayLabel in dayLabels\">{{ ::dayLabel }}</th></thead><tbody><tr ng-repeat=\"week in month.weeks\"><td ng-repeat=\"day in week.days\" ng-class=\"[{ empty: day.empty, start: day.start, end: day.end, 'in-between': day.inBetween }, day.customClass]\" ng-disabled=day.disabled ng-click=selectDay(day) ng-mouseenter=onMouseEnter(day) ng-mouseleave=onMouseLeave(day)>{{ ::day.dayNum }}</td></tr></tbody></table></div><footer ng-if=\"!!shortcuts || !!groupedShortcuts\"><ul><li><ul><li class=shortcut ng-repeat=\"shortcut in shortcuts\"><a class=\"lui small grey wired button\" ng-click=selectShortcut(shortcut)>{{ ::shortcut.label }}</a></li></ul></li><li class=group ng-repeat=\"group in groupedShortcuts\"><ul><li class=shortcut ng-repeat=\"shortcut in group\"><a class=\"lui small grey wired button\" ng-click=selectShortcut(shortcut)>{{ ::shortcut.label }}</a></li></ul></li></ul></footer>"
  );


  $templateCache.put('lui/templates/date-picker/daterangepicker.html',
    "<span class=\"lui daterange tagged long input\" uib-popover-template=\"'lui/templates/date-picker/daterangepicker-popover.html'\" popover-placement=bottom-left popover-trigger=none popover-is-open=popover.isOpen popover-class=\"lui luid-daterangepicker\" ng-click=togglePopover($event)><i class=empty ng-click=clear($event)></i> <span class=tags ng-show=popover.isOpen><span class=tag ng-class=\"{ selected: editingStart }\" ng-click=editStart($event)>{{ !!period.start ? (period.start | luifMoment : momentFormat) : fromLabel }}</span> <i class=\"lui east arrow icon\"></i> <span class=tag ng-class=\"{ selected: !editingStart }\" ng-click=editEnd($event)>{{ !!period.end ? (period.end | luifMoment : momentFormat) : toLabel }}</span></span> <input ng-model=displayStr></span>"
  );


  $templateCache.put('lui/templates/formly/fields/api-select-multiple.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><luid-api-select-multiple api=options.templateOptions.api filter=options.templateOptions.filter placeholder={{::options.templateOptions.placeholder}} name={{::id}} ng-model=model[options.key] ng-required={{::options.templateOptions.required}}></luid-api-select-multiple><label for={{::id}}>{{ options.templateOptions.label }}</label><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/api-select.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><luid-api-select api=options.templateOptions.api filter=options.templateOptions.filter placeholder={{::options.templateOptions.placeholder}} name={{::id}} ng-model=model[options.key] ng-required={{::options.templateOptions.required}}></luid-api-select><label for={{::id}}>{{ options.templateOptions.label }}</label><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/checkbox.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui checkbox input\"><input type=checkbox name={{::id}} ng-model=model[options.key] ng-disabled=options.templateOptions.disabled><label for={{::id}}>{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/date.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><luid-date-picker-popup ng-model=model[options.key] ng-required={{::options.templateOptions.required}} name={{::id}} ng-disabled=options.templateOptions.disabled></luid-date-picker-popup><label for={{::id}}>{{ options.templateOptions.label }}</label><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/email.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui input\"><input placeholder=\"{{::options.templateOptions.placeholder }}\" type=email name={{::id}} ng-model=model[options.key] ng-required={{::options.templateOptions.required}} ng-disabled=options.templateOptions.disabled><label for={{::id}}>{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.email\">{{::options.templateOptions.emailError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/portrait.html',
    "<div class=\"lui {{::options.templateOptions.display}} portrait field\"><luid-image-picker ng-model=model[options.key] name={{::id}} ng-required={{options.templateOptions.required}} ng-disabled=options.templateOptions.disabled class={{::options.templateOptions.size}}></luid-image-picker><label for={{::id}}>{{ options.templateOptions.label }}</label><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/radio.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui radio input\" ng-repeat=\"choice in options.templateOptions.choices\"><input id={{::id}}_{{$index}} type=radio name={{::id}} ng-model=model[options.key] ng-required={{options.templateOptions.required}} ng-disabled=options.templateOptions.disabled ng-value=choice><label for={{::id}}_{{$index}}>{{ choice.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper}}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small><label>{{ options.templateOptions.label }}</label></div>"
  );


  $templateCache.put('lui/templates/formly/fields/select.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><ui-select ng-model=model[options.key] ng-required={{options.templateOptions.required}} ng-disabled=options.templateOptions.disabled name={{::id}} focus-on={{::id}}><ui-select-match placeholder={{::options.templateOptions.placeholder}} allow-clear=true>{{$select.selected.label}}</ui-select-match><ui-select-choices repeat=\"choice in options.templateOptions.choices | filter : $select.search\"><div ng-bind-html=\"choice.label | highlight: $select.search\"></div></ui-select-choices></ui-select><label for={{::id}}>{{ options.templateOptions.label }}</label><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/text.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui input\"><input placeholder=\"{{::options.templateOptions.placeholder }}\" name={{::id}} ng-model=model[options.key] ng-required={{options.templateOptions.required}} ng-disabled=options.templateOptions.disabled><label for={{::id}}>{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/user-multiple.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><luid-user-picker-multiple ng-model=model[options.key] ng-required={{::options.templateOptions.required}} ng-disabled=options.templateOptions.disabled name={{::id}}></luid-user-picker-multiple><label for={{::id}}>{{ options.templateOptions.label }}</label><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/user.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><luid-user-picker ng-model=model[options.key] ng-required={{::options.templateOptions.required}} ng-disabled=options.templateOptions.disabled name={{::id}}></luid-user-picker><label for={{::id}}>{{ options.templateOptions.label }}</label><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$touched && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/inputs/api-select-multiple.html',
    "<ui-select multiple><ui-select-match placeholder={{::placeholder}} allow-clear=true>{{$item.name}}</ui-select-match><ui-select-choices repeat=\"choice in choices track by choice.id\" refresh=refresh($select.search) refresh-delay=0><div ng-bind-html=\"choice.name | highlight: $select.search\"></div></ui-select-choices></ui-select>"
  );


  $templateCache.put('lui/templates/formly/inputs/api-select.html',
    "<ui-select><ui-select-match placeholder={{::placeholder}} allow-clear=true>{{$select.selected.name}}</ui-select-match><ui-select-choices repeat=\"choice in choices track by choice.id\" refresh=refresh($select.search) refresh-delay=0><div ng-bind-html=\"choice.name | highlight: $select.search\"></div></ui-select-choices></ui-select>"
  );


  $templateCache.put('lui/templates/image-picker/image-cropper.modal.html',
    "<div class=luid-cropper><img-crop image=image result-image=cropped area-type=rectangle result-image-size=\"'max'\" aspect-ratio=croppingRatio></img-crop></div><footer class=\"modal-footer lui right aligned\"><div class=\"lui button\" ng-click=crop()>{{ 'LUIIMGCROPPER_CROP' | translate }}</div><div class=\"lui button\" ng-click=donotcrop()>{{ 'LUIIMGCROPPER_DO_NOT_CROP' | translate }}</div><div class=\"lui flat button\" ng-click=cancel()>{{ cancelLabel }}</div></footer>"
  );


  $templateCache.put('lui/templates/image-picker/image-picker.html',
    "<div class=\"lui image-picker\" ng-class=\"{ uploading: uploading }\"><div class=luid-image-picker-picture ng-style=\"pictureStyle\"><div class=input-overlay><span class=\"lui capitalized sentence\" translate=LUIIMGPICKER_UPLOAD_IMAGE></span> <input accept=image/* type=file ng-model=file class=fileInput file-model=image luid-image-cropper on-cropped=onCropped on-cancelled=onCancelled cropping-disabled=croppingDisabled cropping-ratio=\"croppingRatio\"></div><div class=upload-overlay><div class=\"lui inverted x-large loader\"></div></div></div>"
  );


  $templateCache.put('lui/templates/notify-service/alert.html',
    "<section>{{message}}</section><footer class=\"lui right aligned\"><button class=\"lui button\" ng-click=ok()>{{okLabel}}</button></footer>"
  );


  $templateCache.put('lui/templates/notify-service/confirm.html',
    "<section>{{message}}</section><footer class=\"lui right aligned\"><button class=\"lui button\" ng-click=ok()>{{okLabel}}</button> <button class=\"lui flat button\" ng-click=cancel()>{{cancelLabel}}</button></footer>"
  );


  $templateCache.put('lui/templates/notify-service/error.html',
    "<div class=\"lui callout filled luis-notify red typeset\" ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small red button icon cross close\" ng-click=$close()></div><h5 ng-show=!$message>Error</h5><h5 ng-hide=!$message>{{ $message }}</h5></div>"
  );


  $templateCache.put('lui/templates/notify-service/loading.html',
    "<div class=\"lui up callout luis-notify typeset\" ng-class=[calloutClass] ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small filling button icon cross close\" ng-click=$close() ng-hide=loading></div><div class=\"lui small filling button icon cross close\" ng-click=cancel() ng-show=\"loading && canCancel\"></div><h5 ng-show=!message><span class=\"lui loader\" ng-show=loading></span>&nbsp;&nbsp;Loading</h5><h5 ng-hide=!message><span class=\"lui loader\" ng-show=loading></span>&nbsp;&nbsp;{{ message }}</h5></div>"
  );


  $templateCache.put('lui/templates/notify-service/success.html',
    "<div class=\"lui green up callout luis-notify typeset\" ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small filling button icon cross close\" ng-click=$close()></div><h5 ng-show=!$message>Success</h5><h5 ng-hide=!$message>{{ $message }}</h5></div>"
  );


  $templateCache.put('lui/templates/notify-service/warning.html',
    "<div class=\"lui orange up callout luis-notify typeset\" ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small filling button icon cross close\" ng-click=$close()></div><h5 ng-show=!$message>Warning</h5><h5 ng-hide=!$message>{{ $message }}</h5></div>"
  );


  $templateCache.put('lui/templates/table-grid/table-grid.html',
    "<div class=\"lui tablegrid\"><div class=\"scrollable columns\"><div class=virtualscroll ng-include=\"'lui/templates/table-grid/table-grid.table.html'\"></div></div><div class=\"locked columns\" ng-if=\"existFixedRow || isSelectable\"><div class=holder><div class=virtualscroll ng-include=\"'lui/templates/table-grid/table-grid.table.html'\"></div></div></div></div>"
  );


  $templateCache.put('lui/templates/table-grid/table-grid.table.html',
    "<table><thead><tr role=row ng-repeat=\"row in ::headerRows track by $index\" ng-if=\"$index !== 0\"><th ng-if=isSelectable style=\"width: 3.5em\" class=locked role=columnheader colspan=1 rowspan=1></th><th role=columnheader class=sortable ng-repeat=\"header in ::row track by $index\" ng-click=updateOrderedRows(header) ng-class=\"{'locked': header.fixed, 'desc': (selected.orderBy === header && selected.reverse === false), 'asc': (selected.orderBy === header && selected.reverse === true)}\" ng-style=\"{'max-width': header.width + 'em', 'min-width': header.width + 'em'}\" rowspan=\"{{ header.rowspan }}\" colspan=\"{{ header.colspan }}\">{{ header.label }}</th></tr><tr role=row><th ng-if=isSelectable style=\"width: 3.5em\" class=locked role=columnheader colspan=1 rowspan=1><div class=\"lui solo checkbox\"><input ng-class=masterCheckBoxCssClass type=checkbox ng-model=allChecked.value ng-change=onMasterCheckBoxChange() ng-value=\"true\"><label>&nbsp;</label></div></th><th role=columnheader ng-repeat=\"header in ::colDefinitions track by $index\" ng-style=\"{'max-width': header.width + 'em', 'min-width': header.width + 'em'}\" ng-if=\"::header.filterType != FilterTypeEnum.NONE\" colspan=1 rowspan=1 class=filtering><div class=\"lui fitting search input\" ng-if=\"::header.filterType === FilterTypeEnum.TEXT\"><input ng-change=updateFilteredRows() ng-model=filters[$index].currentValues[0] ng-model-options=\"{ updateOn: 'default blur', debounce: { 'default': 500, 'blur': 0 } }\"></div><ui-select multiple class=\"lui fitting nguibs-ui-select\" ng-model=filters[$index].currentValues reset-search-input=true on-remove=updateFilteredRows() ng-if=\"header.filterType === FilterTypeEnum.MULTISELECT && filters[$index].selectValues.length > 1\" on-select=updateFilteredRows()><ui-select-match placeholder=\"{{ 'SELECT_ITEMS' | translate }}\">{{ $item }}</ui-select-match><ui-select-choices repeat=\"value in filters[$index].selectValues | filter: $select.search\"><span ng-bind-html=value></span></ui-select-choices></ui-select><ui-select class=\"lui fitting nguibs-ui-select\" ng-model=filters[$index].currentValues[0] reset-search-input=true on-select=updateFilteredRows() allow-clear ng-if=\"header.filterType === FilterTypeEnum.SELECT && filters[$index].selectValues.length > 1\"><ui-select-match allow-clear=true placeholder=\"{{ 'SELECT_ITEM' | translate }}\">{{ $select.selected }}</ui-select-match><ui-select-choices repeat=\"value in filters[$index].selectValues | filter: $select.search\"><span ng-bind-html=value></span></ui-select-choices></ui-select></th></tr></thead><tbody><tr role=row ng-repeat=\"row in visibleRows\" ng-style=row.styles ng-click=\"internalRowClick($event, row);\"><td ng-if=isSelectable style=\"width: 3.5em\" class=locked colspan=1 rowspan=1><div class=\"lui solo checkbox\"><input type=checkbox ng-change=onCheckBoxChange() ng-model=\"row._luiTableGridRow.isChecked\"><label>&nbsp;</label></div></td><td role=cell ng-repeat=\"cell in ::colDefinitions track by $index\" ng-style=\"{'max-width': cell.width + 'em', 'min-width': cell.width + 'em'}\" ng-bind-html=cell.getValue(row) ng-class=\"{'locked': cell.fixed, 'lui left aligned': cell.textAlign == 'left', 'lui right aligned': cell.textAlign == 'right', 'lui center aligned': cell.textAlign == 'center'}\"></td></tr></tbody></table>"
  );

}]);
