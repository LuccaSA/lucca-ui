import { Component } from '@angular/core';
import { LuiModalTemplateComponent } from '../../../../src/components/modal/modal-template.component';

@Component({
	selector: 'modal-content-demo',
	templateUrl: 'modal-content.html'
})
export class ModalContentComponent extends LuiModalTemplateComponent {

	private message: string;

	send() {
		this.closeModal(this.message);
	}

	cancel() {
		this.dismissModal();
	}

}
