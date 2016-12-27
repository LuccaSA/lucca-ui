import { Component } from '@angular/core';
import { LuiModalService } from '../../../src/components/modal/modal.service';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { LuiModal } from '../../../src/components/modal/modal.model';

@Component({
	selector: 'modal-demo',
	templateUrl: 'modal-demo.html'
})
export class ModalDemoComponent {

	public message: string;

	constructor(private modalService: LuiModalService) {
		this.message = 'Modal demo : ';
	}

	showLuiModal() {
		let modalRef: LuiModal = this.modalService.displayModal(ModalContentComponent);
		modalRef.result
			.then( (result) => this.message = 'Retrieved data : ' + result)
			.catch(() => this.message = 'Modal was dismissed');
	}
}
