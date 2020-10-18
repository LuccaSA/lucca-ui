(function () {
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

	angular.module('lui')
	.filter('luifFriendlyRange', function () {
		var translations = {
			'en': {
				startOnly: 'date(dddd, LL) onwards',
				startOnlyThisYear: 'date(dddd, MMMM Do) onwards',
				endOnly: 'until date(dddd, LL)',
				endOnlyThisYear: 'until date(dddd, MMMM Do)',
				date: 'date(LL)',
				sameDay: 'start(dddd, LL)',
				sameDayThisYear: 'start(dddd, MMMM Do)',
				sameMonth: 'start(MMMM Do) - end(Do\, YYYY)',
				sameMonthThisYear: 'start(MMMM Do) - end(Do)',
				sameYear: 'start(MMMM Do) - end(LL)',
				sameYearThisYear: 'start(MMMM Do) - end(MMMM Do)',
				other: 'start(LL) - end(LL)'
			},
			'fr': {
				startOnly: 'à partir du date(dddd LL)',
				startOnlyThisYear: 'à partir du date(dddd Do MMMM)',
				endOnly: 'jusqu\'au date(dddd LL)',
				endOnlyThisYear: 'jusqu\'au date(dddd Do MMMM)',
				date: 'date(LL)',
				sameDay: 'le start(dddd LL)',
				sameDayThisYear: 'le start(dddd Do MMMM)',
				sameMonth: 'du start(Do) au end(LL)',
				sameMonthThisYear: 'du start(Do) au end(Do MMMM)',
				sameYear: 'du start(Do MMMM) au end(LL)',
				sameYearThisYear: 'du start(Do MMMM) au end(Do MMMM)',
				other: 'du start(LL) au end(LL)'
			},
			'de': {

				startOnly: 'von date(Do MMMM)',
				startOnlyThisYear: 'von date(LL)',
				endOnly: 'bis date(Do MMMM)',
				endOnlyThisYear: 'bis date(LL)',
				date: 'date(LL)',
				sameDay: 'der start(dddd LL)',
				sameDayThisYear: 'der start(dddd Do MMMM)',
				sameMonth: 'von start(Do) bis end(LL)',
				sameMonthThisYear: 'von start(Do) bis end(Do MMMM)',
				sameYear: 'von start(Do MMMM) bis end(LL)',
				sameYearThisYear: 'von start(Do MMMM) bis end(Do MMMM)',
				other: 'von start(LL) bis end(LL)'
			},
			'es': {
				startOnly: 'del date(dddd LL)',
				startOnlyThisYear: 'del date(dddd LL)',
				endOnly: 'al date(dddd LL)',
				endOnlyThisYear: 'al date(dddd LL)',
				date: 'date(LL)',
				sameDay: 'el start(dddd LL)',
				sameDayThisYear: 'el start(dddd LL)',
				sameMonth: 'del start(D) al end(LL)',
				sameMonthThisYear: 'del start(D) al end(LL)',
				sameYear: 'del start(LL) al end(LL)',
				sameYearThisYear: 'del start(LL) al end(LL)',
				other: 'del start(LL) al end(LL)'
			}	
		};
		function getTrad(trads, locale, key, fallbackKey) {
			if (!!trads && !!trads[locale] && !!trads[locale][key]) {
				return trads[locale][key];
			}
			if (!!trads && !!trads[locale] && !!trads[locale][fallbackKey]) {
				return trads[locale][fallbackKey];
			}
			// fallback on english in provided translations
			var fallbackLocale = "en";
			if (!!trads && !!trads[fallbackLocale] && !!trads[fallbackLocale][key]) {
				return trads[fallbackLocale][key];
			}
			if (!!trads && !!trads[fallbackLocale] && !!trads[fallbackLocale][fallbackKey]) {
				return trads[fallbackLocale][fallbackKey];
			}

			// fallback on standard translations if I couldnt find what I need in provided trads
			var fallbackTrads = translations;
			if (!!fallbackTrads && !!fallbackTrads[locale] && !!fallbackTrads[locale][key]) {
				return fallbackTrads[locale][key];
			}
			if (!!fallbackTrads && !!fallbackTrads[locale] && !!fallbackTrads[locale][fallbackKey]) {
				return fallbackTrads[locale][fallbackKey];
			}
			// fallback on english in provided translations
			if (!!fallbackTrads && !!fallbackTrads[fallbackLocale] && !!fallbackTrads[fallbackLocale][key]) {
				return fallbackTrads[fallbackLocale][key];
			}
			if (!!fallbackTrads && !!fallbackTrads[fallbackLocale] && !!fallbackTrads[fallbackLocale][fallbackKey]) {
				return fallbackTrads[fallbackLocale][fallbackKey];
			}
		}
		return function (_block, _excludeEnd, _translations) {
			if(!_block){ return; }
			var start = _block.start || _block.startsAt || _block.startsOn || _block.startDate;
			var end = _block.end || _block.endsAt || _block.endsOn || _block.endDate;
			if (!start && !end) {
				return "";
			}
			start = !!start ? moment(start) : undefined;
			end = !!end ? moment(end) : undefined;
			if(_excludeEnd){
				end.add(-1,'minutes');
			}
			var trad;
			var format;
			var regex;
			if (!!start && !!end) {
				format = start.year() === end.year() ? start.month() === end.month() ? start.date() === end.date() ? 'sameDay' : 'sameMonth' : 'sameYear' : 'other';
				if(moment().year() === start.year() && moment().year() === end.year()){
					format += "ThisYear";
				}
				trad = getTrad(_translations, moment.locale(), format, "other");
				regex = /(start\((.*?)\))(.*(end\((.*?)\))){0,1}/gi.exec(trad);
				return trad.replace(regex[1], start.format(regex[2])).replace(regex[4], end.format(regex[5]));
			}
			format = !!start ? "startOnly" : "endOnly";
			var date = start || end;
			if(moment().year() === date.year()){
				format += "ThisYear";
			}
			trad = getTrad(_translations, moment.locale(), format, "date");
			regex = /(date\((.*?)\))/gi.exec(trad);
			return trad.replace(regex[1], date.format(regex[2]));
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

			if (config.index === 0 && getConfigIndex(_precision) === 0 && d.asDays() !== 0){
				var myDays = Math.abs(d.asDays());
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
