import { Component } from '@angular/core';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { LuiModalDisplayer } from '../../../src/components/modal/modal-displayer';

@Component({
	selector: 'modal-demo',
	templateUrl: 'modal-demo.html',
	providers: [LuiModalDisplayer]
})
export class ModalDemoComponent {

	public message: string;

	constructor(private luiModalDisplayer: LuiModalDisplayer) {
		this.message = 'Result will appear here ';
	}

	showLuiModal() {
		this.luiModalDisplayer
			.openModal(ModalContentComponent)
			.then(result => this.onClose(result))
			.catch((reason?) => this.onDismiss(reason));
	}

	onClose(result?: any) {
		this.message = 'Retrieved data : ' + (result || 'none');
	}

	onDismiss(reason?: any) {
		this.message = 'Modal was dismissed';
	}
}
