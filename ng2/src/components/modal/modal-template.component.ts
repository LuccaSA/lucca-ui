import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core/src/metadata/directives';

@Component({
	selector: 'lui-modal',
	templateUrl: 'modal-template.html'
})
export class LuiModalTemplateComponent {

	public activeModal: NgbActiveModal;
	@Input() title: string;

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
