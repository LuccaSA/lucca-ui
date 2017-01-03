import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export abstract class LuiModalDisplayer {

	private modalService: NgbModal;

	constructor(ngbModal: NgbModal) {
		this.modalService = ngbModal;
	}

	openModal(contentComponent: any, options?: LuiModalOptions) {
		let modalRef: NgbModalRef;
		modalRef = options ? this.modalService.open(contentComponent, this.luiToNgbOptions(options))
			: this.modalService.open(contentComponent);
		modalRef.result
			.then( result => this.onClose(result))
			.catch(() => this.onDismiss());
	}

	/**
	 * TODO this cannot add the size class at the right place. Therefore css must be adapted :
	 *  .lui-modal-container ngb-modal-window {
	 *    &.lui-modal-desktop {
	 *      [role=document] {
	 *        apply here modal-desktop theme
	 *      }
	 *    }
	 *  }
	 * @param luiOptions
	 * @returns {any}
	 */
	private luiToNgbOptions(luiOptions: LuiModalOptions): NgbModalOptions {
		if (luiOptions) {
			if ((luiOptions.size !== 'sm') || (luiOptions.size !== 'lg')) {
				luiOptions.windowClass = [luiOptions.windowClass, 'lui-modal-' + luiOptions.size].join(' ')
					|| luiOptions.size;
			}
			return <NgbModalOptions>luiOptions;
		}
		return null;
	}

	abstract onClose(result?: any);

	abstract onDismiss(reason?: any);
}


export interface LuiModalOptions {

	backdrop?: boolean | 'static';

	keyboard?: boolean;
	/**
	 * More permissive than default NbgModalOptions parameter.
	 * Enter any size supported by bootstrap as a class.
	 */
	size?: string;
	/**
	 * Custom class to append to the modal window.
	 * Custom classes can be passed if separated by whitespace.
	 */
	windowClass?: string;
}
