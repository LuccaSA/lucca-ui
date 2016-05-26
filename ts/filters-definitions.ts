module Lui {
	"use strict";
	export interface ILuiFilters extends ng.IFilterService {
		(name: "luifDuration"): (input: any, showSign?: boolean, unit?: string, precision?: string) => string;
		(name: "luifPlaceholder"): (input: any, placeholder: string) => string;
		(name: "luifFriendlyRange"): (input: Period, excludeEnd: boolean) => string;
		(name: "luifDefaultCode"): (input: string) => string;
	}

	export class Period {
		public start: moment.Moment | string | Date;
		public startsOn: moment.Moment | string | Date;
		public startsAt: moment.Moment | string | Date;
		public end: moment.Moment | string | Date;
		public endsOn: moment.Moment | string | Date;
		public endsAt: moment.Moment | string | Date;
	}
}
