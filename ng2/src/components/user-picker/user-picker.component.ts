import { BehaviorSubject } from 'rxjs/Rx';
import { defaultHomonymsProperties, HomonymProperty, INPUT_DEBOUNCE } from './constants';
import { formatItems, getDifferentiatingPropertiesByUserid, markFormerEmployees, markHomonyms } from './user-picker.helper';
import { User } from './user.model';
import { LuiUserPickerService } from './user-picker.sevice';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';

@Component({
	selector: 'luid-user-picker',
	template: `
		<ng-select [disabled]="controlDisabled"
			[items]="items"
			(selected)="selected(element)"
			(removed)="removed(element)"
			(typed)="typed($event)"
			placeholder="Users">
		</ng-select>
	`,
	styleUrls: []
})
export class LuiUserPickerComponent implements OnInit, OnDestroy {
	@Input() controlDisabled: boolean;
	@Input() showFormerEmployees: boolean;
	@Input() homonymsProperties: Array<HomonymProperty> = defaultHomonymsProperties;
	@Input() customFilter: (user: any) => boolean;
	@Input() appId: number;
	@Input() operations: Array<number>;
	@Input() customInfo: (user: any) => string;
	@Input() customInfoAsync: (user: any) => Observable<string>;
	@Input() displayMeFirst: boolean;
	@Input() displayAllUsers: boolean;

	@Output() onSelect = new EventEmitter();
	@Output() onRemove = new EventEmitter();

	public items: Array<{id: any, text: string}> = [];

	private _users: Array<User>;
	private get users() { return this._users; }
	private set users(users: Array<User>) { this.items = formatItems(users); this._users = users; }

	private observableInput: BehaviorSubject<string> = new BehaviorSubject('');

	constructor(private usersService: LuiUserPickerService) { }

	ngOnInit() {
		this.observeInputToUpdateUsers();
	}

	ngOnDestroy() {
		this.observableInput.unsubscribe();
	}

	selected(element: {id: number, text: string}) {
		this.onSelect.next(this.getUserFromId(element.id));
	}

	removed(element: {id: number, text: string}) {
		this.onRemove.next(this.getUserFromId(element.id));
	}

	private getUserFromId(id: number): User {
		return this.users.find(user => user.id === id);
	}

	private observeInputToUpdateUsers() {
		this.observableInput
			.debounceTime(INPUT_DEBOUNCE)
			.distinctUntilChanged()
			.switchMap(value => this.usersService.getUsers({
				showFormerEmployees: this.showFormerEmployees,
				clue: value,
				appId: this.appId,
				operations: this.operations
			}))
			.map(users => this.transformUsers(users))
			.switchMap(users => this.displayUsersFirstAsync(users))
			.switchMap(users => this.handleCustomInfoAsync(users))
			.switchMap(users => this.handleHomonymsAsync(users))
			.subscribe(
				users => this.users = users,
				error => this.users = [{id: -1, overflow: 'LUIDUSERPICKER_ERR_GET_USERS'}]
			);
	}

	typed($event: string) {
		this.observableInput.next($event);
	}

	private transformUsers(users: Array<User>): Array<User> {
		if (this.customFilter) {
			users = users.filter(this.customFilter);
		}

		if (this.customInfo) {
			users = users.map(user => Object.assign(user, {info: this.customInfo(user)}));
		}

		users = markFormerEmployees(users);
		users = markHomonyms(users);

		return users;
	}

	private handleHomonymsAsync(users: Array<User>): Observable<Array<User>> {
		const homonyms = users.filter(user => user.hasHomonyms);

		if (homonyms.length) {
			return this.usersService.getHomonymsProperties(homonyms, this.homonymsProperties.map(p => p.value))
				.map(usersWithHomonyms => {
					const homonymsDictionary = getDifferentiatingPropertiesByUserid(usersWithHomonyms);

					return users.map(user => Object.assign(user, homonymsDictionary[user.id]));
				});
		}

		return Observable.of(users);
	}

	private handleCustomInfoAsync(users: Array<User>): Observable<Array<User>> {
		if (this.customInfoAsync) {
			const usersObservables = users.map(user => {
				return this.customInfoAsync(user).map(info => <User>Object.assign(user, {infoAsync: info}));
			});

			return Observable.zip(...usersObservables);
		}

		return Observable.of(users);
	}

	private displayUsersFirstAsync(users: Array<User>): Observable<Array<User>> {
		if (this.displayMeFirst && !this.observableInput.value) {
			return this.usersService.getCurrentUser().map(me => {
				users = users.filter(user => user.id !== me.id);

				return [me, ...users];
			});
		}

		return Observable.of(users);
	}
}
