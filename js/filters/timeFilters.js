(function () {
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
