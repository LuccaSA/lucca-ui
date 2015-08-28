(function () {
	'use strict';

	var formatMoment = function (_moment, _format) { //expects a moment
		var m = moment(_moment);
		if (m.isValid()) {
			return m.format(_format);
		} else {
			return _moment;
		}
	};
	function replaceAll(string, find, replace) {
		// http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
		// lets not reinvent the wheel
		function escapeRegExp(string) {
			return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
		}
		return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}

	angular.module('lui.filters')
	.filter('luifFriendlyRange', function () {
		var traductions = {
			'en': {
				sameDay: 'start(LL)',
				sameMonth: 'start(MMMM D) - end(D\, YYYY)',
				sameYear: 'start(MMMM D) - end(LL)',
				other: 'start(LL) - end(LL)'
			},
			'fr': {
				sameDay: 'le start(LL)',
				sameMonth: 'du start(Do) au end(LL)',
				sameYear: 'du start(Do MMMM) au end(LL)',
				other: 'du start(LL) au end(LL)'
			}
		};
		return function (_block, _excludeEnd) {
			var trads = traductions[moment.locale()] || traductions.en;
			var start = moment(_block.startsAt || _block.startsOn || _block.startDate || _block.start);
			var end = moment(_block.endsAt || _block.endsOn || _block.endDate || _block.end);
			if(_excludeEnd){
				end.add(-1,'d');
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
			var hours = d.hours() + d.days() * 24; // does not support durations over 30 days yet
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
		return function (_duration, suffix, pastEvent) {
			suffix = !!suffix;
			pastEvent = !!pastEvent;
			var d = moment.duration(_duration);
			if (pastEvent) { d = moment.duration(-d.asMilliseconds()); }
			return d.humanize(suffix);
		};
	})
})();
