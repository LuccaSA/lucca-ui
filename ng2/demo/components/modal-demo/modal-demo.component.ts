import { Component } from '@angular/core';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { LuiModalDisplayer } from '../../../src/components/modal/modal-displayer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'modal-demo',
	templateUrl: 'modal-demo.html'
})
export class ModalDemoComponent extends LuiModalDisplayer {

	public message: string;

	constructor(ngbModal: NgbModal) {
		super(ngbModal);
		this.message = 'Result will appear here ';
	}

	showLuiModal() {
		this.openModal(ModalContentComponent);
	}

	onClose(result?: any) {
		this.message = 'Retrieved data : ' + (result || 'none');
	}

	onDismiss(reason?: any) {
		this.message = 'Modal was dismissed';
	}
}
