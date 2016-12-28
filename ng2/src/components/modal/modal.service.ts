import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class LuiModalService {


	constructor(private modalService: NgbModal) {}

	displayModal(component: any): NgbModalRef  {
		let ngbModalRef =  this.modalService.open(component);
		return ngbModalRef;
	}
}

