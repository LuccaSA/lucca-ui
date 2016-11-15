import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'lui-progress-bar',
	template: `
		<div class="lui slim progress progress-bar">
			<div class="indicator" data-percentage="0" 
				[ngStyle]="{ width: getProgress() + '%' }"
				[ngClass]="{ progressing: false }">
			</div>
		</div>
	`
})
export class LuiProgressBarComponent {
	public getProgress() {
		return 30;
	}
}
@NgModule({
	imports: [CommonModule],
	declarations: [LuiProgressBarComponent],
	exports: [LuiProgressBarComponent]
})
export class LuiProgressBarModule {

}
