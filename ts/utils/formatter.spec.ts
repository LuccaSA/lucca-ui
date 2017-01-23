module lui.formatter.test {
	"use strict";
	describe("moment formatter", () => {
		let formatter: MomentFormatter;
		it("moment <-> moment", () => {
			formatter = new MomentFormatter("moment");
			let input = moment("2016-05-24");
			let output = moment("2016-05-24");
			expect(formatter.parseValue(input)).toEqual(output);
			expect(formatter.formatValue(output)).toEqual(input);
		});
		it("date <-> moment", () => {
			formatter = new MomentFormatter("date");
			let input =  new Date(2016, 4, 24);
			let output = moment("2016-05-24");
			expect(formatter.parseValue(input).diff(output)).toEqual(0);
			expect(input.getTime() - (<Date>formatter.formatValue(output)).getTime()).toEqual(0)
		});
		it("string <-> moment", () => {
			formatter = new MomentFormatter("YYYY-MM-DD");
			let input = "2016-05-24";
			let output = moment("2016-05-24");
			expect(formatter.parseValue(input).diff(output)).toEqual(0);
			expect(formatter.formatValue(output)).toEqual(input);
			formatter = new MomentFormatter("YYYYMMDD");
			input = "20160524";
			expect(formatter.parseValue(input).diff(output)).toEqual(0);
			expect(formatter.formatValue(output)).toEqual(input);
		});
		it("should use moment as default format", () => {
			formatter = new MomentFormatter();
			let input = moment("2016-05-24");
			let output = moment("2016-05-24");
			expect(formatter.parseValue(input)).toEqual(output);
			expect(formatter.formatValue(output)).toEqual(input);
		});
	});
}
