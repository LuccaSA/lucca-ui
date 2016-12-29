import { NgModule } from '@angular/core';
import { NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LuiModalContainerComponent } from './modal-container.component';

@NgModule({
	declarations: [LuiModalContainerComponent],
	imports: [NgbModule.forRoot()],
	providers: [NgbModalRef],
	exports: [LuiModalContainerComponent]
})
export class LuiModalModule {

}
