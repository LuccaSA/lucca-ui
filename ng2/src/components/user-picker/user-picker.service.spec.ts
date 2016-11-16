import { User } from './user.model';
import { LuiUserPickerService } from './user-picker.sevice';
import { inject, TestBed, fakeAsync } from '@angular/core/testing';

import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe('userPickerService', () => {
	let mockbackend, service;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				LuiUserPickerService,
				BaseRequestOptions,
				MockBackend,
				{
					provide: Http,
					useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
						return new Http(backend, defaultOptions);
					},
					deps: [MockBackend, BaseRequestOptions],
				}
			]
		});
	});

	beforeEach(inject([MockBackend, LuiUserPickerService], (_mockbackend, _service) => {
		mockbackend = _mockbackend;
		service = _service;
	}));

	describe('default', () => {

		it('should return response when subscribed to getUsers', done => {

			const RESPONSE_0_users = { header: {}, data: { items: [] } };
			const baseResponse = new Response(new ResponseOptions({ body: RESPONSE_0_users }));
			mockbackend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));

			service.getUsers({
				showFormerEmployees: false,
				clue: '',
				appId: null,
				operations: null
			}).subscribe((res: User[]) => {
				expect(res).toBe(RESPONSE_0_users.data.items);
				done();
			});
		});

		it('should call the api with the right clue when getUsers() is called', fakeAsync(() => {
			const clues = ['a', 'ismael', 'zanzibar'];
			let counter = 0;
			mockbackend.connections.subscribe((connection: MockConnection) => {

				expect(connection.request.method).toBe(RequestMethod.Get);
				expect(connection.request.url).toBe(`/api/v3/users/find?clue=${clues[counter]}&formerEmployees=false&limit=10`);
				counter++;
			});

			clues.map(c => service.getUsers({clue: c}));
		}));

		it('should handle errors', fakeAsync(() => {
			spyOn(console, 'error');

			// TODO Mock error not supporting a response yet
			// const baseResponse = new Response(new ResponseOptions({ body: { Message: 'error_find' }, status: 500, type: ResponseType.Error}));
			mockbackend.connections.subscribe((c: MockConnection) => c.mockError(new Error('error_find')));

			service.getUsers({}).subscribe(
				() => { throw new Error('Should not have been called !'); },
				() => expect(console.error).toHaveBeenCalled()
			);
		}));

	});

	describe('with former employees', () => {
		it('should call the api with the right clue when getUsers() is called', fakeAsync(() => {
			const clues = ['a', 'ismael', 'zanzibar'];
			let counter = 0;
			mockbackend.connections.subscribe((connection: MockConnection) => {

				expect(connection.request.method).toBe(RequestMethod.Get);
				expect(connection.request.url).toBe(`/api/v3/users/find?clue=${clues[counter]}&formerEmployees=true&limit=10`);
				counter++;
			});

			clues.map(c => service.getUsers({clue: c, showFormerEmployees: true}));
		}));
	});

	describe('with filtering on an operation scope', () => {
		it('should call the api with the right clue when getUsers() is called', fakeAsync(() => {
			const appInstanceId = 86;
			const operations = [1, 2, 3];
			const clues = ['a', 'ismael', 'zanzibar'];

			let counter = 0;
			mockbackend.connections.subscribe((connection: MockConnection) => {
				const operationParturl = `&operations=${operations.join(',')}&appinstanceid=${appInstanceId}`;

				expect(connection.request.method).toBe(RequestMethod.Get);
				expect(connection.request.url).toBe(`/api/v3/users/find?clue=${clues[counter]}&formerEmployees=false&limit=10` + operationParturl);
				counter++;
			});

			clues.map(c => service.getUsers({clue: c, operations: operations, appId: appInstanceId}));
		}));
	});

});
