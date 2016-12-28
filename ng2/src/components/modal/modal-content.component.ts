import { Injectable } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export abstract class LuiModalContent {

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
