/// <reference path="../references.ts" />

module Lui.Directives.DaterangePicker {
	"use strict";

	export class PredefinedPeriod {
		public label: string;
	}

	export class Model {
		public startsOn: moment.Moment;
		public endsOn: moment.Moment;
	}
}
