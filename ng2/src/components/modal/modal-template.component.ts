import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'lui-modal',
	templateUrl: 'modal-template.html'
})
export class LuiModalTemplateComponent {

	public activeModal: NgbActiveModal;

	constructor(modal: NgbActiveModal) {
		this.activeModal = modal;
	}

	closeModal(data?: any) {
		this.activeModal.close(data);
	}

	dismissModal() {
		this.activeModal.dismiss();
	}
}
