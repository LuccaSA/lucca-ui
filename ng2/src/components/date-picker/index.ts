import { NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LuiDatePickerComponent } from './date-picker.component';
import { LuiDatePickerPopupComponent } from './date-picker-popup.component';
import { LuiTimePipesModule } from './../../pipes/time';
import { NgModule } from '@angular/core';

@NgModule({
	imports: [
		CommonModule,
		LuiTimePipesModule,
		NgbPopoverModule,
		FormsModule
	],
	declarations: [
		LuiDatePickerComponent,
		LuiDatePickerPopupComponent
	],
	exports: [
		LuiDatePickerComponent,
		LuiDatePickerPopupComponent
	],
	providers: [
		NgbPopoverConfig
	]
})
export class LuiDatePickerModule { }

