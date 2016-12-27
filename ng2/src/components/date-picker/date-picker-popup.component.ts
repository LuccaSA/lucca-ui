import * as moment from 'moment';

import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

import { LuiDatePickerComponent } from './date-picker.component';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';

@Component({
	selector: 'luid-date-picker-popup',
	templateUrl: './datepicker-popup.html',
})
export class LuiDatePickerPopupComponent extends LuiDatePickerComponent {
	@Input() public date: moment.Moment;
	@Input() public minMode: string;
	@Input() public format: string;
	@Input() public displayFormat: string;
	@Input() public displayedCalendars: string;
	@Input() public min: moment.Moment;
	@Input() public max: moment.Moment;
	@Input() public customClass: string;
	@Input() public placeholder: string;
	@Input() public shortcuts: Object[];
	@Input() public groupedShortcuts: string;
	@Output() public dateChange = new EventEmitter();

	@ViewChild('popover') public popover: NgbPopover;

	@HostListener('document:click')
	public onOutsideClick(): void {
		this.popover.close();
	}

	public selectDate(date: moment.Moment): void {
		super.selectDate(date);
		this.popover.close();
	}

	public onInsideClick($event: MouseEvent): void {
		$event.stopPropagation();
	}
}
