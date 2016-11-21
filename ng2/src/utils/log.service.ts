import { Injectable } from '@angular/core';

@Injectable()
export class LuiLogService {
	public log(text: string): void {
		console.log(text);
	}
	public warn(text: string): void {
		console.warn(text);
	}
}
