import { Component } from '@angular/core';
import { LuiModalContent } from '../../../../src/components/modal/modal-content.component';

@Component({
	selector: 'modal-content-demo',
	templateUrl: 'modal-content.html'
})
export class ModalContentComponent extends LuiModalContent  {

	private message: string;

	send() {
		this.closeModal(this.message);
	}

	cancel() {
		this.dismissModal();
	}

}
