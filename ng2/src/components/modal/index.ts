import { NgModule } from '@angular/core';
import { NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LuiModalComponent } from './modal.component';

@NgModule({
	declarations: [LuiModalComponent],
	imports: [NgbModule.forRoot()],
	providers: [NgbModalRef],
	exports: [LuiModalComponent]
})
export class LuiModalModule {

}
