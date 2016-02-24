module Lui {
	"use strict";
	export interface ILuiFilters extends ng.IFilterService {
		(name: "luifDuration"): (input: any, showSign?: boolean, unit?: string, precision?: string) => string;
		(name: "luifPlaceholder"): (input: any, placeholder: string) => string;
		(name: "luifFriendlyRange"): (input: Period, excludeEnd: boolean) => string;
		(name: "luifDefaultCode"): (input: string) => string;
	}

	export class Period {
		start: moment.Moment & string & Date;
		startsOn: moment.Moment & string & Date;
		startsAt: moment.Moment & string & Date;
		end: moment.Moment & string & Date;
		endsOn: moment.Moment & string & Date;
		endsAt: moment.Moment & string & Date;
	}
}
