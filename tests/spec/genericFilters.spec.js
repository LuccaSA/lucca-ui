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
		it('should work with numeric values', function(){
			expect(luifNumber(10.5).$$unwrapTrustedValue()).toEqual("10<span>.50</span>");
			expect(luifNumber(10.5,3).$$unwrapTrustedValue()).toEqual("10<span>.500</span>");
			expect(luifNumber(10,1).$$unwrapTrustedValue()).toEqual("10<span style=\"opacity:0\">.0</span>");
			expect(luifNumber(undefined,undefined,undefined).$$unwrapTrustedValue()).toEqual("<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(undefined,undefined,0).$$unwrapTrustedValue()).toEqual("0<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(undefined,undefined,'nothing').$$unwrapTrustedValue()).toEqual("nothing<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(undefined,4,undefined).$$unwrapTrustedValue()).toEqual("<span style=\"opacity:0\">.0000</span>");
			expect(luifNumber(undefined,4,0).$$unwrapTrustedValue()).toEqual("0<span style=\"opacity:0\">.0000</span>");
			expect(luifNumber(undefined,4,'nothing').$$unwrapTrustedValue()).toEqual("nothing<span style=\"opacity:0\">.0000</span>");
		});
		it('should add a margin right to string values', function(){
			expect(luifNumber('a string').$$unwrapTrustedValue()).toEqual("a string<span style=\"opacity:0\">.00</span>");
			expect(luifNumber('a string',4).$$unwrapTrustedValue()).toEqual("a string<span style=\"opacity:0\">.0000</span>");
		});
		it('should work with precision = 0', function(){
			expect(luifNumber(12.4,0).$$unwrapTrustedValue()).toEqual("12<span style=\"opacity:0\"></span>");
			expect(luifNumber('a string',0).$$unwrapTrustedValue()).toEqual("a string<span style=\"opacity:0\"></span>");
		});
		it('should work with value = undefined', function(){
			expect(luifNumber(0/0).$$unwrapTrustedValue()).toEqual("<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(null).$$unwrapTrustedValue()).toEqual("<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(undefined).$$unwrapTrustedValue()).toEqual("<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(undefined,undefined,0).$$unwrapTrustedValue()).toEqual("0<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(undefined,undefined,'nothing').$$unwrapTrustedValue()).toEqual("nothing<span style=\"opacity:0\">.00</span>");
			expect(luifNumber(undefined,4).$$unwrapTrustedValue()).toEqual("<span style=\"opacity:0\">.0000</span>");
			expect(luifNumber(undefined,4,0).$$unwrapTrustedValue()).toEqual("0<span style=\"opacity:0\">.0000</span>");
			expect(luifNumber(undefined,4,'nothing').$$unwrapTrustedValue()).toEqual("nothing<span style=\"opacity:0\">.0000</span>");
		});
	});
});
