import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { LuiModalTemplateComponent } from '../../../../src/components/modal/modal-template.component';
import { ModalDisplayerInsideModalComponent } from './modal-displayer-inside-modal/modal-displayer-inside-modal.component';

@Component({
	selector: 'modal-content-demo',
	templateUrl: 'modal-content.html'
})
export class ModalContentComponent implements AfterViewInit {

	private message: string;

	@ViewChild(LuiModalTemplateComponent) luiModal: LuiModalTemplateComponent;
	@ViewChild(ModalDisplayerInsideModalComponent) innerModal: ModalDisplayerInsideModalComponent;

	constructor() {}

	ngAfterViewInit(): void {
		this.innerModal.onCloseCallback = (result => this.message = 'received : ' + (result || 'none'));
	}

	confirm() {
		this.luiModal.closeModal(this.message);
	}

	cancel() {
		this.luiModal.dismissModal();
	}
}
