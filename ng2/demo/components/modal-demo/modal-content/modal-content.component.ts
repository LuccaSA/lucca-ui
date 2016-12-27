import { Component } from '@angular/core';
import { LuiModal } from '../../../../src/components/modal/modal.model';

@Component({
	selector: 'modal-content-demo',
	templateUrl: 'modal-content.html'
})
export class ModalContentComponent {

	private message: string;
	constructor(public activeModal: LuiModal) {}

	send() {
		this.activeModal.close(this.message);
	}

	cancel() {
		this.activeModal.dismiss();
	}

}
