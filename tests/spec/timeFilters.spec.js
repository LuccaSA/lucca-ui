describe('luif time filters', function(){
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
				expect(luifHumanize(d, true, true)).toEqual(moment.duration(-d).humanize(true));
				expect(luifHumanize(d, false, true)).toEqual(moment.duration(-d).humanize(false));
			});
		});
	});
});