import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'luipMoment'})
export class LuipMomentPipe implements PipeTransform {
	transform(momentDate: any, format: string): string {
		if (!momentDate) {
			return '';
		}
		if (!format) {
			format = 'LLL';
		}
		let m = moment(momentDate);

		return m.isValid() ? m.format(format) : momentDate;
	}
}