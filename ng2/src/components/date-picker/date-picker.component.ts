import * as moment from 'moment';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IFormatter, MomentFormatter } from '../../utils/formatter';

import { CalendarBaseComponent } from './calendar-base.component';
import { CalendarMode } from './calendar.class';
import { FormControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import { Shortcut } from './calendar.class';

// http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
// export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
// 	provide: NG_VALUE_ACCESSOR,
// 	useExisting: forwardRef(() => CustomInputComponent),
// 	multi: true
// };

@Component({
	selector: 'luid-date-picker',
	templateUrl: 'datepicker-inline.html'
})
export class LuiDatePickerComponent extends CalendarBaseComponent implements OnChanges, OnInit {
	private formatter: IFormatter<moment.Moment>;
	private formControl: FormControl;

	@Input() public date: moment.Moment;
	@Input() public format: string;
	@Input() public displayFormat: string;
	@Input() public displayedCalendars: string;
	@Input() public minMode: string;
	@Input() public min: moment.Moment;
	@Input() public max: moment.Moment;
	@Input() public popover: NgbPopover;
	@Input() public customClass: string;
	@Input() public placeholder: string;
	@Input() public shortcuts: Object[];
	@Input() public groupedShortcuts: string;

	@Output() dateChange = new EventEmitter();

	public displayStr: string;
	public selectedViewValue: string;

	public ngOnInit() {
		super.ngOnInit();
		this.setFormat(this.format, this.displayFormat);
		this.setCalendarCnt(this.displayedCalendars, false);
		this.formControl = new FormControl(this.date);
		this.formControl.registerOnChange(() => this.render());
		this.render();
	}

	public ngOnChanges(changes: SimpleChanges) {
		for (let propName in changes) {
			if (propName === 'date') {
				this.date = this.date.isValid() ? this.date : undefined;
				this.assignClasses();
			}
		}
	}

	public selectShortcut = (shortcut: Shortcut) => {
		let date = this.formatter.parseValue(shortcut.date);
		this.setViewValue(date);
		this.displayStr = this.getDisplayStr(date);
		this.closePopover();
		this.assignClasses();
	};

	/*
	// set stuff - is called in the linq function
	public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
		this.ngModelCtrl = ngModelCtrl;
		ngModelCtrl.$render = () => { this.render(); };
		(<ICalendarValidators>ngModelCtrl.$validators).min = (modelValue: any, viewValue: any) => {
			let min = this.min;
			let value = this.getViewValue();
			return !value || !min || min.diff(value) <= 0;
		};
		(<ICalendarValidators>ngModelCtrl.$validators).max = (modelValue: any, viewValue: any) => {
			let max = this.max;
			let value = this.getViewValue();
			return !value || !max || max.diff(value) >= 0;
		};
	}
	*/
	public setFormat(format: string, displayFormat?: string): void {
		this.formatter = new MomentFormatter(format);
		if (format !== 'moment' && format !== 'date') {
			this.displayFormat = displayFormat || format || 'L';
		} else {
			this.displayFormat = displayFormat || 'L';
		}
	}
	protected selectDate(date: moment.Moment): void {
		this.setViewValue(date);
		this.displayStr = this.getDisplayStr(date);
		this.date = date;
		this.assignClasses();
		this.closePopover();
		this.dateChange.emit(this.date);
	}
	// public setPopoverTrigger(elt: angular.IAugmentedJQuery, $scope: IDatePickerScope): void {
	// 	let onClosing = (): void => {
	// 		this.formControl.markAsTouched();
	// 		this.closePopover();
	// 	};
	// 	this.popoverController = new Lui.Utils.ClickoutsideTrigger(elt, $scope, onClosing);
	// 	$scope.popover = { isOpen: false };
	// 	$scope.togglePopover = ($event: ng.IAngularEvent) => {
	// 		this.togglePopover($event);
	// 	};
	// }

	// public setElement(element: ng.IAugmentedJQuery): void {
	// 	this.element = element;
	// }

	// // ng-model logic
	private setViewValue(value: moment.Moment): void {
		this.selectedViewValue = this.formatter.formatValue(value);
		this.formControl.markAsTouched();
	}

	// private getViewValue(): moment.Moment {
	// 	return this.formatter.parseValue(this.ngModelCtrl.$viewValue);
	// }
	// private validate(): void {
	// 	this.ngModelCtrl.$validate();
	// }

	private render(): void {
		this.currentDate = moment(this.date).startOf('month');
		// this.handleMinMode();
		this.calendars = this.constructCalendars();
		this.min = this.formatter.parseValue(this.min);
		this.max = this.formatter.parseValue(this.max);
		this.assignClasses();
		this.displayStr = this.getDisplayStr(moment(this.date));
	}
	// popover logic
	// private togglePopover($event: ng.IAngularEvent): void {
	// 	if (this.$scope.popover.isOpen) {
	// 		this.closePopover();
	// 	} else {
	// 		this.openPopover($event);
	// 	}
	// }

	private handleMinMode(): void {
		switch (this._minMode) {
			case CalendarMode.Years:
				this.uiCtrl.switchToYearMode();
				break;
			case CalendarMode.Months:
				this.uiCtrl.switchToMonthMode();
				break;
		}
	}

	private closePopover(): void {
		if (!!this.popover) {
			this.popover.close();
		}
	}
	// private openPopover($event: ng.IAngularEvent): void {
	// 	this.element.addClass('ng-open');
	// 	this.$scope.direction = 'init';
	// 	if (!!this.popoverController) {
	// 		this.render();
	// 		this.popoverController.open($event);
	// 	}
	// }

	private getDisplayStr(date: moment.Moment): string {
		return !!date ? date.format(this.displayFormat) : undefined;
	}
}
