describe('luif.timefilters', function(){
	beforeEach(module('moment'));
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.filters'));

	var $filter, moment;
	beforeEach(inject(function (_$filter_, _moment_) {
		$filter = _$filter_;
		moment = _moment_;
	}));
	describe('luifFriendlyRange', function(){
		var luifFriendlyRange;
		beforeEach(function(){
			luifFriendlyRange = $filter('luifFriendlyRange');
		});
		it('should produce the right results', function(){
			var start = moment('2014-01-01'); // took 2014 because it's not this year
			var end;

			// same day
			end = moment(start);
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('dddd, LL'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('le ' + start.format('dddd LL'));
			
			// day after - test that _excludeEnd works
			end = moment(start).add(1,'d');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('Do\, YYYY'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual(start.format('dddd, LL'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do') + ' au ' + end.format('LL'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual('le ' + start.format('dddd LL'));
			
			// same month
			end = moment(start).add(10,'d');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('Do\, YYYY'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual(start.format('MMMM Do') + ' - ' + moment(end).add(-1, 'd').format('Do\, YYYY'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do') + ' au ' + end.format('LL'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual('du ' + start.format('Do') + ' au ' +  moment(end).add(-1, 'd').format('LL'));
			
			// same year
			end = moment(start).add(3,'months');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('LL'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do MMMM') + ' au ' + end.format('LL'));
			
			// other
			end = moment(start).add(14,'months');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('LL') + ' - ' + end.format('LL'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('LL') + ' au ' + end.format('LL'));
		});
		it('should not display the year when both dates are in the current year', function(){

			var start = moment().startOf('year'); // took 2014 because it's not this year
			var end;

			// same day
			end = moment(start);
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('dddd, MMMM Do'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('le ' + start.format('dddd Do MMMM'));
			
			// day after - test that _excludeEnd works
			end = moment(start).add(1,'d');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('Do'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual(start.format('dddd, MMMM Do'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do') + ' au ' + end.format('Do MMMM'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual('le ' + start.format('dddd Do MMMM'));
			
			// same month
			end = moment(start).add(10,'d');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('Do'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do') + ' au ' + end.format('Do MMMM'));
			
			// same year
			end = moment(start).add(3,'months');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('MMMM Do'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do MMMM') + ' au ' + end.format('Do MMMM'));
			
			// other
			end = moment(start).add(14,'months');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('LL') + ' - ' + end.format('LL'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('LL') + ' au ' + end.format('LL'));
		});
	});
	describe('luifMoment', function(){
		var luifMoment;
		beforeEach(function(){
			luifMoment = $filter('luifMoment');
		});
		it('should produce the same result as moment.format()', function(){
			var formats = ['LLL', 'lll', 'YYYY', 'MMM', 'MM', 'DD', 'D', 'Do', 'dd'];
			angular.forEach(formats, function(format){
				expect(luifMoment(moment(),format)).toEqual(moment().format(format));
			});
		});
	});
	describe('luifCalendar', function(){
		var luifCalendar;
		beforeEach(function(){
			luifCalendar = $filter('luifCalendar');
		});
		it('should produce the same result as moment.calendar()', function(){
			expect(luifCalendar(moment())).toEqual(moment().calendar());
			var yesterday = moment().add(1,'d');
			expect(luifCalendar(moment(),yesterday)).toEqual(moment().calendar(yesterday));
			expect(luifCalendar(yesterday,moment())).toEqual(yesterday.calendar());
		});
	});
	describe('luifDuration', function(){
		var luifDuration;
		beforeEach(function(){
			luifDuration = $filter('luifDuration');
		});
		it('should produce the right results when no format is provided', function(){
			// default formatting is unit:hour, precision:minute
			expect(luifDuration(0)).toEqual('');
			expect(luifDuration(1000)).toEqual('');
			expect(luifDuration(60000)).toEqual('1m');
			expect(luifDuration(360000)).toEqual('6m');
			expect(luifDuration(-360000)).toEqual('6m');
			expect(luifDuration(3600000)).toEqual('1h');
			expect(luifDuration(3960000)).toEqual('1h06');
			expect(luifDuration(36000000)).toEqual('10h');
			expect(luifDuration(172800000)).toEqual('48h');
			expect(luifDuration(360000000)).toEqual('100h');
			expect(luifDuration(360000005)).toEqual('100h');
			expect(luifDuration(360001005)).toEqual('100h');
			expect(luifDuration(360100005)).toEqual('100h01');
			expect(luifDuration(360100005, true)).toEqual('+100h01');
			expect(luifDuration(-360100005, true)).toEqual('-100h01');
		});
		it('should be resistant to edge cases', function(){
			// default formatting is unit:hour, precision:minute
			expect(luifDuration(undefined)).toEqual('');
			expect(luifDuration(undefined, true)).toEqual('');
			expect(luifDuration(undefined, true, 'd','ms')).toEqual('');

			expect(luifDuration('not parsable as duration')).toEqual('');
			expect(luifDuration('not parsable as duration', true)).toEqual('');
			expect(luifDuration('not parsable as duration', true, 'd','ms')).toEqual('');

		});
		it('should produce the right results when a unit is provided', function(){
			moment.locale('en');
			expect(luifDuration(360000, false, 'd')).toEqual(''); // x < 1h 
			expect(luifDuration(36000000, false, 'd')).toEqual('10h'); // 1h <= x < 1d
			expect(luifDuration(360000000, false, 'd')).toEqual('4d 4h'); // 1d <= x
			expect(luifDuration(360000000, false, 'day')).toEqual('4d 4h'); 
			expect(luifDuration(360000000, false, 'days')).toEqual('4d 4h'); 

			expect(luifDuration(59000, false, 'h')).toEqual(''); // x < 1m
			expect(luifDuration(61000, false, 'h')).toEqual('1m'); // 1m <= x < 1h
			expect(luifDuration(3600001, false, 'h')).toEqual('1h'); // 1h <= x
			expect(luifDuration(3660001, false, 'h')).toEqual('1h01');
			expect(luifDuration(3660001, false, 'hour')).toEqual('1h01');
			expect(luifDuration(3660001, false, 'hours')).toEqual('1h01');

			expect(luifDuration(999, false, 'm')).toEqual(''); // x < 1s
			expect(luifDuration(1001, false, 'm')).toEqual('1s'); // 1s <= x < 1m
			expect(luifDuration(60001, false, 'm')).toEqual('1m'); // 1d <= x
			expect(luifDuration(61001, false, 'm')).toEqual('1m01'); 
			expect(luifDuration(61001, false, 'min')).toEqual('1m01'); 
			expect(luifDuration(61001, false, 'mins')).toEqual('1m01'); 
			expect(luifDuration(61001, false, 'minute')).toEqual('1m01'); 
			expect(luifDuration(61001, false, 'minutes')).toEqual('1m01'); 
			expect(luifDuration(3600000, false, 'minutes')).toEqual('60m'); 

			expect(luifDuration(0, false, 's')).toEqual(''); 
			expect(luifDuration(999, false, 's')).toEqual(''); 
			expect(luifDuration(1001, false, 's')).toEqual('1s'); 
			expect(luifDuration(1001, false, 'sec')).toEqual('1s'); 
			expect(luifDuration(1001, false, 'second')).toEqual('1s'); 
			expect(luifDuration(1001, false, 'seconds')).toEqual('1s'); 
			expect(luifDuration(60000, false, 'seconds')).toEqual('60s'); 

			expect(luifDuration(0, false, 'ms')).toEqual(''); 
			expect(luifDuration(10, false, 'ms')).toEqual('10ms'); 
			expect(luifDuration(10, false, 'millisec')).toEqual('10ms'); 
			expect(luifDuration(10, false, 'millisecond')).toEqual('10ms'); 
			expect(luifDuration(10, false, 'milliseconds')).toEqual('10ms'); 
			expect(luifDuration(1000, false, 'milliseconds')).toEqual('1000ms'); 
		});
		it('should produce the right results when a unit and a precision are provided', function(){
			moment.locale('en');
			expect(luifDuration(86400000, false, 'd', 'd')).toEqual('1d '); 
			expect(luifDuration(86400010, false, 'd', 'd')).toEqual('1d '); 
			expect(luifDuration(90061001, false, 'd', 'd')).toEqual('1.04d '); 
			expect(luifDuration(90061001, false, 'd', 'h')).toEqual('1d 1h'); 
			expect(luifDuration(90061001, false, 'd', 'm')).toEqual('1d 1h01'); 
			expect(luifDuration(90061001, false, 'd', 's')).toEqual('1d 1h01m01s'); 
			expect(luifDuration(90061001, false, 'd', 'ms')).toEqual('1d 1h01m01.001s'); 

			expect(luifDuration(86400000, false, 'd', 'd')).toEqual('1d ');
			expect(luifDuration(3600000, false, 'd', 'd')).toEqual('0.04d ');
			expect(luifDuration(21600000, false, 'd', 'd')).toEqual('0.25d ');
			expect(luifDuration(36000000, false, 'd', 'd')).toEqual('0.42d ');
			expect(luifDuration(129600000, false, 'd', 'd')).toEqual('1.5d ');
			expect(luifDuration(259200000, false, 'd', 'd')).toEqual('3d ');

			expect(luifDuration(90061001, false, 'h', 'd')).toEqual(''); 
			expect(luifDuration(90061001, false, 'h', 'h')).toEqual('25h'); 
			expect(luifDuration(90061001, false, 'h', 'm')).toEqual('25h01'); 
			expect(luifDuration(90061001, false, 'h', 's')).toEqual('25h01m01s'); 
			expect(luifDuration(90061001, false, 'h', 'ms')).toEqual('25h01m01.001s'); 

			expect(luifDuration(90061001, false, 'm', 'd')).toEqual(''); 
			expect(luifDuration(90061001, false, 'm', 'h')).toEqual(''); 
			expect(luifDuration(90061001, false, 'm', 'm')).toEqual('1501m'); 
			expect(luifDuration(90061001, false, 'm', 's')).toEqual('1501m01'); 
			expect(luifDuration(90061001, false, 'm', 'ms')).toEqual('1501m01.001s'); 

			expect(luifDuration(90061001, false, 's', 'd')).toEqual(''); 
			expect(luifDuration(90061001, false, 's', 'h')).toEqual(''); 
			expect(luifDuration(90061001, false, 's', 'm')).toEqual(''); 
			expect(luifDuration(90061001, false, 's', 's')).toEqual('90061s'); 
			expect(luifDuration(90061001, false, 's', 'ms')).toEqual('90061.001s'); 

			expect(luifDuration(90061001, false, 'ms', 'd')).toEqual(''); 
			expect(luifDuration(90061001, false, 'ms', 'h')).toEqual(''); 
			expect(luifDuration(90061001, false, 'ms', 'm')).toEqual(''); 
			expect(luifDuration(90061001, false, 'ms', 's')).toEqual(''); 
			expect(luifDuration(90061001, false, 'ms', 'ms')).toEqual('90061001ms'); 
		});
	});
	describe('luifHumanize', function(){
		var luifHumanize;
		beforeEach(function(){
			luifHumanize = $filter('luifHumanize');
		});
		it('should produce the same result as moment.duration(N).humanize(ago)', function(){
			var durations = [0,1000,60000,3600000];
			angular.forEach(durations, function(d){
				expect(luifHumanize(d)).toEqual(moment.duration(d).humanize());
				expect(luifHumanize(d, true)).toEqual(moment.duration(d).humanize(true));
				expect(luifHumanize(d, false)).toEqual(moment.duration(d).humanize(false));
				expect(luifHumanize(-d, true)).toEqual(moment.duration(-d).humanize(true));
				expect(luifHumanize(-d, false)).toEqual(moment.duration(-d).humanize(false));
			});
		});
	});
});