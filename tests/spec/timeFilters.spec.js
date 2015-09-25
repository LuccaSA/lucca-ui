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
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('LL'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('le ' + start.format('LL'));
			
			// day after - test that _excludeEnd works
			end = moment(start).add(1,'d');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('Do\, YYYY'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual(start.format('LL'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do') + ' au ' + end.format('LL'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual('le ' + start.format('LL'));
			
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
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('le ' + start.format('Do MMMM'));
			
			// day after - test that _excludeEnd works
			end = moment(start).add(1,'d');
			moment.locale('en');
			expect(luifFriendlyRange({start:start, end:end})).toEqual(start.format('MMMM Do') + ' - ' + end.format('Do'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual(start.format('MMMM Do'));
			moment.locale('fr');
			expect(luifFriendlyRange({start:start, end:end})).toEqual('du ' + start.format('Do') + ' au ' + end.format('Do MMMM'));
			expect(luifFriendlyRange({start:start, end:end}, true)).toEqual('le ' + start.format('Do MMMM'));
			
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
			expect(luifDuration(0)).toEqual('');
			expect(luifDuration(1000)).toEqual('');
			expect(luifDuration(60000)).toEqual('1m');
			expect(luifDuration(360000)).toEqual('6m');
			expect(luifDuration(3600000)).toEqual('1h');
			expect(luifDuration(3960000)).toEqual('1h06');
			expect(luifDuration(36000000)).toEqual('10h');
			expect(luifDuration(360000000)).toEqual('100h');
			expect(luifDuration(-36000000, '', true)).toEqual('-10h');
			expect(luifDuration(-37200000, '', true)).toEqual('-10h20');
			expect(luifDuration(360000000, '', true)).toEqual('+100h');
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