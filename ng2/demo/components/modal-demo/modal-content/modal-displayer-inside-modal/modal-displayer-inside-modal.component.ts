import { Component } from '@angular/core';
import { LuiModalDisplayer, LuiModalOptions } from '../../../../../src/components/modal/modal-displayer';
import { ModalContentComponent } from '../modal-content.component';

@Component({
	selector: 'modal-displayer-inside-modal',
	templateUrl: 'modal-displayer-inside-modal.html'
})
export class ModalDisplayerInsideModalComponent {

	public message: string;

	public onCloseCallback: ((result: any) => any);

	constructor(private luiModalDisplayer: LuiModalDisplayer) {}

	displayAnotherModal() {
		let options: LuiModalOptions = {
			backdrop: false,
			keyboard: false,
			size: 'sm',
			windowClass: 'lui-demo'
		};
		this.luiModalDisplayer
			.openModal(ModalContentComponent, options)
			.then(result => this.onClose(result))
			.catch(reason => this.onDismiss(reason));
	}

	onClose(result?: any) {
		this.message = result || 'none';
		if (this.onCloseCallback) {
			this.onCloseCallback(result);
		}
	}

	onDismiss(reason?: any) {
		this.message = 'Modal was dismissed';
	}

}
