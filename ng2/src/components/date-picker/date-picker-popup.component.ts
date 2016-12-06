import * as moment from 'moment';

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'luid-date-picker-popup',
	templateUrl: './datepicker-popup.html',
})
export class LuiDatePickerPopupComponent {
	public popupTemplate: string = require('./datepicker-inline.html');
	public displayStr: string;

	// public internalDate: moment.Moment;

	@Input() public date: moment.Moment;
	@Output() public dateChange = new EventEmitter();

	public onDateChange(): void {
		console.log('onDateChange', this.date);
		this.dateChange.emit(this.date);
	}
}
