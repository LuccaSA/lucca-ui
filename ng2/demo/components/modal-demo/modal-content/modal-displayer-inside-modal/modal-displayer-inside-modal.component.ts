import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LuiModalDisplayer, LuiModalOptions } from '../../../../../src/components/modal/modal-displayer';
import { ModalContentComponent } from '../modal-content.component';

@Component({
	selector: 'modal-displayer-inside-modal',
	templateUrl: 'modal-displayer-inside-modal.html'
})
export class ModalDisplayerInsideModalComponent extends LuiModalDisplayer {

	public message: string;

	constructor(ngbModal: NgbModal) {
		super(ngbModal);
		this.message = 'Result will appear here ';
	}

	displayAnotherModal() {
		let options: LuiModalOptions = {
			backdrop: false,
			keyboard: false,
			size: 'sm',
			windowClass: 'lui-demo'
		};
		this.openModal(ModalContentComponent, options);
	}

	onClose(result?: any) {
		this.message = result || 'none';
	}

	onDismiss(reason?: any) {
		this.message = 'Modal was dismissed';
	}
}
