import * as moment from 'moment';

import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

import { CalendarMode } from './calendar.class';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';

@Component({
	selector: 'luid-date-picker-popup',
	templateUrl: './datepicker-popup.html',
})
export class LuiDatePickerPopupComponent {
	public displayStr: string;

	@Input() public date: moment.Moment;
	@Input() public minMode: CalendarMode;
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

	private thisElement: ElementRef;

	public constructor(thisElement: ElementRef) {
		this.thisElement = thisElement;
	}

	@HostListener('document:click')
	public onOutsideClick(): void {
		this.popover.close();
	}

	public onInsideClick($event: MouseEvent): void {
		$event.stopPropagation();
	}

	public onDateChange(): void {
		this.dateChange.emit(this.date);
		this.popover.close();
	}

	public onDisplayStrChange(displayStr: string): void {
		this.displayStr = displayStr;
	}
}
