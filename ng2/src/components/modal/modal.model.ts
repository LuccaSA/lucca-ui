import { Injectable } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class LuiModal {

	public result: Promise<any>;

	constructor(public modal: NgbModalRef) {
		this.result = this.modal.result;
	}

	close(data?: any) {
		this.modal.close(data);
	}

	dismiss(reason?: any) {
		this.modal.dismiss(reason);
	}
}
