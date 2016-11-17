import { Component } from '@angular/core';
import { LuiDatePickerComponent } from './../../../src/components/date-picker';

@Component({
	selector: 'date-picker-demo',
	templateUrl: 'date-picker-demo.html',
	directives: [LuiDatePickerComponent]
})
export class DatePickerDemoComponent {
	constructor(
	) {
	}
}

