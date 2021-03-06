module lui {
	"use strict";
	export interface IFilterService extends ng.IFilterService {
		(name: "luifDuration"): (input: any, showSign?: boolean, unit?: string, precision?: string) => string;
		(name: "luifPlaceholder"): (input: any, placeholder: string) => string;
		(name: "luifFriendlyRange"): (input: IPeriod, excludeEnd?: boolean, trads?: Object) => string;
		(name: "luifDefaultCode"): (input: string) => string;
		(name: "luifStripAccents"): (input: string) => string;
	}

	export interface IPeriod {
		start?: moment.Moment | string | Date;
		startsOn?: moment.Moment | string | Date;
		startsAt?: moment.Moment | string | Date;
		end?: moment.Moment | string | Date;
		endsOn?: moment.Moment | string | Date;
		endsAt?: moment.Moment | string | Date;
	}
	export class Period implements IPeriod {
		public start: moment.Moment;
		public end: moment.Moment;
		constructor(unformatted: IPeriod, formatter?: IFormatter<moment.Moment>) {
			let start = unformatted.start || unformatted.startsOn || unformatted.startsAt;
			let end = unformatted.end || unformatted.endsOn || unformatted.endsAt;
			this.start = formatter.parseValue(start);
			this.end = formatter.parseValue(end);
		}
	}
}
