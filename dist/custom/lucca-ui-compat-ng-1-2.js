(function(){
	'use strict';
	angular.module('moment', []).factory('moment', function () { return window.moment; });
	angular.module('underscore', []).factory('_', function () { return window._; });
	
	angular.module('lui.directives', ['moment', 'underscore']);
	angular.module('lui.filters', ['moment']);
	angular.module('lui.services', []);
	// all the templates in one module
	angular.module('lui.templates.momentpicker', []); // module defined here and used in a different file so every page doesnt have to reference moment-picker.js
	angular.module('lui.templates', ['lui.templates.momentpicker']);

	angular.module('lui', ['lui.directives','lui.services','lui.filters','lui.templates']);
})();
;(function () {
	'use strict';

	angular.module('lui.directives').directive('luidPercentage', ['moment', function (moment) {
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
	}])
	.controller('luidPercentageController', ['$scope', 'moment', function ($scope, moment) {

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

			// call the ng-change
			ngModelCtrl.$viewChangeListeners.push(function () {
				scope.$eval(attrs.ngChange);
			});

			// bind to various events - here only keypress=enter
			luidTimespanCtrl.setupEvents(element.find('input'));
		}


		return {
			require: ['luidTimespan', '^ngModel'],
			controller: 'luidTimespanController',
			scope: {
				step: '=', // default = 5
				unit: '=', // 'hours', 'hour', 'h' or 'm', default='m'
				ngDisabled: '=',
				placeholder: '@'
			},
			restrict: 'EA',
			link: link,
			template: "<input type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-pattern='pattern' ng-model='strDuration' ng-change='updateValue()' ng-blur='formatInputValue()'>"
		};
	}])
	.controller('luidTimespanController', ['$scope', 'moment', function ($scope, moment) {

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

			// transform this duration into a string
			newValue = format(newDuration);

			// update viewvalue
			updateWithoutRender(newValue);
		};
		var format = function (dur) {
			return (dur.days() > 0 ? Math.floor(dur.asDays()) + '.' : '') + (dur.hours() < 10 ? '0' : '') + dur.hours() + ':' + (dur.minutes() < 10 ? '0' : '') + dur.minutes() + ':00';
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
			return Math.floor(duration.asDays()) + '.' + (duration.hours() < 10 ? '0' : '') + duration.hours() + ':' + (duration.minutes() < 10 ? '0' : '') + duration.minutes() + ':00';
		};

		// private - updates of some kinds
		// incr value by `step` minutes
		var incr = function (step) {
			var newDur = moment.duration(currentValue()).add(step, 'minutes');
			if (newDur.asMilliseconds() < 0) {
				newDur = moment.duration();
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
	}]);
})();
;(function(){
	'use strict';
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
		return function(_input, _precision) {
			var separator = $filter("number")(1.1,1)[1];
			var precision = _precision || 2;

			var text = $filter("number")(_input, precision);

			var details = text.split(separator);
			if ( parseInt(details[1]) === 0) {
				return $sce.trustAsHtml(details[0] + "<span style=\"opacity:0\">" + separator + details[1] + "</span>");
			}
			return $sce.trustAsHtml(details[0] + separator + details[1]);
		};
	}]);
})();;(function () {
	'use strict';

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
	.filter('luifDuration', function () {
		return function (_duration, _format, _sign) {  //expects a duration, returns the duration in the given format or a sensible one
			var d = moment.duration(_duration);
			var hours = Math.floor(d.asHours()); 
			if(hours < 0){ // we dont want to approxximate -0.33h as -1h20
				hours = Math.ceil(d.asHours());
			}
			var minutes = d.minutes();
			var prefix = '';
			if (_sign) {
				if (d.asMilliseconds() > 0) {
					prefix = '+';
				} else if (d.asMilliseconds() < 0) {
					prefix = '-';
				}
			}
			if (!_format) { // if no format is provided, it will try to display "30min" or "3h" or "3h30"
				if (hours && minutes) {
					return prefix + Math.abs(hours) + 'h' + formatMoment(moment(minutes, 'm'), 'mm');
				} else if (minutes) {
					return prefix + Math.abs(minutes) + 'm';
				} else if (hours) {
					return prefix + Math.abs(hours) + 'h';
				} else { return ''; } // 00:00 -> should not be displayed
			}
			return prefix + formatMoment(moment(hours + ':' + minutes + ':00', 'H:mm:ss'), _format);
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
