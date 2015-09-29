describe('luif.timefilters', function(){
	beforeEach(module('ngMock'));
	beforeEach(module('lui'));
	beforeEach(module('lui.filters'));

	var $filter;
	beforeEach(inject(function (_$filter_) {
		$filter = _$filter_;
	}));
	describe('luifPlaceholder', function(){
		var luifPlaceholder;
		var placeholder = 'placeholder';
		beforeEach(function(){
			luifPlaceholder = $filter('luifPlaceholder');
		});
		it('should work', function(){
			var placeholder = 'placeholder';
			var value = '';
			expect(luifPlaceholder(value,placeholder)).toEqual(placeholder);
			value = 'not something empty';
			expect(luifPlaceholder(value,placeholder)).toEqual(value);
		});
	});
	describe('luifDefaultCode', function(){
		var luifDefaultCode;
		beforeEach(function(){
			luifDefaultCode = $filter('luifDefaultCode');
		});
		it('should work', function(){
			expect(luifDefaultCode()).toEqual('');
			expect(luifDefaultCode('Aa12')).toEqual('AA12');
			expect(luifDefaultCode('Aa Bb Cc')).toEqual('AA_BB_CC');
		});
	});
	describe('luifStartFrom', function(){
		var luifStartFrom;
		beforeEach(function(){
			luifStartFrom = $filter('luifStartFrom');
		});
		it('should work', function(){
			expect(luifStartFrom('abc')).toEqual('abc');
			expect(luifStartFrom('abc',1)).toEqual('bc');
		});
	});
	describe('luifNumber', function(){
		var luifNumber;
		beforeEach(function(){
			luifNumber = $filter('luifNumber');
		});
		it('should work', function(){
			expect(luifNumber(10.5).$$unwrapTrustedValue()).toEqual($filter("number")(10.5,2));
			expect(luifNumber(10.5,3).$$unwrapTrustedValue()).toEqual($filter("number")(10.5,3));
			expect(luifNumber(10,1).$$unwrapTrustedValue()).toEqual("10<span style=\"opacity:0\">.0</span>");
		});
	});
});