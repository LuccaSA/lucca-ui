import { Component, Input } from '@angular/core';
import { LuipMomentPipe } from './../../pipes/time';


@Component({
	selector: 'luid-date-picker',
	templateUrl: 'datepicker-inline.html',
	pipes: [LuipMomentPipe]
})
export class LuiDatePickerComponent {
	@Input() public mode: string;

}
