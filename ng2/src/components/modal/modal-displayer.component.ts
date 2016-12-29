import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export abstract class LuiModalDisplayer {

	private modalService: NgbModal;

	constructor(ngbModal: NgbModal) {
		this.modalService = ngbModal;
	}

	openModal(contentComponent: any) {
		let modalRef = this.modalService.open(contentComponent);
		modalRef.result
			.then( result => this.onClose(result))
			.catch(() => this.onDismiss());
	}

	abstract onClose(result?: any);

	abstract onDismiss(reason?: any);
}
