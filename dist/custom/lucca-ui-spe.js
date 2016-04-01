(function(){
	'use strict';
	angular.module('moment', []).factory('moment', function () { return window.moment; });
	angular.module('underscore', []).factory('_', function () { return window._; });

	angular.module('lui.directives', ['pascalprecht.translate', 'moment', 'underscore', 'ui.select', 'ui.bootstrap']);
	angular.module('lui.filters', ['moment']);
	angular.module('lui.services', []);

	// all the templates in one module
	angular.module('lui.templates.momentpicker', []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module("lui.templates.daterangepicker", []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module("lui.templates.translationsinput", []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module('lui.templates', ['lui.templates.momentpicker', "lui.templates.daterangepicker", "lui.templates.translationsinput"]);

	// all the translations in one module
	angular.module('lui.translates.userpicker', []);
	angular.module('lui.translates.daterangepicker', []);
	angular.module('lui.translates.tablegrid', []);
	angular.module('lui.translates', ['pascalprecht.translate','lui.translates.userpicker','lui.translates.daterangepicker','lui.translates.tablegrid']);

	angular.module('lui', ['lui.directives','lui.services','lui.filters','lui.templates','lui.translates']);
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
		$scope.startingDay = moment.localeData().firstDayOfWeek();
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
		$scope.dayClass = function(date, mode){
 			var className = '';
			if (mode == 'day') {
				if (moment(date).diff($scope.internal.startsOn) === 0) { className = 'start'; }
				if (moment(date).diff($scope.internal.endsOn) === 0) { className += 'end'; }
				if (moment(date).isAfter($scope.internal.startsOn) && moment(date).isBefore($scope.internal.endsOn)) { className += 'in-between'; }
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
			"	<uib-datepicker ng-if='hackRefresh' class='lui datepicker start-date' ng-model='internal.startsOn' show-weeks='false' custom-class='dayClass(date, mode)' starting-day='startingDay' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='hackRefresh' class='lui datepicker end-date' ng-model='internal.endsOn' show-weeks='false' min-date='internal.startsOn' custom-class='dayClass(date, mode)' starting-day='startingDay' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='!hackRefresh' class='lui datepicker start-date' ng-model='internal.startsOn' show-weeks='false' custom-class='dayClass(date, mode)' starting-day='startingDay' ng-change='internalUpdated()'></uib-datepicker>" +
			"	<uib-datepicker ng-if='!hackRefresh' class='lui datepicker end-date' ng-model='internal.endsOn' show-weeks='false' min-date='internal.startsOn' custom-class='dayClass(date, mode)' starting-day='startingDay' ng-change='internalUpdated()'></uib-datepicker>" +
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
			'class="month">{{controller.date | luifMoment: \'MMM\' | limitTo : 3}}'+
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
})();;(function () {
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
})();;(function () {
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
			template: "<input type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-pattern='pattern' ng-model='strDuration' ng-change='updateValue()' ng-blur='formatInputValue()'>"
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
})();;(function () {
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
	**  - angular translate
	**  - underscore
	**/

	angular.module('lui.directives')
	.directive('luidTranslations', ['$translate', '_', '$filter', '$timeout', function($translate, _, $filter,  $timeout){
		function link(scope, element, attrs, ctrls){
			var ngModelCtrl = ctrls[1];
			var translateCtrl = ctrls[0];

			var cultures = ['en', 'de', 'es', 'fr', 'it', 'nl'];
			scope.cultures = cultures;
			// need the current culture to
			var currentCulture = $translate.preferredLanguage() || "en";
			scope.currentCulture = currentCulture;

			// default mode is dictionary
			var mode = 'dictionary';
			if(!!attrs.mode){
				mode = scope.mode;
			}
			if(mode === 'dictionary' && ngModelCtrl.$viewValue !== undefined){
				_.each(cultures, function(c){
					scope.$watch(function(){ return ngModelCtrl.$viewValue[c]; }, function(){ ngModelCtrl.$render(); });
				});
			}

			ngModelCtrl.$render = function(){
				scope.internal = parse(ngModelCtrl.$viewValue);
			};
			translateCtrl.updateViewValue = function(){
				switch(mode){
					case "dictionary":
						return updateDictionary(scope.internal);
					case "|":
					case "pipe":
						return updatePipe(scope.internal);
					case "[]":
					case "brackets":
						return updateBrackets(scope.internal);
				}
			};

			var parse = function(value){
				switch(mode){
					case "dictionary":
						return parseDictionary(value);
					case "|":
					case "pipe":
						return parsePipe(value);
					case "[]":
					case "brackets":
						return parseBrackets(value);
					default:
						return {};
				}
			};

			// mode dictionary
			var parseDictionary = function(value){
				return _.reduce(cultures, function(memo, c){
					memo[c] = value[c];
					return memo;
				}, {});
			};
			var updateDictionary = function(value){
				_.each(cultures, function(c){
					ngModelCtrl.$viewValue[c] = value[c];
				});
				ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
				scope.$parent.$eval(attrs.ngChange); // needs to be called manually cuz the object ref of the $viewValue didn't change
			};

			// mode pipe
			var parsePipe = function(value){
				if(!value){
					return {};
				}
				// value looks like this "en:some stuff|de:|nl:|fr:des bidules|it:|es:"
				var translations = value.split("|");
				var result = {};
				_.each(translations, function(t){
					var key = t.substring(0,2);
					var val = t.substring(3);
					result[key] = val;
				});
				return _.pick(result, cultures);
			};
			var updatePipe = function(value){
				var newVal = _.map(cultures, function(c){
					if(!!value[c]){
						return c + ":" + value[c];
					}
					return c + ":";
				}).join("|");
				ngModelCtrl.$setViewValue(newVal);
			};

			// mode brackets
			var parseBrackets = function(value){
				return {};
			};

		}
		return{
			require:['luidTranslations','^ngModel'],
			controller:'luidTranslationsController',
			scope: {
				// disabled:'=',

				mode:'@', // allowed values: "|" "pipe", "[]" "brackets", "dictionary"

				size:"@", // the size of the input (short, long, x-long, fitting)
			},
			templateUrl:"lui/directives/luidTranslations.html",
			restrict:'EA',
			replace:true,
			link:link
		};
	}])
	.controller('luidTranslationsController', ['$scope', '$translate', '$timeout', function($scope, $filter, $timeout){
		var ctrl = this;
		/******************
		* UPDATE          *
		******************/
		$scope.update = function(){
			ctrl.updateViewValue();
		};


		/******************
		* FOCUS & BLUR    *
		******************/
		var blurTimeout;
		$scope.focusInput = function(){
			if(!!blurTimeout){
				$timeout.cancel(blurTimeout);
				blurTimeout = undefined;
			}
			$scope.focused = true;
		};
		$scope.blurInput = function(){
			blurTimeout = $timeout(function(){
				$scope.focused = false;
			}, 500);
		};

	}]);


	/**************************/
	/***** TEMPLATEs      *****/
	/**************************/
	angular.module("lui.templates.translationsinput").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidTranslations.html",
			"<div class=\"luid-translations {{size}}\" ng-class=\"{open:focused || hovered}\" ng-mouseenter=\"hovered=true\" ng-mouseleave=\"hovered=false\">" +
			"	<div class=\"lui fitting input with addon\">" +
			"		<input type=\"text\" ng-model=\"internal[currentCulture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-change=\"update()\">" +
			"		<span class=\"lui right addon\">{{currentCulture}}</span>" +
			"	</div>" +
			"	<div class=\"lui luid-translations-dropdown\">" +
			"		<div class=\"lui fitting input with addon\" ng-repeat=\"culture in cultures\" ng-if=\"culture !== currentCulture\">" +
			"			<input type=\"text\" ng-model=\"internal[culture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-change=\"update()\">" +
			"			<span class=\"lui right addon\">{{culture}}</span>" +
			"		</div>" +
			// "		<hr>" +
			// "		<div class=\"lui button right pulled\" ng-click=\"close()\">Ok</div>" +
			"	</div>" +
			"</div>" +
		"");

	}]);
})();
;(function(){
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment - for tagging former employees
	**  - underscore
	**  - ui.select
	**  - ngSanitize as a result of the dependency to ui.select
	**/

	var MAX_COUNT = 5; // MAGIC_NUMBER
	var MAGIC_NUMBER_maxUsers = 10000; // Number of users to retrieve when using a user-picker-multiple or custom filter
	var DEFAULT_HOMONYMS_PROPERTIES = [{
		"label": "LUIDUSERPICKER_DEPARTMENT",
		"name": "department.name",
		"icon": "location"
	}, {
		"label": "LUIDUSERPICKER_LEGALENTITY",
		"name": "legalEntity.name",
		"icon": "tree list"
	}, {
		"label": "LUIDUSERPICKER_EMPLOYEENUMBER",
		"name": "employeeNumber",
		"icon": "user"
	}, {
		"label": "LUIDUSERPICKER_MAIL",
		"name": "mail",
		"icon": "email"
	}]; // MAGIC LIST OF PROPERTIES

	var uiSelectChoicesTemplate = "<ui-select-choices position=\"down\" repeat=\"user in users\" refresh=\"find($select.search)\" refresh-delay=\"0\" ui-disable-choice=\"!!user.overflow\">" +
	"<div ng-class=\"{dividing: user.isDisplayedFirst}\">" +
		"<div ng-if=\"!!user.isSelected\" ng-bind-html=\"user.firstName + ' ' + user.lastName | luifHighlight : $select.search : user.info : 'LUIDUSERPICKER_SELECTED'\"></div>" +
		"<div ng-if=\"!!user.isAll\">{{ 'LUIDUSERPICKER_ALL' | translate }}</div>" +
		"<div ng-if=\"!!user.isMe\" ng-bind-html=\"user.firstName + ' ' + user.lastName | luifHighlight : $select.search : user.info : 'LUIDUSERPICKER_ME'\"></div>" +
		"<div ng-if=\"!user.isDisplayedFirst\" ng-bind-html=\"user.firstName + ' ' + user.lastName | luifHighlight : $select.search : user.info\"></div>" +
		"<small ng-if=\"!user.overflow && user.hasHomonyms && getProperty(user, property.name)\" ng-repeat=\"property in displayedProperties\"><i class=\"lui icon {{property.icon}}\"></i> <b>{{property.label | translate}}</b> {{getProperty(user, property.name)}}<br/></small>" +
		"<small ng-if=\"showFormerEmployees && user.isFormerEmployee\" translate translate-values=\"{dtContractEnd:user.dtContractEnd}\">LUIDUSERPICKER_FORMEREMPLOYEE</small>" +
	"</div>" +
	"<small ng-if=\"user.overflow\" translate translate-values=\"{cnt:user.cnt, all:user.all}\">{{user.overflow}}</small>" +
	"</ui-select-choices>";

	var userPickerTemplate = "<ui-select theme=\"bootstrap\"" +
	"class=\"lui {{size}} input \" on-select=\"onSelect()\" on-remove=\"onRemove()\" ng-disabled=\"controlDisabled\">" +
	"<ui-select-match placeholder=\"{{ 'LUIDUSERPICKER_PLACEHOLDER' | translate }}\">" +
		"<div ng-if=\"!$select.selected.isAll\">{{ $select.selected.firstName }} {{$select.selected.lastName}}</div>" +
		"<div ng-if=\"$select.selected.isAll\">{{ 'LUIDUSERPICKER_ALL' | translate }}</div>" +
	"</ui-select-match>" +
	uiSelectChoicesTemplate +
	"</ui-select>";

	var userPickerMultipleTemplate = "<ui-select multiple theme=\"bootstrap\" " +
	"class=\"lui {{size}} input\" on-select=\"onSelect()\" on-remove=\"onRemove()\" ng-disabled=\"controlDisabled\" close-on-select=\"false\">" +
	"<ui-select-match placeholder=\"{{ 'LUIDUSERPICKER_PLACEHOLDER' | translate }}\">{{$item.firstName}} {{$item.lastName}} " +
		"<small ng-if=\"$item.hasHomonyms && getProperty($item, property.name)\" ng-repeat=\"property in displayedProperties\"><b>{{property.label | translate}}</b> {{getProperty($item, property.name)}} </small>" +
		"<small ng-if=\"$item.isFormerEmployee\" translate  translate-values=\"{dtContractEnd:user.dtContractEnd}\">LUIDUSERPICKER_FORMEREMPLOYEE</small>" +
	"</ui-select-match>" +
	uiSelectChoicesTemplate +
	"</ui-select>";


	angular.module('lui.directives')
	.directive('luidUserPicker', function () {
		return {
			restrict: 'E',
			controller: "luidUserPickerController",
			template: userPickerTemplate,
			require: ["luidUserPicker","^ngModel"],
			scope: {
				/*** STANDARD ***/
				size: "@", // x-short, short, long, x-long
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				/*** FORMER EMPLOYEES ***/
				showFormerEmployees: "=", // boolean
				/*** HOMONYMS ***/
				homonymsProperties: "=", // list of properties to handle homonyms
				/*** CUSTOM FILTER ***/
				customFilter: "=", // should be a function with this signature: function(user){ return boolean; }
				/*** OPERATION SCOPE ***/
				appId: "=", // id of the application that users should have access
				operations: "=", // list of operation ids that users should have access
				/*** CUSTOM COUNT ***/
				// Display a custom info in a label next to each user
				// You should only set one of these two attributes, otherwise it will only be 'customInfoAsync' that will be displayed
				// If you need to use a sync and an async functions, use 'customInfoAsync'
				customInfo: "=", // should be a function with this signature: function(user) { return string; }
				customInfoAsync: "=", // should be a function with this signature: function(user) { return promise; }
				/*** DISPLAY ME FIRST ***/
				displayMeFirst: "=", // boolean
				/*** DISPLAY ALL USERS ***/
				displayAllUsers: "=", // boolean
			},
			link: function (scope, elt, attrs, ctrls) {
				var upCtrl = ctrls[0];
				var ngModelCtrl = ctrls[1];
				upCtrl.isMultipleSelect = false;
				upCtrl.asyncPagination = false;
				upCtrl.useCustomFilter = !!attrs.customFilter;
				upCtrl.displayCustomInfo = !!attrs.customInfo || !!attrs.customInfoAsync;

				scope.$watch(function() {
					return (ngModelCtrl.$viewValue || {}).id;
				}, function() {
					scope.reorderUsers();
				});

				upCtrl.getSelectedUsers = function() {
					if (!!ngModelCtrl.$viewValue) {
						return [ngModelCtrl.$viewValue];
					}
					return [];
				};
				upCtrl.getSelectedUserIds = function() {
					if(!!ngModelCtrl.$viewValue) {
						return [ngModelCtrl.$viewValue.id];
					}
					return [];
				};
			}
		};
	})

	.directive('luidUserPickerMultiple', function () {
		return {
			restrict: 'E',
			controller: "luidUserPickerController",
			template: userPickerMultipleTemplate,
			require: ["luidUserPickerMultiple", "^ngModel"],
			scope: {
				/*** STANDARD ***/
				size: "@", // x-small, small, long, x-long
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				/*** FORMER EMPLOYEES ***/
				showFormerEmployees: "=", // boolean
				/*** HOMONYMS ***/
				homonymsProperties: "=", // list of properties to handle homonyms
				/*** CUSTOM FILTER ***/
				customFilter: "=", // should be a function with this signature: function(user){ return boolean; }
				/*** OPERATION SCOPE ***/
				appId: "=", // id of the application that users should have access
				operations: "=", // list of operation ids that users should have access
				/*** CUSTOM COUNT ***/
				// Display a custom info in a label next to each user
				// You should only set one of these two attributes, otherwise it will only be 'customInfoAsync' that will be displayed
				// If you need to use a sync and an async functions, use 'customInfoAsync'
				customInfo: "=", // should be a function with this signature: function(user) { return string; }
				customInfoAsync: "=", // should be a function with this signature: function(user) { return promise; }
				/*** DISPLAY ME FIRST ***/
				displayMeFirst: "=", // boolean
			},
			link: function (scope, elt, attrs, ctrls) {
				var upCtrl = ctrls[0];
				var ngModelCtrl = ctrls[1];
				upCtrl.isMultipleSelect = true;
				upCtrl.asyncPagination = false;
				upCtrl.useCustomFilter = !!attrs.customFilter;
				upCtrl.displayCustomInfo = !!attrs.customInfo || !!attrs.customInfoAsync;

				scope.$watchCollection(function() {
					return ngModelCtrl.$viewValue;
				}, function() {
					scope.reorderUsers();
				});

				upCtrl.getSelectedUsers = function() {
					return (ngModelCtrl.$viewValue || []);
				};
				upCtrl.getSelectedUserIds = function() {
					if(!!ngModelCtrl.$viewValue){
						return _.pluck(ngModelCtrl.$viewValue, "id");
					}
					return [];
				};
			}
		};
	})

	.controller("luidUserPickerController", ['$scope', '$http', 'moment', '$timeout', '$q', function ($scope, $http, moment, $timeout, $q) {
		var ctrl = this;
		// Only used for UserPickerMultiple
		var selectedUsersCount = 0;
		// Only used for asynchronous pagination
		var timeout = {}; // object that handles timeouts - timeout.count will store the id of the timeout related to the count query
		var init = true; // boolean to initialise the connected user
		var myId; // used for 'display me first' feature

		/****************/
		/***** FIND *****/
		/****************/
		var filteredUsers;
		var indexedUsers; // fetched users with their original position

		$scope.find = function (clue) {
			reinit();
			// Should only be executed once --> fetch 'me'
			initMe();
			getUsersAsync(clue)
			.then(function(results) {
				if (results.length > 0) {
					var users = results;
					filteredUsers = filterResults(users) || [];

					// If no clue, add 'all users' to the set of results
					if (!!$scope.displayAllUsers && (!clue || !clue.length)) {
						filteredUsers.push({ id: -1, isAll: true });
					}

					// Useful with user-picker-multiple
					// Store original position of fetched users to handle unselected users and replace them at their original position
					indexedUsers = filteredUsers;
					originalOrder(indexedUsers);

					// Save the order we got from the api
					// Set first users if they belong to the set of results
					// Handle pagination
					$scope.reorderUsers();

					/***** POST FILTERS *****/
					// Execute post filters on indexedUsers to include selected users if it is a user-picker-multiple
					if (hasFormerEmployees(indexedUsers)) {
						handleFormerEmployees(indexedUsers);
					}

					if (hasHomonyms(indexedUsers)) {
						tagHomonyms(indexedUsers);
						handleHomonymsAsync(indexedUsers).then(
							function(usersWithHomonymsProperties) {
								indexedUsers = usersWithHomonymsProperties;
							},
							function(message) {
								errorHandler("GET_HOMONYMS_PROPERTIES", message);
							});
					}
				} else {
					$scope.users = [{overflow: "LUIDUSERPICKER_NORESULTS", id:-1}];
				}
			}, function(message) {
				errorHandler("GET_USERS", message);
			});
		};

		var getUsersPromise; // store the current get request to fetch users
		var reinit = function() {
			reinitTimeout();

			// Reinitialise promise
			// Happen when the user starts typing a name, then waits enough to call the api and continues typing
			// We do not want to treat the result of the previous request since they are now obsolete
			if (getUsersPromise) {
				getUsersPromise.then(function(response) {}); // do nothing with the results
			}
		};

		/*******************/
		/***** FILTERS *****/
		/*******************/

		var filterResults = function(users) {
			var filteredUsers = users;

			// Used when a custom filtering function is given
			if (ctrl.useCustomFilter) {
				filteredUsers = _.filter(users, function(user){ return $scope.customFilter(angular.copy(user)); });
			}
			return filteredUsers;
		};

		/*******************/
		/***** TIMEOUT *****/
		/*******************/

		var reinitTimeout = function() {
			// Cancel previous timeout
			if (timeout.count) {
				$timeout.cancel(timeout.count);
			}
		};

		/*****************/
		/***** USERS *****/
		/*****************/

		var getLimit = function() {
			var limit = MAGIC_NUMBER_maxUsers;

			if (ctrl.asyncPagination) {
				limit = MAX_COUNT + 1;
			}
			return limit;
		};

		var getUsersAsync = function(input) {
			var formerEmployees = "formerEmployees=" + ($scope.showFormerEmployees ? "true" : "false");
			var limit = "&limit=" + getLimit();
			var clue = "clue=" + input;
			var operations = "";
			var appInstanceId = "";
			var query = "/api/v3/users/find?" + (input ? (clue + "&") : "") + formerEmployees + limit;
			var deferred = $q.defer();

			// Both attributes should be defined
			if ($scope.appId && $scope.operations && $scope.operations.length) {
				appInstanceId = "&appinstanceid=" + $scope.appId;
				operations = "&operations=" + $scope.operations.join(',');
			}
			query += (appInstanceId + operations);

			getUsersPromise = $http.get(query);
			getUsersPromise
			.then(function(response) {
				deferred.resolve(response.data.data.items);
			}, function(response) {
				deferred.reject(response.data.Message);
			});
			return deferred.promise;
		};

		/**********************/
		/***** PAGINATION *****/
		/**********************/

		var hasPagination = function(users) {
			return !!users && users.length > MAX_COUNT;
		};

		var handlePagination = function(users) {
			if (!ctrl.asyncPagination) {
				$scope.count = users.length;
			}
			else {
				$scope.count = "...";
			}
			$scope.users = _.first(users, MAX_COUNT);
			handleOverflowMessage();
		};

		// asyncPagination feature, not yet implemented
		// var handlePaginationAsync = function(input, users) {
		// 	var delay = 2500; // default delay is 2,5s
		// 	var deferred = $q.defer();

		// 	reinitTimeout();
		// 	// Only select the X first users and display a message to the user to indicate that there are more results
		// 	handlePagination(users);

		// 	// launch new timeout
		// 	timeout.count = $timeout(function() {
		// 		getCountAsync(input).then(
		// 			function(count) {
		// 				$scope.count = count;
		// 				handleOverflowMessage();
		// 				deferred.resolve(count);
		// 			},
		// 			function(message) {
		// 				deferred.reject(message);
		// 			}
		// 		);
		// 	}, delay);
		// 	return deferred.promise;
		// };

		// asyncPagination feature, not yet implemented
		// var getCountAsync = function(input) {
		// 	var deferred = $q.defer();
		// 	var dtContractEnd = "&dtcontractend=since," + moment().format("YYYY-MM-DD") + ",null";
		// 	var query = "/api/v3/users?name=like," + input + "&fields=collection.count" + ($scope.showFormerEmployees ? "" : dtContractEnd); // query for count

		// 	delete timeout.count;
		// 	$http.get(query).then(
		// 		function(response) {
		// 			deferred.resolve(response.data.data.count);
		// 		},
		// 		function(message) {
		// 			deferred.reject(message);
		// 		}
		// 	);
		// 	return deferred.promise;
		// };

		var handleOverflowMessage = function() {
			$scope.users.push({ overflow: "LUIDUSERPICKER_OVERFLOW", cnt:MAX_COUNT, all:$scope.count,  id:-1 });
		};

		/********************/
		/***** HOMONYMS *****/
		/********************/

		var hasHomonyms = function(users) {
			// Should latinise names and take into account composite names
			var usersWithoutHomonyms = _.uniq(users, function(user) {
				if (user.firstName && user.lastName) {
					return (user.firstName.toLowerCase() + user.lastName.toLowerCase());
				}
			});
			if (usersWithoutHomonyms.length < users.length) {
				return true;
			}
			return false;
		};

		var handleHomonymsAsync = function(users) {
			var homonyms = _.where(users, { hasHomonyms: true });
			var found = false; // indicate if we have found two properties allowing to differentiate homonyms
			var deferred = $q.defer();
			var propertiesArray; // Will contain each couple of properties to compare
			var properties; // Object containing the couple of properties to compare
			var emergencyProperty; // used if NO couple of differentiating properties are found. In this case, only one property will be displayed
			var props; // List of properties that will be fetched in case of homonyms
			$scope.displayedProperties = []; // Will contain the name of the properties to display for homonyms

			// Define properties to fetch for homonyms
			if (!!$scope.homonymsProperties && $scope.homonymsProperties.length) {
				props = $scope.homonymsProperties;
			} else {
				props = DEFAULT_HOMONYMS_PROPERTIES;
			}
			getHomonymsPropertiesAsync(homonyms, props)
			.then(function(homonymsArray) {
					// Add fetched properties to the homonyms
					_.each(homonyms, function(user) {
						// Get the user returned by the api
						var userWithProps = _.find(homonymsArray, function(homonym) {
							return (user.id === homonym.id);
						});

						// Add each property to the user
						_.each(props, function(prop) {
							var newProp = prop.name.split('.')[0];
							user[newProp] = userWithProps[newProp];
						});
					});

					// Compare properties between homonyms
					_.each(props, function (prop1, propIndex1) {
						if (!found) {
							// Compare prop1 with the rest of the properties array
							var propRest = _.rest(props, propIndex1 + 1);
							_.each(propRest, function (prop2, index) {
								if (!found) {
									// Build array with the two properties
									// Each element of the array is an object with the properties that we want to compare
									propertiesArray = [];
									_.each(homonymsArray, function(item) {
										var valueProp1 = $scope.getProperty(item, prop1.name);
										var valueProp2 = $scope.getProperty(item, prop2.name);
										properties = {};
										properties[prop1.name] = valueProp1;
										properties[prop2.name] = valueProp2;
										propertiesArray.push(properties);
									});

									// Used to check that all values for prop1 are not equal
									var prop1Values = _.chain(propertiesArray)
									.pluck(prop1.name)
									.uniq()
									.value();
									// Used to check that all values for prop2 are not equal
									var prop2Values = _.chain(propertiesArray)
									.pluck(prop2.name)
									.uniq()
									.value();

									// prop1 is a differentiating property: each homonym has a different value for this property
									// if we do not find a couple of differentiating properties, we will at least display this one
									if ((!emergencyProperty) && (prop1Values.length === homonyms.length)) {
										emergencyProperty = prop1;
									}

									// All values for both properties must not be equal
									// There must be at least two different values
									if ((prop1Values.length > 1) && (prop2Values.length > 1)) {
										// Check that each couple of values is different from the other couples
										var withoutDuplicates = _.uniq(propertiesArray, function(item) { return (item[prop1.name] + item[prop2.name]); });
										// If the arrays have the same length, each couple of values is different
										if (withoutDuplicates.length === propertiesArray.length) {
											found = true;
											$scope.displayedProperties.push(prop1);
											$scope.displayedProperties.push(prop2);
										}
									}
								}
							});
						}
					});

					// If no couple of properties are differentiating, we will display the first differentiating property (values are different for all homonyms)
					if (!found && emergencyProperty) {
						$scope.displayedProperties.push(emergencyProperty);
					}
					deferred.resolve(users);
			}, function(message) {
				deferred.reject(message);
			});
			return deferred.promise;
		};

		var tagHomonyms = function(users) {
			_.each(users, function(user, index) {
				if (user.firstName && user.lastName) {
					var rest = _.rest(users, index + 1);
					_.each(rest, function(otherUser) {
						if (otherUser.firstName && otherUser.lastName) {
							// Should latinise names and take into account composite names
							if ((user.firstName.toLowerCase() === otherUser.firstName.toLowerCase()) && (user.lastName.toLowerCase() === otherUser.lastName.toLowerCase())) {
								user.hasHomonyms = true;
								otherUser.hasHomonyms = true;
							}
						}
					});
				}
			});
		};

		/*******************************/
		/***** HOMONYMS PROPERTIES *****/
		/*******************************/

		var getHomonymsPropertiesAsync = function(homonyms, properties) {
			var urlCalls = [];
			var query = "/api/v3/users?id=";
			var fields = "&fields=id,firstname,lastname";
			var deferred = $q.defer();

			// WARNING: Do not check if the properties exist!
			// WARNING: If they do not exist, the request will fail
			_.each(properties, function(prop) {
				fields += "," + prop.name;
			});

			_.each(homonyms, function(user) {
				if (user !== _.last(homonyms)) {
					query += (user.id + ',');
				}
				else {
					query += (user.id + fields);
				}
			});

			$http.get(query)
			.then(function(response) {
				deferred.resolve(response.data.data.items);
			}, function(response) {
				deferred.reject(response.data.Message);
			});
			return deferred.promise;
		};

		$scope.getProperty = function(user, prop) {
			var propList = prop.split('.');
			var value = user[_.first(propList)];

			_.each(propList, function(item) {
				if (value && (item !== _.first(propList))) {
					value = value[item];
				}
			});
			return value;
		};

		/****************************/
		/***** FORMER EMPLOYEES *****/
		/****************************/

		var hasFormerEmployees = function(users) {
			var formerEmployee = _.find(users, function(user) {
				return (moment(user.dtContractEnd).isBefore(moment()));
			});

			if (formerEmployee) {
				return true;
			}
			return false;
		};

		var handleFormerEmployees = function(users) {
			_.each(users, function(user) {
				if (user.id !== -1) {
					if (moment(user.dtContractEnd).isBefore(moment())) {
						user.isFormerEmployee = true;
					}
				}
			});
		};

		/***********************/
		/***** CUSTOM INFO *****/
		/***********************/

		var addInfoToUsers = function() {
			if ($scope.customInfo) {
				_.each($scope.users, function(user) {
					// We do not want customInfo to be called with overflow message or 'all users'
					// And we do not call customInfo if an info is already displayed
					if (user.id !== -1 && !user.info) {
						user.info = $scope.customInfo(angular.copy(user));
					}
				});
			}
			if ($scope.customInfoAsync) {
				_.each($scope.users, function(user) {
					// We do not want customInfoAsync to be called with overflow message or 'all users'
					// And we do not call customInfo if an info is already displayed
					if (user.id !== -1 && !user.info) {
						$scope.customInfoAsync(angular.copy(user))
						.then(function(info) {
							user.info = info;
						}, function(message) {
							errorHandler("GET_CUSTOM_INFO", message);
						});
					}
				});
			}
		};

		/**************/
		/***** ME *****/
		/**************/

		var initMe = function() {
			if (init && !!$scope.displayMeFirst) {
				getMeAsync().then(function(id) {
					myId = id;
				}, function(message) {
					errorHandler("GET_ME", message);
				});
				init = false;
			}
		};

		var getMeAsync = function() {
			var query = "/api/v3/users/me?fields=id";
			var dfd = $q.defer();
			$http.get(query)
			.then(function(response) {
				dfd.resolve(response.data.data.id);
			}, function(response) {
				dfd.reject(response.data.Message);
			});
			return dfd.promise;
		};

		/*************************/
		/***** DISPLAY USERS *****/
		/*************************/

		var originalOrder = function(users){
			if (!users || users.length === 0) { return users; }
			// do the users have an original order
			// this is in case we select different choices without calling find()
			if (users[0].originalPosition !== undefined) {
				// if so reorder them first
				users = _.sortBy(users, 'originalPosition');
			} else {
				// this is the original order we have to save
				_.each(users, function(u, index){ u.originalPosition = index; });
			}
			return users;
		};

		var displaySomeUsersFirst = function(users) {
			var sortedUsers = users;
			var selectedUser = !ctrl.isMultipleSelect ? _.find(users, function(user) { return user.id === ctrl.getSelectedUserIds()[0]; }) : null;
			var me = _.find(users, function(user) { return user.id === myId; });
			var all = _.findWhere(users, { isAll: true });

			// Display me first
			// Only if it is not a multiple user picker
			if (!!me && (!selectedUser || me.id !== selectedUser.id)) {
				me.isMe = true;
				sortedUsers = displayThisUserFirst(me, sortedUsers);
			}
			// Display "all users" first
			if (!!all) {
				sortedUsers = displayThisUserFirst(all, sortedUsers);
			}
			// Display selected user first
			if (!!selectedUser && (!all || selectedUser.id !== all.id)) {
				selectedUser.isSelected = true;
				sortedUsers = displayThisUserFirst(selectedUser, sortedUsers);
			}
			return sortedUsers;
		};

		// Display the user first
		var displayThisUserFirst = function(user, users) {
			var sortedUsers = users;
			if(!users || !users.length){ return; }
			// do the users have an original order
			// this is in case we select different choices without calling find()

			var partitions = _.partition(users, function(u) { return (u.id === user.id); }); // [[user], [rest]]

			// Sort users with 'user' as first result
			sortedUsers = _.union(partitions[0], partitions[1]);
			sortedUsers[0].isDisplayedFirst = true;

			return sortedUsers;
		};

		var removeDisplayProperties = function(users) {
			// Set display properties to false
			_.each(users, function(user) {
				user.isDisplayedFirst = false;
				user.isSelected = false;
				user.isMe = false;
			});
		};

		// this function is called when the filter results must be reordered for some reason
		// when the selected user changes for example, he has to be displayed as first result
		$scope.reorderUsers = function() {
			if (ctrl.isMultipleSelect) {
				// Compute ids to display from indexedUsers in order to handle unselected users
				var idsToDisplay = _.difference(_.pluck(indexedUsers, "id"), ctrl.getSelectedUserIds());
				filteredUsers = _.filter(indexedUsers, function(user) {
					return _.contains(idsToDisplay, user.id);
				});
			}

			// reorder them to their original order
			filteredUsers = originalOrder(filteredUsers);
			removeDisplayProperties(filteredUsers);
			// display some users first
			filteredUsers = displaySomeUsersFirst(filteredUsers);
			// Handle pagination
			if (hasPagination(filteredUsers)) {
				handlePagination(filteredUsers);
			} else {
				$scope.users = filteredUsers;
				$scope.count = ($scope.users||[]).length;
			}

			if (ctrl.displayCustomInfo) {
				addInfoToUsers();
			}
		};

		/**************************/
		/***** ERROR HANDLING *****/
		/**************************/

		var errorHandler = function(cause, message) {
			switch (cause) {
				case "GET_USERS": // error while trying to get the users matching the query
					$scope.users = [];
					$scope.users.push({ overflow: "LUIDUSERPICKER_ERR_GET_USERS", id:-1 });
					console.log({cause:cause, message:message});
					break;
				case "GET_COUNT": // error while trying to get the total number of users matching the query
				case "GET_HOMONYMS_PROPERTIES":  // error while trying to get the distinctive properties for homonyms
				case "GET_CUSTOM_INFO": // error while executing the customInfoAsync() function
				case "GET_ME": // error while trying to get the connected user
					console.log({cause:cause, message:message});
					break;
			}
		};
	}])

	// Filter to display custom info next to each user
	// Highlight the search in the name of the user and display a label next to each user
	.filter('luifHighlight', ['$filter', '$translate', function($filter, $translate) {
		return function(_input, _clue, _info, _key) {
			return (!!_key ? "<i>" + $translate.instant(_key) + "</i> " : "") + $filter('highlight')(_input, _clue) + (!!_info ? "<span class=\"lui label\">" + _info + "</span>" : "");
		};
	}]);

	/**************************/
	/***** TRANSLATIONS   *****/
	/**************************/
	angular.module('lui.translates.userpicker').config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('en', {
			"LUIDUSERPICKER_FORMEREMPLOYEE":"Left on {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS":"No results",
			"LUIDUSERPICKER_ERR_GET_USERS":"Error while loading users",
			"LUIDUSERPICKER_OVERFLOW":"{{cnt}} displayed results of {{all}}",
			"LUIDUSERPICKER_PLACEHOLDER":"Type a last name or first name...",
			"LUIDUSERPICKER_DEPARTMENT":"Department",
			"LUIDUSERPICKER_LEGALENTITY":"Legal entity",
			"LUIDUSERPICKER_EMPLOYEENUMBER":"Employee number",
			"LUIDUSERPICKER_MAIL":"Email",
			"LUIDUSERPICKER_SELECTED":"Selected:",
			"LUIDUSERPICKER_ME":"Me:",
			"LUIDUSERPICKER_ALL":"All users",
		});
		$translateProvider.translations('de', {
			"LUIDUSERPICKER_FORMEREMPLOYEE":"Verließ die {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS":"Keine Ergebnisse",
			"LUIDUSERPICKER_ERR_GET_USERS":"Fehler",
			"LUIDUSERPICKER_OVERFLOW":"Es werden {{cnt}} auf {{all}} Benutzernamen",
			"LUIDUSERPICKER_PLACEHOLDER":"Geben Sie einen Benutzernamen...",
			"LUIDUSERPICKER_DEPARTMENT":"Abteilung",
			"LUIDUSERPICKER_LEGALENTITY":"Rechtsträger",
			"LUIDUSERPICKER_EMPLOYEENUMBER":"Betriebsnummer",
			"LUIDUSERPICKER_MAIL":"E-mail",
			"LUIDUSERPICKER_SELECTED":"Ausgewählt:",
			"LUIDUSERPICKER_ME":"Mir:",
			"LUIDUSERPICKER_ALL":"Alle Benutzer",
		});
		$translateProvider.translations('es', {

		});
		$translateProvider.translations('fr', {
			"LUIDUSERPICKER_FORMEREMPLOYEE":"Parti(e) le {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS":"Aucun résultat",
			"LUIDUSERPICKER_ERR_GET_USERS":"Erreur lors de la récupération des utilisateurs",
			"LUIDUSERPICKER_OVERFLOW":"{{cnt}} résultats affichés sur {{all}}",
			"LUIDUSERPICKER_PLACEHOLDER":"Saisissez un nom, prénom...",
			"LUIDUSERPICKER_DEPARTMENT":"Service",
			"LUIDUSERPICKER_LEGALENTITY":"Entité légale",
			"LUIDUSERPICKER_EMPLOYEENUMBER":"Matricule",
			"LUIDUSERPICKER_MAIL":"Email",
			"LUIDUSERPICKER_SELECTED":"Sélectionné :",
			"LUIDUSERPICKER_ME":"Moi :",
			"LUIDUSERPICKER_ALL":"Tous les utilisateurs",
		});
		$translateProvider.translations('it', {

		});
		$translateProvider.translations('nl', {

		});
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
})();;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment
	**/
	var formatMoment = function (_moment, _format) { //expects a moment
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
			var start = moment(_block.startsAt || _block.startsOn || _block.startDate || _block.start);
			var end = moment(_block.endsAt || _block.endsOn || _block.endDate || _block.end);
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
;var Lui;
(function (Lui) {
    "use strict";
    var Period = (function () {
        function Period() {
        }
        return Period;
    }());
    Lui.Period = Period;
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        var TableGrid;
        (function (TableGrid) {
            "use strict";
            var Tree = (function () {
                function Tree() {
                }
                return Tree;
            }());
            TableGrid.Tree = Tree;
            var Header = (function () {
                function Header() {
                }
                return Header;
            }());
            TableGrid.Header = Header;
            var BrowseResult = (function () {
                function BrowseResult() {
                }
                return BrowseResult;
            }());
            TableGrid.BrowseResult = BrowseResult;
        })(TableGrid = Directives.TableGrid || (Directives.TableGrid = {}));
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
        var FilterTypeEnum = (function () {
            function FilterTypeEnum() {
            }
            FilterTypeEnum.NONE = "none";
            FilterTypeEnum.TEXT = "text";
            FilterTypeEnum.SELECT = "select";
            FilterTypeEnum.MULTISELECT = "multiselect";
            return FilterTypeEnum;
        }());
        Directives.FilterTypeEnum = FilterTypeEnum;
        var LuidTableGridController = (function () {
            function LuidTableGridController($filter, $scope, $translate) {
                var maxDepth = 0;
                var browse = function (result) {
                    if (!result.tree.children.length) {
                        result.subChildren++;
                    }
                    ;
                    result.tree.children.forEach(function (child) {
                        var subResult = browse({ depth: result.depth + 1, tree: child, subChildren: 0, subDepth: 0 });
                        result.subChildren += subResult.subChildren;
                        result.subDepth = Math.max(result.subDepth, subResult.subDepth);
                    });
                    if (result.tree.children.length) {
                        result.subDepth++;
                    }
                    else {
                        $scope.colDefinitions.push(result.tree.node);
                    }
                    if (result.tree.node) {
                        result.tree.node.rowspan = maxDepth - result.depth - result.subDepth;
                        result.tree.node.colspan = result.subChildren;
                        if (!result.tree.children.length && result.tree.node.filterType === FilterTypeEnum.NONE) {
                            result.tree.node.rowspan++;
                        }
                        $scope.headerRows[result.depth] ? $scope.headerRows[result.depth].push(result.tree.node) : $scope.headerRows[result.depth] = [result.tree.node];
                    }
                    return result;
                };
                var getTreeDepth = function (tree) {
                    var depth = 0;
                    tree.children.forEach(function (child) {
                        depth = Math.max(depth, getTreeDepth(child));
                    });
                    return depth + 1;
                };
                var initFilter = function () {
                    $scope.filters = [];
                    _.each($scope.datas, function (row) {
                        _.each($scope.colDefinitions, function (header, index) {
                            if (!$scope.filters[index]) {
                                $scope.filters[index] = { header: header, selectValues: [], currentValues: [] };
                            }
                            if (header.filterType === FilterTypeEnum.SELECT
                                || header.filterType === FilterTypeEnum.MULTISELECT) {
                                var value = header.getValue(row);
                                if (!!header.getFilterValue) {
                                    value = header.getFilterValue(row);
                                }
                                var valuesToCheck = value.split("|");
                                _.each(valuesToCheck, function (val) {
                                    if (!_.contains($scope.filters[index].selectValues, val)) {
                                        $scope.filters[index].selectValues.push(val);
                                    }
                                });
                            }
                        });
                    });
                };
                var init = function () {
                    $scope.FilterTypeEnum = FilterTypeEnum;
                    $scope.headerRows = [];
                    $scope.bodyRows = [];
                    $scope.colDefinitions = [];
                    $scope.allChecked = { value: false };
                    maxDepth = getTreeDepth($scope.header);
                    browse({ depth: 0, subChildren: 0, subDepth: 0, tree: $scope.header });
                    $scope.selected = { orderBy: null, reverse: false };
                    initFilter();
                };
                $scope.updateFilteredAndOrderedRows = function () {
                    var temp = _.chain($scope.datas)
                        .filter(function (row) {
                        var result = true;
                        $scope.filters.forEach(function (filter) {
                            if (filter.header
                                && !!filter.currentValues[0]
                                && filter.currentValues[0] !== "") {
                                var prop_1 = (filter.header.getValue(row) + "").toLowerCase();
                                var containsProp = _.some(filter.currentValues, function (value) { return prop_1.indexOf(value.toLowerCase()) !== -1; });
                                if (!containsProp) {
                                    result = false;
                                }
                            }
                        });
                        return result;
                    });
                    if ($scope.selected && $scope.selected.orderBy) {
                        temp = temp.sortBy(function (row) {
                            var orderByValue = $scope.selected.orderBy.getValue(row);
                            if ($scope.selected.orderBy.getOrderByValue != null) {
                                orderByValue = $scope.selected.orderBy.getOrderByValue(row);
                            }
                            return orderByValue;
                        });
                    }
                    var filteredAndOrderedRows = temp.value();
                    $scope.filteredAndOrderedRows = $scope.selected.reverse ? filteredAndOrderedRows.reverse() : filteredAndOrderedRows;
                    $scope.updateVirtualScroll();
                };
                $scope.updateOrderBy = function (header) {
                    if (header === $scope.selected.orderBy) {
                        if ($scope.selected.reverse) {
                            $scope.selected.orderBy = null;
                            $scope.selected.reverse = false;
                        }
                        else {
                            $scope.selected.reverse = true;
                        }
                    }
                    else {
                        $scope.selected.orderBy = header;
                        $scope.selected.reverse = false;
                    }
                    $scope.updateFilteredAndOrderedRows();
                };
                $scope.onMasterCheckBoxChange = function () {
                    if (_.some($scope.filteredAndOrderedRows, function (row) { return !row.isChecked; })) {
                        _.each($scope.filteredAndOrderedRows, function (row) { row.isChecked = true; });
                    }
                    else {
                        _.each($scope.filteredAndOrderedRows, function (row) { row.isChecked = false; });
                    }
                };
                $scope.onCheckBoxChange = function () {
                    if (_.some($scope.filteredAndOrderedRows, function (row) { return !row.isChecked; })) {
                        $scope.allChecked.value = false;
                    }
                    else {
                        $scope.allChecked.value = true;
                    }
                };
                $scope.getCheckboxState = function () {
                    var selectedCheckboxesCount = _.where($scope.filteredAndOrderedRows, { isChecked: true }).length;
                    if (selectedCheckboxesCount === 0) {
                        return "";
                    }
                    if (selectedCheckboxesCount === $scope.filteredAndOrderedRows.length) {
                        return "checked";
                    }
                    if (selectedCheckboxesCount < $scope.filteredAndOrderedRows.length) {
                        return "partial";
                    }
                    return "";
                };
                $scope.clearSelect = function ($select, $index, $event) {
                    $event.stopPropagation();
                    $select.selected = undefined;
                    $scope.filters[$index].currentValues[0] = "";
                    $scope.updateFilteredAndOrderedRows();
                };
                init();
            }
            LuidTableGridController.IID = "luidTableGridController";
            LuidTableGridController.$inject = ["$filter", "$scope", "$translate"];
            return LuidTableGridController;
        }());
        Directives.LuidTableGridController = LuidTableGridController;
        angular.module("lui.directives")
            .controller(LuidTableGridController.IID, LuidTableGridController);
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
        var LuidTableGrid = (function () {
            function LuidTableGrid($timeout) {
                var _this = this;
                this.controller = "luidTableGridController";
                this.restrict = "AE";
                this.scope = { header: "=", height: "@", datas: "=*", selectable: "@" };
                this.templateUrl = "lui/templates/table-grid/table-grid.html";
                this.link = function (scope, element, attrs) {
                    _this.$timeout(function () {
                        var tablegrid = angular.element(element[0].querySelector(".lui.tablegrid"))[0];
                        var tables = tablegrid.querySelectorAll("table");
                        var headers = tablegrid.querySelectorAll("thead");
                        var bodies = tablegrid.querySelectorAll("tbody");
                        var lockedColumns = tablegrid.querySelector(".locked.columns");
                        var lockedColumnsSynced = lockedColumns ? lockedColumns.querySelector(".holder") : undefined;
                        var scrollableArea = tablegrid.querySelector(".scrollable.columns");
                        var scrollableAreaVS = scrollableArea.querySelector(".virtualscroll");
                        var getScrollbarThickness = function () {
                            var inner = document.createElement("p");
                            inner.style.width = "100%";
                            inner.style.height = "200px";
                            var outer = document.createElement("div");
                            outer.style.position = "absolute";
                            outer.style.top = "0px";
                            outer.style.left = "0px";
                            outer.style.visibility = "hidden";
                            outer.style.width = "200px";
                            outer.style.height = "150px";
                            outer.style.overflow = "hidden";
                            outer.appendChild(inner);
                            document.body.appendChild(outer);
                            var w1 = inner.offsetWidth;
                            outer.style.overflow = "scroll";
                            var w2 = inner.offsetWidth;
                            if (w1 === w2) {
                                w2 = outer.clientWidth;
                            }
                            document.body.removeChild(outer);
                            return (w1 - w2);
                        };
                        var getLockedColumnsWidth = function () {
                            if (!tables[0]) {
                                return 1;
                            }
                            var w = 0;
                            for (var _i = 0, _a = tables[0].querySelectorAll("tr:first-child td.locked"); _i < _a.length; _i++) {
                                var col = _a[_i];
                                w += col.offsetWidth;
                            }
                            return w + 1;
                        };
                        var scrollbarThickness = getScrollbarThickness();
                        var height = attrs.height ? attrs.height : LuidTableGrid.defaultHeight;
                        var rowHeight = 33;
                        var cellsPerPage = Math.round(height / rowHeight);
                        var numberOfCells = cellsPerPage * 3;
                        var resizeTimer;
                        var scrollTop = 0;
                        scope.visibleRows = [];
                        scope.canvasHeight = 0;
                        var resize = function () {
                            var tablegridWidth = 0;
                            tablegridWidth = (scrollableArea.clientHeight < scope.canvasHeight) ? tablegrid.clientWidth - scrollbarThickness : tablegrid.clientWidth;
                            for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
                                var header = headers_1[_i];
                                header.style.minWidth = tablegridWidth + "px";
                            }
                            for (var _a = 0, tables_1 = tables; _a < tables_1.length; _a++) {
                                var table = tables_1[_a];
                                table.style.minWidth = headers[0].offsetWidth + "px";
                            }
                            var lockedColumnsWidth = getLockedColumnsWidth();
                            if (lockedColumnsWidth !== 1) {
                                lockedColumnsSynced.style.height = (bodies[1].clientWidth > tablegridWidth) ? +height + headers[1].offsetHeight - scrollbarThickness + "px" : +height + headers[1].offsetHeight + "px";
                                lockedColumns.style.width = lockedColumnsWidth + "px";
                                scrollableArea.style.marginLeft = lockedColumnsWidth + "px";
                                scrollableAreaVS.style.marginLeft = -lockedColumnsWidth + "px";
                            }
                            else {
                                scrollableArea.style.marginLeft = 0 + "px";
                                scrollableAreaVS.style.marginLeft = 0 + "px";
                            }
                            scope.resizedHeaders();
                        };
                        scope.resizedHeaders = function () {
                            tablegrid.style.paddingTop = headers[0].offsetHeight + "px";
                        };
                        var vsOnScroll = function (event) {
                            scrollTop = scrollableArea.scrollTop;
                            scope.updateVirtualScroll();
                            scope.$apply();
                        };
                        scope.updateVirtualScroll = function () {
                            var firstCell = Math.max(Math.floor(scrollTop / rowHeight) - cellsPerPage, 0);
                            var cellsToCreate = Math.min(firstCell + numberOfCells, numberOfCells);
                            scope.visibleRows = scope.filteredAndOrderedRows.slice(firstCell, firstCell + cellsToCreate);
                            if (scope.fixedRowDefinition || scope.selectable) {
                                tables[1].style.marginTop = (headers[1].offsetHeight + firstCell * rowHeight) + "px";
                            }
                            tables[0].style.marginTop = (firstCell * rowHeight) + "px";
                            scope.canvasHeight = (scope.filteredAndOrderedRows.length - firstCell) * rowHeight;
                            resize();
                        };
                        scope.$watchCollection("datas", function () {
                            if (!!scope.datas) {
                                scope.filteredAndOrderedRows = scope.datas;
                                _this.$timeout(function () {
                                    scope.updateFilteredAndOrderedRows();
                                    resize();
                                }, 100);
                            }
                        });
                        window.addEventListener("resize", function () {
                            _this.$timeout.cancel(resizeTimer);
                            resizeTimer = _this.$timeout(function () { resize(); }, 100);
                        });
                        scrollableArea.addEventListener("scroll", function (event) {
                            if (scope.fixedRowDefinition || scope.selectable) {
                                lockedColumnsSynced.scrollTop = scrollableArea.scrollTop;
                            }
                            headers[0].style.left = -scrollableArea.scrollLeft + "px";
                            vsOnScroll(event);
                        });
                        var init = function () {
                            scope.filteredAndOrderedRows = scope.datas;
                            cellsPerPage = Math.round(height / rowHeight);
                            numberOfCells = cellsPerPage * 3;
                            _this.$timeout(function () { resize(); scope.updateVirtualScroll(); }, 100);
                        };
                        init();
                    }, 0);
                };
                this.$timeout = $timeout;
            }
            LuidTableGrid.Factory = function () {
                var directive = function ($timeout) { return new LuidTableGrid($timeout); };
                directive.$inject = ["$timeout"];
                return directive;
            };
            ;
            LuidTableGrid.defaultHeight = 20;
            LuidTableGrid.IID = "luidTableGrid";
            return LuidTableGrid;
        }());
        Directives.LuidTableGrid = LuidTableGrid;
        angular.module("lui.directives")
            .directive(LuidTableGrid.IID, LuidTableGrid.Factory());
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
angular.module("lui.translates.tablegrid").config(["$translateProvider", function ($translateProvider) {
        $translateProvider.translations("en", {
            "SELECT_ITEM": "Select an item",
            "SELECT_ITEMS": "Select items",
        });
        $translateProvider.translations("de", {});
        $translateProvider.translations("es", {});
        $translateProvider.translations("fr", {
            "SELECT_ITEM": "Séléctionnez un élément",
            "SELECT_ITEMS": "Séléctionnez des éléments",
        });
        $translateProvider.translations("it", {});
        $translateProvider.translations("nl", {});
    }]);
var Lui;
(function (Lui) {
    var Directives;
    (function (Directives) {
        "use strict";
    })(Directives = Lui.Directives || (Lui.Directives = {}));
})(Lui || (Lui = {}));
;angular.module('lui.directives').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('lui/templates/table-grid/table-grid.html',
    "<div class=\"lui tablegrid\"><div class=\"scrollable columns\" style=\"height: 500px\"><div class=virtualscroll ng-style=\"{'height': canvasHeight + 'px'}\" ng-include=\"'lui/templates/table-grid/table-grid.table.html'\"></div></div><div class=\"locked columns\" ng-if=\"fixedRowDefinition || selectable\"><div class=holder style=\"height: 500px\"><div class=virtualscroll ng-style=\"{'height': canvasHeight + 'px'}\" ng-include=\"'lui/templates/table-grid/table-grid.table.html'\"></div></div></div></div>"
  );


  $templateCache.put('lui/templates/table-grid/table-grid.table.html',
    "<table><thead><tr role=row ng-repeat=\"row in headerRows track by $index\" ng-if=\"$index !== 0\"><th ng-if=selectable style=\"width: 3.5em\" class=locked role=columnheader colspan=1 rowspan=1></th><th role=columnheader class=sortable ng-repeat=\"header in row track by $index\" ng-click=updateOrderBy(header) ng-class=\"{'locked': header.fixed, 'desc': (selected.orderBy === header && selected.reverse === false), 'asc': (selected.orderBy === header && selected.reverse === true)}\" ng-style=\"{'max-width': header.width + 'em', 'min-width': header.width + 'em'}\" rowspan=\"{{ header.rowspan }}\" colspan=\"{{ header.colspan }}\">{{ header.label }}</th></tr><tr role=row><th ng-if=selectable style=\"width: 3.5em\" class=locked role=columnheader colspan=1 rowspan=1><div class=\"lui solo checkbox\"><input ng-class=getCheckboxState() type=checkbox ng-model=allChecked.value ng-change=onMasterCheckBoxChange() ng-value=\"true\"><label>&nbsp;</label></div></th><th role=columnheader ng-repeat=\"header in colDefinitions track by $index\" ng-style=\"{'max-width': header.width + 'em', 'min-width': header.width + 'em'}\" ng-if=\"header.filterType != FilterTypeEnum.NONE\" colspan=1 rowspan=1 class=filtering><div class=\"lui fitting search input\" ng-if=\"header.filterType === FilterTypeEnum.TEXT\"><input ng-change=updateFilteredAndOrderedRows() ng-model=filters[$index].currentValues[0] ng-model-options=\"{ updateOn: 'default blur', debounce: { 'default': 500, 'blur': 0 } }\"></div><div class=\"lui fitting search input\" ng-if=\"header.filterType === FilterTypeEnum.MULTISELECT\"><ui-select multiple class=\"lui nguibs-ui-select\" ng-model=filters[$index].currentValues reset-search-input=false on-remove=updateFilteredAndOrderedRows() on-select=updateFilteredAndOrderedRows()><ui-select-match placeholder=\"{{ 'SELECT_ITEMS' | translate }}\">{{ $item }}</ui-select-match><ui-select-choices repeat=\"value in filters[$index].selectValues | filter: $select.search\">{{ value }}</ui-select-choices></ui-select></div><div class=\"lui fitting search input\" ng-if=\"header.filterType === FilterTypeEnum.SELECT\"><ui-select class=\"lui nguibs-ui-select\" ng-model=filters[$index].currentValues[0] reset-search-input=true on-select=updateFilteredAndOrderedRows()><ui-select-match allow-clear=true placeholder=\"{{ 'SELECT_ITEM' | translate }}\">{{ $select.selected }}</ui-select-match><ui-select-choices repeat=\"value in filters[$index].selectValues | filter: $select.search\">{{ value }}</ui-select-choices></ui-select></div></th></tr></thead><tbody><tr role=row ng-repeat=\"row in visibleRows\" ng-style=row.styles><td ng-if=selectable style=\"width: 3.5em\" class=locked colspan=1 rowspan=1><div class=\"lui solo checkbox\"><input type=checkbox ng-change=onCheckBoxChange() ng-model=\"row.isChecked\"><label>&nbsp;</label></div></td><td role=cell ng-repeat=\"cell in colDefinitions track by $index\" ng-style=\"{'max-width': cell.width + 'em', 'min-width': cell.width + 'em'}\" ng-bind-html=cell.getValue(row) ng-class=\"{'locked': cell.fixed, 'lui left aligned': cell.textAlign == 'left', 'lui right aligned': cell.textAlign == 'right', 'lui center aligned': cell.textAlign == 'center'}\"></td></tr></tbody></table>"
  );

}]);
