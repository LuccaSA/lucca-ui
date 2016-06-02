module Lui.Utils {
	"use strict";
	export class MomentFormatter {
		private format: string;
		constructor(format?: string) {
			this.format = format || "moment";
		}
		// parse - format
		public parseValue(value: any): moment.Moment {
			switch (this.format) {
				case "moment": return this.parseMoment(value);
				case "date": return this.parseDate(value);
				default: return this.parseString(value);
			}
		}
		public formatValue(value: moment.Moment): any {
			switch (this.format) {
				case "moment": return this.formatMoment(value);
				case "date": return this.formatDate(value);
				default: return this.formatString(value);
			}
		}
		private parseMoment(value: moment.Moment): moment.Moment {
			return !!value ? moment(value) : undefined;
		}
		private parseDate(value: Date): moment.Moment {
			return !!value ? moment(value) : undefined;
		}
		private parseString(value: string): moment.Moment {
			return !!value && moment(value, this.format).isValid() ? moment(value, this.format) : undefined;
		}
		private formatMoment(value: moment.Moment): moment.Moment {
			return moment(value);
		}
		private formatDate(value: moment.Moment): Date {
			return value.toDate();
		}
		private formatString(value: moment.Moment): string {
			return value.format(this.format);
		}
	}
}
