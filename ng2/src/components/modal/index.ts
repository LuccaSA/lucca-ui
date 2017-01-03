import { NgModule } from '@angular/core';
import { NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LuiModalContainerComponent } from './modal-container.component';
import { LuiModalTemplateComponent } from './modal-template.component';

@NgModule({
	declarations: [LuiModalContainerComponent, LuiModalTemplateComponent],
	imports: [NgbModule.forRoot()],
	providers: [NgbModalRef],
	exports: [LuiModalContainerComponent, LuiModalTemplateComponent]
})
export class LuiModalModule {

}
