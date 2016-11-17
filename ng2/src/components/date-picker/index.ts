import { NgModule } from '@angular/core';
import { LuiDatePickerComponent } from './date-picker.component';
import { LuiTimePipesModule } from './../../pipes/time';

@NgModule({
	imports: [
		LuiTimePipesModule
	]
	declarations: [
		LuiDatePickerComponent
	],
	exports: [
		LuiDatePickerComponent
	]
})
export class LuiDatePickerModule { }

