import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'date-picker-demo',
	templateUrl: 'date-picker-demo.html'
})
export class DatePickerDemoComponent implements OnInit {
	public date: moment.Moment;
	constructor() {}

	public ngOnInit(): void {
		this.date = moment();
	}
}
