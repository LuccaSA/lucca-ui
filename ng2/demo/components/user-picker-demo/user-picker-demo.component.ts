import { Component } from '@angular/core';
import { LuiUserPickerComponent } from './../../../src/components/user-picker';

@Component({
	selector: 'user-picker-demo',
	templateUrl: 'user-picker-demo.html',
	styleUrls: [],
	providers: [],
	directives: [LuiUserPickerComponent]
})
export class UserPickerDemoComponent {
	constructor(
	) {
	}
}

