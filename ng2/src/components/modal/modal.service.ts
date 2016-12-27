import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LuiModal } from './modal.model';


@Injectable()
export class LuiModalService {
	constructor(private modalService: NgbModal) {}


	displayModal(component: any): LuiModal {
		return new LuiModal(this.modalService.open(component));
	}
}
