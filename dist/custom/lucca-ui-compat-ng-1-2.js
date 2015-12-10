(function(){
	'use strict';
	angular.module('moment', []).factory('moment', function () { return window.moment; });
	angular.module('underscore', []).factory('_', function () { return window._; });
	
	angular.module('lui.directives', ['moment', 'underscore', 'ui.select', 'ui.bootstrap']);
	angular.module('lui.filters', ['moment']);
	angular.module('lui.services', []);

	// all the templates in one module
	angular.module('lui.templates.momentpicker', []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module("lui.templates.daterangepicker", []); // module defined here and used in a different file so every page doesnt have to reference the right .js file
	angular.module('lui.templates', ['lui.templates.momentpicker', "lui.templates.daterangepicker"]);
	
	// all the translations in one module
	angular.module('lui.translates.userpicker', []);
	angular.module('lui.translates.daterangepicker', []);
	angular.module('lui.translates', ['pascalprecht.translate','lui.translates.userpicker','lui.translates.daterangepicker']);
	
	angular.module('lui', ['lui.directives','lui.services','lui.filters','lui.templates','lui.translates']);
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
	.filter('luifDuration', function () {
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

					// the first unit with a not nul member, if you want 15 minutes expressed in days it will respond 15m
					unit = values[0] !== 0 ? 0 : values[1] !== 0 ? 1 : values[2] !== 0 ? 2 : values[3] !== 0 ? 3 : 4;
					values[0] = Math.abs(d.asDays() >= 0 ? Math.floor(d.asDays()) : Math.ceil(d.asDays()));
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
	})
	.filter('luifHumanize', function () {
		return function (_duration, suffix) {
			suffix = !!suffix;
			var d = moment.duration(_duration);
			return d.humanize(suffix);
		};
	});
})();
