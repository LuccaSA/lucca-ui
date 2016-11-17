import { NgModule } from '@angular/core';
import { LuipMomentPipe } from './moment.pipe';

@NgModule({
	declarations: [
		LuipMomentPipe
	],
	exports: [
		LuipMomentPipe
	]
})
export class LuiTimePipesModule { }

