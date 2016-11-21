import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuiDatePickerComponent } from './date-picker.component';
import { LuiTimePipesModule } from './../../pipes/time';

@NgModule({
	imports: [
		CommonModule,
		LuiTimePipesModule
	],
	declarations: [
		LuiDatePickerComponent
	],
	exports: [
		LuiDatePickerComponent
	]
})
export class LuiDatePickerModule { }

