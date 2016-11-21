import { API_LIMIT } from './constants';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class Options {
	showFormerEmployees: boolean;
	clue: string;
	appId: number;
	operations: Array<number>;
}

@Injectable()
export class LuiUserPickerService {

	constructor(private http: Http) { }

	getHomonymsProperties(homonyms: Array<User>, properties: Array<string>): Observable<User[]> {
		const homonymsIds = homonyms.map(user => user.id).join(',');
		const fields = [...properties, 'id', 'firstName', 'lastName'].join(',');

		return this.http.get(`/api/v3/users?id=${homonymsIds}&fields=${fields}`)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getCurrentUser(): Observable<User> {
		return this.http.get('/api/v3/users/me')
			.map(res => res.json().data);
	}

	getUsers(options: Options): Observable<User[]> {
		let url = this.buildSearchUrl(options);

		return this.http.get(url)
			.map(this.extractData)
			.catch(this.handleError);
	}

	private buildSearchUrl(options: Options): string {
		let formerEmployees = 'formerEmployees=' + (options.showFormerEmployees ? 'true' : 'false');
		let limit = '&limit=' + API_LIMIT;
		let clue = 'clue=' + options.clue;
		let operations = '';
		let appInstanceId = '';

		if (options.appId && options.operations && options.operations.length) {
			appInstanceId = '&appinstanceid=' + options.appId;
			operations = '&operations=' + options.operations.join(',');
		}

		const query = '/api/v3/users/find?' + (options.clue ? (clue + '&') : '') + formerEmployees + limit + operations + appInstanceId;

		return query;
	}

	private extractData(res: Response) {
		const body = res.json();
		return body.data.items || {};
	}

	private handleError (error: any) {
		console.error('Error while fetching users', error);
		return Observable.throw(error);
	}
}
