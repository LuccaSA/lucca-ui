// import { LuiUserPickerService } from './user-picker.sevice';
// import { LuiUserPickerComponent } from './user-picker.component';
// import { INPUT_DEBOUNCE } from './constants';
// import { async, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
// import { SelectModule } from 'ng2-select';
// import { Observable } from 'rxjs/Observable';

// class MockLuiUserPickerService {
// 	getUsers() { return Observable.of([{firstName: 'John', lastName: 'Kennedy', id: 1}]); }
// }

// describe('luid-user-picker', () => {

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [LuiUserPickerComponent],
// 			providers: [ {provide: LuiUserPickerService, useClass: MockLuiUserPickerService} ],
// 			imports: [SelectModule]
// 		}).compileComponents();
// 	}));

// 	/**********************
// 	** INITIALISATION    **
// 	**********************/
// 	describe('initialisation', () => {
// 		let fixture, app;

// 		beforeEach(() => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;
// 		});

// 		it('should observe user input', () => {
// 			spyOn(app, 'observeInputToUpdateUsers');
// 			fixture.detectChanges();

// 			expect(app.observeInputToUpdateUsers).toHaveBeenCalled();
// 		});

// 		it('should initialize the select items', fakeAsync(() => {
// 			expect(app.items.length).toBe(0);

// 			fixture.detectChanges();

// 			setTimeout(() => expect(app.items.length).toBeGreaterThan(0), INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));
// 	});

// 	/**********************
// 	** BASIC             **
// 	**********************/
// 	describe('no pagination, no former employees, no homonyms', () => {
// 		let fixture, app;

// 		beforeEach(() => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;
// 		});

// 		it('should handle the response', inject([LuiUserPickerService], fakeAsync((service) => {
// 			const usersIds = [1, 2, 3, 4];
// 			const users = usersIds.map(v => ({ id: v, firstName: v.toString() }));
// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.of(users));

// 			fixture.detectChanges();

// 			setTimeout(() => expect(app.items.map(i => i.id)).toEqual(usersIds), INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));

// 		it('should handle errors', inject([LuiUserPickerService], fakeAsync((service) => {
// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.throw('error'));

// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				expect(app.users[0].overflow).toEqual('LUIDUSERPICKER_ERR_GET_USERS');
// 				expect(app.users[0].id).toEqual(-1);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));
// 	});

// 	// /**********************
// 	// ** PAGINATION        **
// 	// **********************/
// 	// describe('with pagination', () => {
// 	// 	beforeEach(() => {
// 	// 		var tpl = angular.element('<luid-user-picker ng-model=''></luid-user-picker>');
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();

// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 	});
// 	// 	it('should detect there is too many users to display', () => {
// 	// 		isolateScope.find();
// 	// 		$httpBackend.flush();

// 	// 		var overflow = {overflow: '5/20', id:-1};
// 	// 		expect(isolateScope.count).toBe(20);
// 	// 		expect(isolateScope.users.length).toBe(11); // 5 first users + overflow message ==> 6 items
// 	// 		var overflowMessage = _.last(isolateScope.users);
// 	// 		expect(overflowMessage.overflow).toEqual('LUIDUSERPICKER_OVERFLOW');
// 	// 		expect(overflowMessage.cnt).toEqual(10);
// 	// 		expect(overflowMessage.all).toEqual(20);
// 	// 	});
// 	// });
// 	// // Async
// 	// // describe('with async pagination', () => {
// 	// // 	beforeEach(() => {
// 	// // 		var tpl = angular.element('<luid-user-picker ng-model='myUser'></luid-user-picker>');
// 	// // 		elt = $compile(tpl)($scope);
// 	// // 		isolateScope = elt.isolateScope();
// 	// // 		$scope.$digest();

// 	// // 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
// 	// // 	});
// 	// // 	it('should detect there is too many users to display and ask for how many results there is', () => {
// 	// // 		isolateScope.find();
// 	// // 		$httpBackend.flush();

// 	// // 		// TODO_ANAIS
// 	// // 		// expect(isolateScope.displayedUsers.length).toBe(less than 20);
// 	// // 		// expect(last displayed user).toBe(the label displaying 'results 1-5/20')

// 	// // 		// might need a $scope.$apply here to resolve some promises
// 	// // 		// $httpBackend.expectGET(findApi).respond(200, RESPONSE_find_count);
// 	// // 		// $timeout.flush();
// 	// // 		// $httpBackend.flush();
// 	// // 	});
// 	// // 	it('should ask how many user ther is only once its timeout is resolved, not after each find', () => {
// 	// // 		isolateScope.find('a');
// 	// // 		$httpBackend.flush();

// 	// // 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
// 	// // 		isolateScope.find('ab');
// 	// // 		$httpBackend.flush();
// 	// // 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
// 	// // 		isolateScope.find('abc');
// 	// // 		$httpBackend.flush();

// 	// // 		// TODO_ANAIS
// 	// // 		// expect(isolateScope.displayedUsers.length).toBe(less than 20);
// 	// // 		// expect(last displayed user).toBe(the label displaying 'results 1-5/20')

// 	// // 		// might need a $scope.$apply here to resolve some promises
// 	// // 		// $httpBackend.expectGET(findApi).respond(200, RESPONSE_find_count);
// 	// // 		// $timeout.flush();
// 	// // 		// $httpBackend.flush();
// 	// // 	});
// 	// // 	it('should handle error when asking for the number of results', () => {
// 	// // 		isolateScope.find('a');
// 	// // 		$httpBackend.flush();

// 	// // 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
// 	// // 		isolateScope.find('ab');
// 	// // 		$httpBackend.flush();
// 	// // 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
// 	// // 		isolateScope.find('abc');
// 	// // 		$httpBackend.flush();

// 	// // 		// TODO_ANAIS
// 	// // 		// expect(isolateScope.displayedUsers.length).toBe(less than 20);
// 	// // 		// expect(last displayed user).toBe(the label displaying 'results 1-5/20')

// 	// // 		// might need a $scope.$apply here to resolve some promises
// 	// // 		// $httpBackend.expectGET(findApi).respond(500, RESPONSE_ERROR_COUNT;
// 	// // 		// $timeout.flush();
// 	// // 		// $httpBackend.flush();
// 	// // 	});
// 	// // });

// 	/**********************
// 	** FORMER EMPLOYEES  **
// 	**********************/
// 	describe('with former employees', () => {
// 		let fixture, app;

// 		beforeEach(() => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;
// 		});

// 		it('should detect and flag former employees in the response', inject([LuiUserPickerService], fakeAsync((service) => {
// 			const users = [
// 				{'id': 1, 'firstName': 'Frédéric', 'lastName': 'Pot', 'dtContractEnd': null},
// 				{'id': 2, 'firstName': 'Catherine', 'lastName': 'Foliot', 'dtContractEnd': '2003-06-30T00:00:00'},
// 				{'id': 3, 'firstName': 'Catherine', 'lastName': 'Lenzi', 'dtContractEnd': '2003-04-28T00:00:00'},
// 				{'id': 4, 'firstName': 'Bruno', 'lastName': 'Catteau', 'dtContractEnd': null}
// 			];
// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.of(users));

// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const formerEmployeeIds = app.users
// 					.filter(u => u.isFormerEmployee)
// 					.map(u => u.id);

// 				expect(formerEmployeeIds).toEqual([2, 3]);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));
// 	});

// 	/**********************
// 	** CUSTOM FILTERING  **
// 	**********************/
// 	describe('with custom filtering', () => {
// 		const users = [
// 			{'id': 1, 'firstName': 'Guillaume', 'lastName': 'Allain'},
// 			{'id': 2, 'firstName': 'Elsa', 'lastName': 'Arrou-Vignod'},
// 			{'id': 3, 'firstName': 'Chloé', 'lastName': 'Azibert Yekdah'},
// 			{'id': 4, 'firstName': 'Clément', 'lastName': 'Barbotin'}
// 		];

// 		let fixture, app;

// 		beforeEach(inject([LuiUserPickerService], (service) => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;

// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.of(users));
// 		}));

// 		it('should call app.customFilter N times', fakeAsync(() => {
// 			const spy: any = {filter: () => true};
// 			spyOn(spy, 'filter').and.callThrough();

// 			app.customFilter = spy.filter;
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				expect(spy.filter).toHaveBeenCalled();
// 				expect(spy.filter.calls.count()).toBe(4);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));

// 		it('should display all when customFilter returns true', fakeAsync(() => {
// 			app.customFilter = (u) => true;

// 			fixture.detectChanges();

// 			setTimeout(() => expect(app.users.length).toBe(4), INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));

// 		it('should display nothing when customFilter returns false', fakeAsync(() => {
// 			app.customFilter = (u) => false;

// 			fixture.detectChanges();

// 			setTimeout(() => expect(app.users.length).toBe(0), INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));

// 		it('should filter the right results', fakeAsync(() => {
// 			app.customFilter = (u) => u.id % 2 === 0;
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				expect(app.users.length).toBe(2);

// 				const ids = app.users.map(u => u.id);
// 				expect(ids).toEqual([2, 4]);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));
// 	});

// 	/**********************
// 	** HOMONYMS          **
// 	**********************/
// 	/* BASIC CASE: 2 homonyms */
// 	describe('with 2 homonyms', () => {
// 		const users = [
// 			{'id': 1, 'firstName': 'Lucien', 'lastName': 'Bertin'},
// 			{'id': 2, 'firstName': 'Jean-Baptiste', 'lastName': 'Beuzelin'},
// 			{'id': 3, 'firstName': 'Lucien', 'lastName': 'Bertin'},
// 			{'id': 4, 'firstName': 'Benoit', 'lastName': 'Paugam'}
// 		];

// 		const usersWithHomonyms = [
// 			{
// 				'id': 1,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'employeeNumber': 87,
// 				'legalEntity': { 'name': 'Lucca UK' },
// 				'department': { 'name': 'BU Timmi/Lucca' }
// 			},
// 			{
// 				'id': 3,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'employeeNumber': 110,
// 				'legalEntity': { 'name': 'Lucca' },
// 				'department': { 'name': 'Sales' }
// 			}
// 		];

// 		let fixture, app;

// 		beforeEach(inject([LuiUserPickerService], (service) => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;

// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.of(users));
// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.of(usersWithHomonyms));
// 		}));

// 		it('should detect that there are homonyms', fakeAsync(() => {
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				expect(homonyms.length).toBeGreaterThan(0);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));

// 		it('should flag the homonyms', fakeAsync(() => {
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonymsIds = app.users
// 					.filter(u => u.hasHomonyms)
// 					.map(u => u.id);

// 				expect(homonymsIds).toEqual([1, 3]);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));

// 		it('should fetch additional info for these homonyms via the right api', inject([LuiUserPickerService], fakeAsync((service) => {
// 			setTimeout(() => expect(service.getHomonymsProperties).toHaveBeenCalled, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));

// 		it('should fetch additional info for these homonyms and add the properties to the users', fakeAsync(() => {
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				const legalEntityProperty = homonyms[0].homonyms.find(h => h.name === 'legalEntity.name').value;
// 				expect(legalEntityProperty).toEqual(usersWithHomonyms[0].legalEntity.name);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));

// 		it('should handle errors when getting homonyms details', inject([LuiUserPickerService], fakeAsync((service) => {
// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.throw('error'));
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				expect(app.users[0].overflow).toEqual('LUIDUSERPICKER_ERR_GET_USERS');
// 				expect(app.users[0].id).toEqual(-1);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));

// 		it('should identify the first and second property as differentiating properties', inject([LuiUserPickerService], fakeAsync((service) => {
// 			const usersWithHomonyms_1 = [
// 				{
// 					'id': 1,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'no-reply@lucca.fr',
// 					'employeeNumber': 87,
// 					'legalEntity': {'name': 'Lucca UK'},
// 					'department': {'name': 'BU Timmi/Lucca'}
// 				},
// 				{
// 					'id': 3,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'no-reply@lucca.fr',
// 					'employeeNumber': 110,
// 					'legalEntity': {'name': 'Lucca'},
// 					'department': {'name': 'Sales'}
// 				}
// 			];

// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.of(usersWithHomonyms_1));
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				const homonymsProperties = homonyms[0].homonyms.map(h => h.name);
// 				expect(homonymsProperties.length).toBe(2);
// 				expect(homonymsProperties).toContain('department.name');
// 				expect(homonymsProperties).toContain('legalEntity.name');
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));

// 		it('should identify the first and last property as differentiating properties', inject([LuiUserPickerService], fakeAsync((service) => {
// 			const usersWithHomonyms_2 = [
// 				{
// 					'id': 1,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'lbertin@lucca.fr',
// 					'employeeNumber': 87,
// 					'legalEntity': {'name': 'Lucca'},
// 					'department': {'name': 'BU Timmi/Lucca'}
// 				},
// 				{
// 					'id': 3,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'lbertin2@lucca.fr',
// 					'employeeNumber': 87,
// 					'legalEntity': {'name': 'Lucca'},
// 					'department': {'name': 'Sales'}
// 				}
// 			];

// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.of(usersWithHomonyms_2));
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				const homonymsProperties = homonyms[0].homonyms.map(h => h.name);
// 				expect(homonymsProperties.length).toBe(2);
// 				expect(homonymsProperties).toContain('department.name');
// 				expect(homonymsProperties).toContain('mail');
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));

// 		it('should only identify the third property as differentiating', inject([LuiUserPickerService], fakeAsync((service) => {
// 			const usersWithHomonyms_3 = [
// 				{
// 					'id': 1,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'no-reply@lucca.fr',
// 					'employeeNumber': 87,
// 					'legalEntity': {'name': 'Lucca'},
// 					'department': {'name': 'BU Timmi/Lucca'}
// 				},
// 				{'id': 3,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'employeeNumber': 110,
// 				'legalEntity': {'name': 'Lucca'},
// 				'department': {'name': 'BU Timmi/Lucca'}
// 				}
// 			];

// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.of(usersWithHomonyms_3));
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				const homonymsProperties = homonyms[0].homonyms.map(h => h.name);

// 				expect(homonymsProperties.length).toBe(1);
// 				expect(homonymsProperties).toContain('employeeNumber');
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));
// 	});

// 	/* COMPLEX CASE: more than 2 homonyms */
// 	describe('with 4 homonyms', () => {
// 		const users = [
// 			{'id': 1, 'firstName': 'Guillaume', 'lastName': 'Allain'},
// 			{'id': 2, 'firstName': 'Elsa', 'lastName': 'Arrou-Vignod'},
// 			{'id': 3, 'firstName': 'Chloé', 'lastName': 'Azibert Yekdah'},
// 			{'id': 4, 'firstName': 'Clément', 'lastName': 'Barbotin'},
// 			{'id': 5, 'firstName': 'Lucien', 'lastName': 'Bertin'},
// 			{'id': 6, 'firstName': 'Jean-Baptiste', 'lastName': 'Beuzelin'},
// 			{'id': 7, 'firstName': 'Kevin', 'lastName': 'Brochet'},
// 			{'id': 8, 'firstName': 'Lucien', 'lastName': 'Bertin'},
// 			{'id': 9, 'firstName': 'Bruno', 'lastName': 'Catteau'},
// 			{'id': 10, 'firstName': 'Orion', 'lastName': 'Charlier'},
// 			{'id': 11, 'firstName': 'Sandrine', 'lastName': 'Conraux'},
// 			{'id': 12, 'firstName': 'Tristan', 'lastName': 'Couëtoux du Tertre'},
// 			{'id': 13, 'firstName': 'Lucien', 'lastName': 'Bertin'},
// 			{'id': 14, 'firstName': 'Larissa', 'lastName': 'De Andrade Gaulia'},
// 			{'id': 15, 'firstName': 'Christophe', 'lastName': 'Demarle'},
// 			{'id': 16, 'firstName': 'Lucien', 'lastName': 'Bertin'},
// 			{'id': 17, 'firstName': 'Nicolas', 'lastName': 'Faugout'},
// 			{'id': 18, 'firstName': 'Brice', 'lastName': 'Francois'},
// 			{'id': 19, 'firstName': 'Tristan', 'lastName': 'Goguillot'},
// 			{'id': 20, 'firstName': 'Julia', 'lastName': 'Ivanets'}
// 		];

// 		const usersWithHomonyms = [
// 			{
// 				'id': 5,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'employeeNumber': 87,
// 				'legalEntity': {'name': 'Lucca UK'},
// 				'department': {'name': 'BU Timmi/Lucca'}
// 			},
// 			{
// 				'id': 8,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'employeeNumber': 110,
// 				'legalEntity': {'name': 'Lucca'},
// 				'department': {'name': 'BU Timmi/Lucca'}
// 			},
// 			{
// 				'id': 13,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'employeeNumber': 163,
// 				'legalEntity': {'name': 'Lucca UK'},
// 				'department': {'name': 'BU Timmi/Lucca'}
// 			},
// 			{
// 				'id': 16,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'employeeNumber': 145,
// 				'legalEntity': {'name': 'Lucca UK'},
// 				'department': {'name': 'Marketing'}
// 			}
// 		];

// 		let fixture, app;

// 		beforeEach(inject([LuiUserPickerService], (service) => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;

// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.of(users));
// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.of(usersWithHomonyms));
// 		}));

// 		it('should identify the first and third property as differentiating properties', fakeAsync(() => {
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				const homonymsProperties = homonyms[0].homonyms.map(h => h.name);
// 				expect(homonymsProperties.length).toBe(2);
// 				expect(homonymsProperties).toContain('department.name');
// 				expect(homonymsProperties).toContain('legalEntity.name');
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));
// 		it('should identify the first and second property as differentiating properties', inject([LuiUserPickerService], fakeAsync((service) => {
// 			const usersWithHomonyms_1 = [
// 				{
// 					'id': 5,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'no-reply@lucca.fr',
// 					'employeeNumber': 87,
// 					'legalEntity': {'name': 'Lucca UK'},
// 					'department': {'name': 'BU Timmi/Lucca'}
// 				},
// 				{
// 					'id': 8,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'no-reply@lucca.fr',
// 					'employeeNumber': 110,
// 					'legalEntity': {'name': 'Lucca'},
// 					'department': {'name': 'BU Timmi/Lucca'}
// 				},
// 				{
// 					'id': 13,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'no-reply@lucca.fr',
// 					'employeeNumber': 163,
// 					'legalEntity': {'name': 'Lucca UK'},
// 					'department': {'name': 'Sales'}
// 				},
// 				{
// 					'id': 16,
// 					'firstName': 'Lucien',
// 					'lastName': 'Bertin',
// 					'mail': 'no-reply@lucca.fr',
// 					'employeeNumber': 145,
// 					'legalEntity': {'name': 'Lucca'},
// 					'department': {'name': 'Sales'}
// 				}
// 			];

// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.of(usersWithHomonyms_1));
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				const homonymsProperties = homonyms[0].homonyms.map(h => h.name);
// 				expect(homonymsProperties.length).toBe(2);
// 				expect(homonymsProperties).toContain('department.name');
// 				expect(homonymsProperties).toContain('legalEntity.name');
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));
// 	});

// 	/**********************
// 	** HOMONYMS WITH     **
// 	** CUSTOM PROPERTIES **
// 	**********************/
// 	describe('with homonyms and custom properties', () => {
// 		const properties = [{
// 			'label': 'Date de naissance',
// 			'name': 'birthDate'
// 		}, {
// 			'label': 'Email',
// 			'name': 'mail'
// 		}, {
// 			'label': 'Nom du manager',
// 			'name': 'manager.name'
// 		}];

// 		const users = [
// 			{ 'id': 1, 'firstName': 'Lucien', 'lastName': 'Bertin'},
// 			{ 'id': 2, 'firstName': 'Jean-Baptiste', 'lastName': 'Beuzelin' },
// 			{ 'id': 3, 'firstName': 'Lucien', 'lastName': 'Bertin' },
// 			{ 'id': 4, 'firstName': 'Benoit', 'lastName': 'Paugam' }
// 		];

// 		const usersWithHomonyms = [
// 			{
// 				'id': 1,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'manager': {'name': 'Romain Vergnory'},
// 				'birthDate': '1990-12-10T00:00:00'
// 			},
// 			{
// 				'id': 3,
// 				'firstName': 'Lucien',
// 				'lastName': 'Bertin',
// 				'mail': 'no-reply@lucca.fr',
// 				'manager': {'name': 'Benoît Paugam'},
// 				'birthDate': '1986-03-25T00:00:00'
// 			}
// 		];

// 		let fixture, app;

// 		beforeEach(inject([LuiUserPickerService], (service) => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;

// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.of(users));
// 			service.getHomonymsProperties = jasmine.createSpy('getHomonymsProperties').and.returnValue(Observable.of(usersWithHomonyms));

// 			app.homonymsProperties = properties;
// 		}));

// 		it('should identify the first and third property as differentiating properties', fakeAsync(() => {
// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				const homonyms = app.users.filter(u => u.hasHomonyms);

// 				const homonymsProperties = homonyms[0].homonyms;
// 				expect(homonymsProperties.length).toBe(2);

// 				expect(homonymsProperties[0].name).toBe('birthDate');
// 				expect(homonymsProperties[1].name).toBe('manager.name');
// 				expect(homonymsProperties[0].label).toBe('Date de naissance');
// 				expect(homonymsProperties[1].label).toBe('Nom du manager');
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		}));

// 	// TODO Vraiment utile ??
// 	// 	describe('after updating homonyms-properties', () => {
// 	// 		beforeEach(() => {
// 	// 			// flush the response related to the previous request
// 	// 			$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,birthDate,mail,manager.name/i).respond(RESPONSE_2_homonyms_details_0_2);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 		it('should update isolateScope.homonymsProperties with the new value and fetch additional info for the homonyms via the right api', function() {
// 	// 			// Update the properties
// 	// 			$scope.properties= [{
// 	// 				'label': 'Entité légale',
// 	// 				'name': 'legalEntity.name'
// 	// 			}, {
// 	// 				'label': 'Matricule',
// 	// 				'name': 'employeeNumber'
// 	// 			}];
// 	// 			// Call find with new properties
// 	// 			isolateScope.find();
// 	// 			$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users_2_homonyms);
// 	// 			// Query updated with new properties
// 	// 			$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,legalEntity.name,employeeNumber/i).respond(RESPONSE_2_homonyms_details_0_2);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 		it('should update isolateScope.homonymsProperties with default properties and fetch additional info for the homonyms via the right api', function() {
// 	// 			var defaultProperties = [{
// 	// 				'label': 'LUIDUSERPICKER_DEPARTMENT',
// 	// 				'name': 'department.name',
// 	// 				'icon': 'location'
// 	// 			}, {
// 	// 				'label': 'LUIDUSERPICKER_LEGALENTITY',
// 	// 				'name': 'legalEntity.name',
// 	// 				'icon': 'tree list'
// 	// 			}, {
// 	// 				'label': 'LUIDUSERPICKER_EMPLOYEENUMBER',
// 	// 				'name': 'employeeNumber',
// 	// 				'icon': 'user'
// 	// 			}, {
// 	// 				'label': 'LUIDUSERPICKER_MAIL',
// 	// 				'name': 'mail',
// 	// 				'icon': 'email'
// 	// 			}];
// 	// 			// Update the properties with an empty array
// 	// 			$scope.properties= [];
// 	// 			// Call find with new properties
// 	// 			isolateScope.find();
// 	// 			$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users_2_homonyms);
// 	// 			// Query updated with default properties (since new properties are empty)
// 	// 			$httpBackend.expectGET(/api\/v3\/users\?id=1,3\&fields=id,firstname,lastname,department.name,legalEntity.name,employeeNumber,mail/i).respond(RESPONSE_2_homonyms_details_0_2);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 	})
// 	});

// 	// /*********************
// 	// ** CUSTOM INFO SYNC **
// 	// **********************/
// 	describe('with custom info to display next to each user', () => {
// 		let fixture, app;

// 		beforeEach(() => {
// 			fixture = TestBed.createComponent(LuiUserPickerComponent);
// 			app = fixture.debugElement.componentInstance;

// 			app.customInfo = (user) => user.id;
// 			spyOn(app, 'customInfo').and.callThrough();
// 		});

// 		it('should initialise customInfo', () => {
// 			expect(app.customInfo).not.toBeNull();
// 		});

// 		it('should call app.customInfo N times when there is no overflow', inject([LuiUserPickerService], fakeAsync((service) => {
// 			const usersIds = [1, 2, 3, 4];
// 			const users = usersIds.map(v => ({ id: v, firstName: v.toString() }));
// 			service.getUsers = jasmine.createSpy('getUsers').and.returnValue(Observable.of(users));

// 			fixture.detectChanges();

// 			setTimeout(() => {
// 				expect(app.customInfo).toHaveBeenCalled();
// 				expect(app.customInfo.calls.count()).toBe(4);
// 			}, INPUT_DEBOUNCE);
// 			tick(INPUT_DEBOUNCE);
// 		})));

// 	// 	it('should call $scope.customCount 5 times when there is overflow', () => {
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.flush();
// 	// 		expect($scope.customCount).toHaveBeenCalled();
// 	// 		expect($scope.customCount.calls.count()).toBe(10);
// 	// 	});
// 	// 	it('should display the right count', function() {
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.flush();
// 	// 		var customInfos = _.chain(isolateScope.users)
// 	// 			.pluck('info')
// 	// 			.first(5) // we exclude the overflow message
// 	// 			.value();
// 	// 		expect(customInfos).toEqual([2,4,6,8,10]);
// 	// 	});
// 	// 	it('should call $scope.customInfo to fetch one more info when we do not select one of the first 5 users and we unselect him', function() {
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_end);
// 	// 		$httpBackend.flush();
// 	// 		expect($scope.customCount).toHaveBeenCalled();
// 	// 		expect($scope.customCount.calls.count()).toBe(4);

// 	// 		$scope.myUser = _.findWhere(isolateScope.users, {id: 18});
// 	// 		isolateScope.find();
// 	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.flush();
// 	// 		expect($scope.customCount).toHaveBeenCalled();
// 	// 		expect($scope.customCount.calls.count()).toBe(14);

// 	// 		$scope.myUser = _.findWhere($scope.users, {id: 3});
// 	// 		$scope.$digest();
// 	// 		expect($scope.customCount).toHaveBeenCalled();
// 	// 		expect($scope.customCount.calls.count()).toBe(15); // fetch info for the 5th user
// 	// 	});
// 	});

// 	// /**********************
// 	// ** CUSTOM INFO ASYNC **
// 	// ***********************/
// 	// describe('with custom info async to display next to each user', () => {
// 	// 	beforeEach(() => {
// 	// 		$scope.customCountAsync = function(user) {
// 	// 		};
// 	// 		$scope.myUser = {};
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='myUser' custom-info-async='customCountAsync'></luid-user-picker>');
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		controller = elt.controller('luidUserPicker');
// 	// 		$scope.$digest();

// 	// 		spyOn($scope, 'customCountAsync').and.returnValue($q.when({}));
// 	// 		isolateScope.find();
// 	// 	});
// 	// 	it('should initialise useCustomCount', () => {
// 	// 		expect(controller.displayCustomInfo).toBe(true);
// 	// 	});
// 	// 	it('should call $scope.customCountAsync N times when there is no overflow', () => {
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users);
// 	// 		$httpBackend.flush();
// 	// 		expect($scope.customCountAsync).toHaveBeenCalled();
// 	// 		expect($scope.customCountAsync.calls.count()).toBe(4);
// 	// 	});
// 	// 	it('should call $scope.customCountAsync 5 times when there is overflow', () => {
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.flush();
// 	// 		expect($scope.customCountAsync).toHaveBeenCalled();
// 	// 		expect($scope.customCountAsync.calls.count()).toBe(10);
// 	// 	});
// 	// 	it('should call $scope.customInfoAsync to fetch one more info when we do not select one of the first 5 users and we unselect him', function() {
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_end);
// 	// 		$httpBackend.flush();
// 	// 		expect($scope.customCountAsync).toHaveBeenCalled();
// 	// 		expect($scope.customCountAsync.calls.count()).toBe(4);

// 	// 		$scope.myUser = _.findWhere(isolateScope.users, {id: 18});
// 	// 		isolateScope.find();
// 	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.flush();
// 	// 		expect($scope.customCountAsync).toHaveBeenCalled();
// 	// 		expect($scope.customCountAsync.calls.count()).toBe(14); // 4 previous call + 10 calls in find()

// 	// 		$scope.myUser = _.findWhere($scope.users, {id: 3});
// 	// 		$scope.$digest();
// 	// 		expect($scope.customCountAsync).toHaveBeenCalled();
// 	// 		expect($scope.customCountAsync.calls.count()).toBe(15); // fetch info for the 5th user
// 	// 	});
// 	// });

// 	// /********************************
// 	// ** DISPLAY SELECTED USER FIRST **
// 	// ********************************/
// 	// describe('with selected user', () => {
// 	// 	var chloe = { id:3,
// 	// 		firstName:'Chloé',
// 	// 		lastName:'Azibert Yekdah'
// 	// 	};
// 	// 	var sandrine = { id:11,
// 	// 		firstName:'Sandrine',
// 	// 		lastName:'Conraux'
// 	// 	};
// 	// 	beforeEach(() => {
// 	// 		$scope.myUser = chloe;
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='myUser'></luid-user-picker>');
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();
// 	// 		isolateScope.find();
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.flush();
// 	// 	});
// 	// 	it('should call reorderUsers() when myUser is updated', () => {
// 	// 		spyOn(isolateScope, 'reorderUsers');
// 	// 		$scope.myUser = sandrine;
// 	// 		$scope.$digest();

// 	// 		expect(isolateScope.reorderUsers).toHaveBeenCalled();
// 	// 	});
// 	// 	it('should flag if the list of users returned by find contains the current myUser', () => {
// 	// 		expect(_.where(isolateScope.users, {isSelected:true}).length).toBe(1);
// 	// 		expect(_.first(isolateScope.users).isSelected).toBe(true);
// 	// 		expect(_.where(isolateScope.users, {isSelected:true})[0].id).toBe(chloe.id);
// 	// 	});
// 	// 	it('should have the right order of displayed users', () => {
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([3,1,2,4,5,6,7,8,9,10,-1]); // the -1 is because of the overflow
// 	// 	});
// 	// 	it('should update the selected one ', () => {
// 	// 		$scope.myUser = sandrine;
// 	// 		$scope.$digest();
// 	// 		expect(_.where(isolateScope.users, {isSelected:true}).length).toBe(1);
// 	// 		expect(_.first(isolateScope.users).isSelected).toBe(true);
// 	// 		expect(_.where(isolateScope.users, {isSelected:true})[0].id).toBe(sandrine.id);
// 	// 	});
// 	// 	it('should update the order of users ', () => {
// 	// 		$scope.myUser = sandrine;
// 	// 		$scope.$digest();
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([11,1,2,3,4,5,6,7,8,9,-1]); // the -1 is because of the overflow
// 	// 	});
// 	// });

// 	// /***********************
// 	// ** DISPLAY ME FIRST   **
// 	// ***********************/
// 	// describe('with 'display-me-first' set to true', () => {
// 	// 	var chloe = { id:3,
// 	// 		firstName:'Chloé',
// 	// 		lastName:'Azibert Yekdah'
// 	// 	};
// 	// 	var orion = { id:10,
// 	// 		firstName:'Orion',
// 	// 		lastName:'Charlier'
// 	// 	};
// 	// 	var meApi = /api\/v3\/users\/me/;
// 	// 	var myId = 10;
// 	// 	beforeEach(() => {
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='myUser' display-me-first='true'></luid-user-picker>');
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();
// 	// 		isolateScope.find();
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.whenGET(meApi).respond(200, RESPONSE_me); // id: 10
// 	// 	});
// 	// 	it('should flag if the list of users returned by find contains 'me'', function() {
// 	// 		$httpBackend.flush();
// 	// 		expect(_.where(isolateScope.users, {isMe:true}).length).toBe(1);
// 	// 		expect(_.first(isolateScope.users).isMe).toBe(true);
// 	// 		expect(_.where(isolateScope.users, {isMe:true})[0].id).toBe(myId);
// 	// 	});
// 	// 	it('should have the right order of displayed users when no user is selected', () => {
// 	// 		$httpBackend.flush();
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([10,1,2,3,4,5,6,7,8,9,-1]); // the -1 is because of the overflow
// 	// 	});
// 	// 	it('should update the order of users when a user is selected', function() {
// 	// 		$httpBackend.flush();
// 	// 		$scope.myUser = chloe;
// 	// 		$scope.$digest();
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([3,10,1,2,4,5,6,7,8,9,-1]); // the -1 is because of the overflow
// 	// 	});
// 	// 	it('should not display 'me' when the selected user is 'me'', function() {
// 	// 		$httpBackend.flush();
// 	// 		$scope.myUser = orion;
// 	// 		$scope.$digest();
// 	// 		expect(_.where(isolateScope.users, {isMe:true}).length).toBe(0);
// 	// 	});
// 	// 	it('should not display 'me' when the current user is not fetched', function() {
// 	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users); // Users without user.id = 10
// 	// 		$httpBackend.flush();
// 	// 		expect(_.where(isolateScope.users, {isMe:true}).length).toBe(0);
// 	// 	});
// 	// 	it('should handle errors when getting 'me'', () => {
// 	// 		spyOn(console, 'log');
// 	// 		$httpBackend.expectGET(meApi).respond(500, RESPONSE_ERROR_DETAILS);
// 	// 		$httpBackend.flush();
// 	// 		expect(console.log).toHaveBeenCalled();
// 	// 	});
// 	// });

// 	// /************************
// 	// ** DISPLAY ALL USERS   **
// 	// ************************/
// 	// describe('with 'display-all-users' set to true', () => {
// 	// 	var chloe = { id:3,
// 	// 		firstName:'Chloé',
// 	// 		lastName:'Azibert Yekdah'
// 	// 	};
// 	// 	var allUsers = { id:-1,
// 	// 		isAll: true
// 	// 	};
// 	// 	beforeEach(() => {
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='myUser' display-all-users='true'></luid-user-picker>');
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();
// 	// 		isolateScope.find();
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.flush();
// 	// 	});
// 	// 	it('should display 'all users' when find() is called', function() {
// 	// 		expect(_.where(isolateScope.users, {isAll:true}).length).toBe(1);
// 	// 		expect(_.first(isolateScope.users).isAll).toBe(true);
// 	// 	});
// 	// 	it('should have the right order of displayed users when no user is selected', function() {
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([-1,1,2,3,4,5,6,7,8,9,-1]); // the -1 is because of 'all users' and overflow
// 	// 	});
// 	// 	it('should update the order of users when a user is selected', function() {
// 	// 		$scope.myUser = chloe;
// 	// 		$scope.$digest();
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(_.where(isolateScope.users, {isAll:true}).length).toBe(1);
// 	// 		expect(isolateScope.users[1].isAll).toBe(true);
// 	// 		expect(userIds).toEqual([3,-1,1,2,4,5,6,7,8,9,-1]); // the -1 is because of 'all users' and overflow
// 	// 	});
// 	// 	it('should not display 'selected' when we select 'all users'', function() {
// 	// 		$scope.myUser = allUsers;
// 	// 		$scope.$digest();
// 	// 		expect(_.where(isolateScope.users, {isSelected:true}).length).toBe(0);
// 	// 	});
// 	// 	it('should not display 'all users' when find() is called with a clue', function() {
// 	// 		isolateScope.find('a');
// 	// 		$httpBackend.expectGET(findApi).respond(200, RESPONSE_4_users);
// 	// 		$httpBackend.flush();
// 	// 		expect(_.where(isolateScope.users, {isAll:true}).length).toBe(0);
// 	// 	});
// 	// });

// 	// /****************************
// 	// ** WITH DISPLAY ME FIRST   **
// 	// ** AND DISPLAY ALL USERS   **
// 	// *****************************/
// 	// // Only check the order of displayed users with 'display-me-first' and 'display-all-users'
// 	// // It should be [selected, all, me, rest of users]
// 	// describe('with 'display-me-first' and 'display-all-users' set to true', () => {
// 	// 	var chloe = { id:3,
// 	// 		firstName:'Chloé',
// 	// 		lastName:'Azibert Yekdah'
// 	// 	};
// 	// 	var allUsers = { id:-1,
// 	// 		isAll: true
// 	// 	};
// 	// 	var meApi = /api\/v3\/users\/me/;
// 	// 	var myId = 10;
// 	// 	beforeEach(() => {
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='myUser' display-me-first='true' display-all-users='true'></luid-user-picker>');
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();
// 	// 		isolateScope.find();
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.whenGET(meApi).respond(200, RESPONSE_me); // id: 10
// 	// 		$httpBackend.flush();
// 	// 	});
// 	// 	it('should display 'all users' and 'me' when find() is called and 'me' is fetched', function() {
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([-1,10,1,2,3,4,5,6,7,8,-1]); // the -1 is because of 'all users' and overflow
// 	// 	});
// 	// 	it('should update the order of users when a user is selected', function() {
// 	// 		$scope.myUser = chloe;
// 	// 		$scope.$digest();
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([3,-1,10,1,2,4,5,6,7,8,-1]); // the -1 is because of 'all users' and overflow
// 	// 	});
// 	// });

// 	// /**********************
// 	// ** MULTISELECT       **
// 	// **********************/
// 	// describe('with multi-select', function() {
// 	// 	beforeEach(() => {
// 	// 		var tpl = angular.element('<luid-user-picker-multiple ng-model='myUsers'></luid-user-picker-multiple>');
// 	// 		$scope.myUsers = [];

// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();

// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		isolateScope.find();
// 	// 		$httpBackend.flush();
// 	// 	});
// 	// 	it('should have removed from isolateScope.users the ones from $scope.myUsers to avoid displaying an already selected user', function() {
// 	// 		$scope.myUsers.push({'id':4,'firstName':'Clément','lastName':'Barbotin'}, {'id':7,'firstName':'Kevin','lastName':'Brochet'});
// 	// 		$scope.$digest();
// 	// 		expect(_.every($scope.myUsers, function(selectedUser) {
// 	// 			return !_.contains(_.pluck(isolateScope.users, 'id'), selectedUser.id);
// 	// 		})).toBe(true);
// 	// 	});

// 	// 	it('should call reorderUsers when selected users changed', function() {
// 	// 		spyOn(isolateScope, 'reorderUsers');
// 	// 		$scope.myUsers.push({'id':4,'firstName':'Clément','lastName':'Barbotin'});
// 	// 		$scope.$digest();
// 	// 		expect(isolateScope.reorderUsers).toHaveBeenCalled();

// 	// 		$scope.myUsers = [];
// 	// 		$scope.$digest();
// 	// 		expect(isolateScope.reorderUsers).toHaveBeenCalled();
// 	// 	});

// 	// 	describe('when selecting among the 5 first users', function() {
// 	// 		it('should update displayed users', function() {
// 	// 			$scope.myUsers.push({'id':4,'firstName':'Clément','lastName':'Barbotin'});
// 	// 			$scope.$digest();
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10, 11, -1]);

// 	// 			$scope.myUsers.push({'id':3,'firstName':'Chloé','lastName':'Azibert Yekdah'});
// 	// 			$scope.$digest();
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, -1]);

// 	// 			$scope.myUsers = _.rest($scope.myUsers, 1); // Only keep the last selected user (id = 3)
// 	// 			$scope.$digest();
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 4, 5, 6, 7, 8, 9, 10, 11, -1]);
// 	// 		});
// 	// 	});

// 	// 	describe('when calling find() between each selected user', function() {
// 	// 		beforeEach(function() {
// 	// 			isolateScope.find('a');
// 	// 			$httpBackend.expectGET(findApiWithClue).respond(200, RESPONSE_4_users_end);
// 	// 			$httpBackend.flush();
// 	// 			$scope.$digest();
// 	// 		});
// 	// 		it('should update displayed users', function() {
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([17, 18, 19, 20]);
// 	// 			$scope.myUsers.push({'id':18,'firstName':'Brice','lastName':'Francois'});

// 	// 			isolateScope.find('a');
// 	// 			$httpBackend.expectGET(findApiWithClue).respond(200, RESPONSE_4_users_end);
// 	// 			$httpBackend.flush();
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([17, 19, 20]);

// 	// 			$scope.myUsers = _.rest($scope.myUsers, 1); // Only keep the last selected user (id = 18)
// 	// 			isolateScope.find('a');
// 	// 			$httpBackend.expectGET(findApiWithClue).respond(200, RESPONSE_4_users_end);
// 	// 			$httpBackend.flush();
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([17, 18, 19, 20]);
// 	// 		});
// 	// 	});

// 	// 	describe('when selecting one of the 5 first users and calling find() after', function() {
// 	// 		beforeEach(function() {
// 	// 			$scope.myUsers.push({'id':4,'firstName':'Clément','lastName':'Barbotin'});
// 	// 			$scope.$digest;
// 	// 		});
// 	// 		it('should update displayed users', function() {
// 	// 			isolateScope.find('a');
// 	// 			$httpBackend.expectGET(findApiWithClue).respond(200, RESPONSE_4_users_end);
// 	// 			$httpBackend.flush();
// 	// 			$scope.myUsers.push({'id':18,'firstName':'Brice','lastName':'Francois'});

// 	// 			isolateScope.find();
// 	// 			$httpBackend.flush();
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10, 11, -1]);

// 	// 			$scope.myUsers = _.rest($scope.myUsers, 1); // Only keep the last selected user (id = 18)
// 	// 			$scope.$digest();
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1]);
// 	// 		});
// 	// 	});
// 	// });

// 	// /**********************
// 	// ** MULTISELECT WITH  **
// 	// ** HOMONYMS SELECTED **
// 	// **********************/
// 	// describe('with multi-select and homonyms', function() {
// 	// 	beforeEach(() => {
// 	// 		var tpl = angular.element('<luid-user-picker-multiple ng-model='myUsers'></luid-user-picker-multiple>');
// 	// 		$scope.myUsers = [];

// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();

// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_4_users_2_homonyms);
// 	// 		$httpBackend.whenGET(/api\/v3\/users\?id=1,3\&fields=.*/i).respond(200, RESPONSE_2_homonyms_details_0_1);
// 	// 		isolateScope.find();
// 	// 		$httpBackend.flush();
// 	// 	});
// 	// 	it('should flag homonyms from $scope.users union isolateScope.users', () => {
// 	// 		// Check that the homonyms sent back in the api response are flagged as homonyms
// 	// 		var homonymIds = _.chain(isolateScope.users)
// 	// 		.where({hasHomonyms:true}) // keep only the one having an homonym
// 	// 		.pluck('id') // just keep their id
// 	// 		.value();
// 	// 		expect(homonymIds).toEqual([1, 3]);

// 	// 		// Select first user
// 	// 		$scope.myUsers.push(_.findWhere(isolateScope.users, {id: 1}));
// 	// 		$scope.$digest();

// 	// 		// Still display homonyms properties for selected users
// 	// 		expect($scope.myUsers[0].hasHomonyms).toBe(true);
// 	// 		var homonymIds = _.chain(isolateScope.users)
// 	// 		.where({hasHomonyms:true}) // keep only the one having an homonym
// 	// 		.pluck('id') // just keep their id
// 	// 		.value();
// 	// 		expect(homonymIds).toEqual([3]);
// 	// 	});
// 	// });

// 	// /***********************
// 	// ** MULTISELECT WITH   **
// 	// ** DISPLAY ME FIRST   **
// 	// ***********************/
// 	// describe('with multi-select and 'display-me-first' set to true', function() {
// 	// 	var orion = { id:10,
// 	// 		firstName:'Orion',
// 	// 		lastName:'Charlier'
// 	// 	};
// 	// 	var meApi = /api\/v3\/users\/me/;
// 	// 	var myId = 10;
// 	// 	beforeEach(() => {
// 	// 		var tpl = angular.element('<luid-user-picker-multiple ng-model='myUsers' display-me-first='true'></luid-user-picker-multiple>');

// 	// 		$scope.myUsers = [];
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();

// 	// 		isolateScope.find();
// 	// 		$httpBackend.whenGET(findApi).respond(200, RESPONSE_20_users);
// 	// 		$httpBackend.whenGET(meApi).respond(200, RESPONSE_me); // id: 10
// 	// 	});
// 	// 	it('should have the right order of displayed users when no user is selected', () => {
// 	// 		$httpBackend.flush();
// 	// 		var userIds = _.pluck(isolateScope.users, 'id');
// 	// 		expect(userIds).toEqual([10,1,2,3,4,5,6,7,8,9,-1]); // the -1 is because of the overflow
// 	// 	});
// 	// 	it('should not display 'me' when 'me' is selected', function() {
// 	// 		$httpBackend.flush();
// 	// 		$scope.myUsers.push(orion);
// 	// 		$scope.$digest();
// 	// 		expect(_.every(isolateScope.users, function(user) {
// 	// 			return !user.isMe;
// 	// 		})).toBe(true);
// 	// 	});
// 	// });

// 	// /**************************
// 	// ** CUSTOM HTTP SERVICE   **
// 	// ***************************/
// 	// describe('with customHttpService', () => {
// 	// 	var chloe = { id:3,
// 	// 		firstName:'Chloé',
// 	// 		lastName:'Azibert Yekdah'
// 	// 	};
// 	// 	var customHttpService = {
// 	// 		get: function(query){
// 	// 			return $q.defer().promise;
// 	// 		}
// 	// 	};
// 	// 	var meApi = /api\/v3\/users\/me/;
// 	// 	it('should call the given 'get' method', function() {
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='chloe' custom-http-service='customHttpService'></luid-user-picker>');
// 	// 		$scope.customHttpService = customHttpService;
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		spyOn($scope.customHttpService, 'get').and.callThrough();
// 	// 		isolateScope.find();
// 	// 		$scope.$digest();
// 	// 		expect($scope.customHttpService.get).toHaveBeenCalled();
// 	// 	});
// 	// 	it('should call the $http 'get' method if no CustomHttpService', function() {
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='chloe'></luid-user-picker>');
// 	// 		$scope.customHttpService = customHttpService;
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		spyOn($scope.customHttpService, 'get').and.callThrough();
// 	// 		isolateScope.find();
// 	// 		expect($scope.customHttpService.get).not.toHaveBeenCalled();
// 	// 	});
// 	// 	describe('and homonyms', function() {
// 	// 		it('should still not call $http.get', () => {
// 	// 			var tpl = angular.element('<luid-user-picker ng-model='chloe' custom-http-service='customHttpService'></luid-user-picker>');
// 	// 			$scope.customHttpService = {
// 	// 				get: function(query){
// 	// 					var deferred = $q.defer();
// 	// 					deferred.resolve({data: RESPONSE_20_users_4_homonyms});
// 	// 					return deferred.promise;
// 	// 				}
// 	// 			};
// 	// 			spyOn($scope.customHttpService, 'get').and.callThrough();
// 	// 			elt = $compile(tpl)($scope);
// 	// 			isolateScope = elt.isolateScope();
// 	// 			expect($scope.customHttpService.get.calls.count()).toEqual(0);
// 	// 			isolateScope.find();
// 	// 			$scope.$digest();
// 	// 			expect($scope.customHttpService.get.calls.count()).toEqual(2); // Find + homonyms
// 	// 		});
// 	// 	});
// 	// 	describe('and with me', function() {
// 	// 		it('should still not call $http.get', () => {
// 	// 			var tpl = angular.element('<luid-user-picker ng-model='chloe' display-me-first='true' custom-http-service='customHttpService'></luid-user-picker>');
// 	// 			$scope.customHttpService = customHttpService;
// 	// 			spyOn($scope.customHttpService, 'get').and.callThrough();
// 	// 			elt = $compile(tpl)($scope);
// 	// 			isolateScope = elt.isolateScope();
// 	// 			expect($scope.customHttpService.get.calls.count()).toEqual(0);
// 	// 			isolateScope.find();
// 	// 			$scope.$digest();
// 	// 			expect($scope.customHttpService.get.calls.count()).toEqual(2); // Find + Display-me
// 	// 		});
// 	// 	});
// 	// });

// 	// /****************************
// 	// ** BYPASS OPERATIONS FOR   **
// 	// ****************************/
// 	// describe('with bypassOperationsFor', function() {
// 	// 	beforeEach(() => {
// 	// 		$scope.ops = [1,2,3];
// 	// 		$scope.appId = 86;
// 	// 		$scope.idsToBypass = [5, 7];
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='myUser' bypass-operations-for='idsToBypass' operations='ops' app-id='appId'></luid-user-picker>');

// 	// 		$scope.myUser = {};
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();

// 	// 		isolateScope.find();
// 	// 	});
// 	// 	it('should send one more request without operations filter', function() {
// 	// 		$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000\&appinstanceid=86\&operations=1,2,3/i).respond(200, RESPONSE_4_users);
// 	// 		$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000/i).respond(200, RESPONSE_20_users);
// 	// 		expect($httpBackend.flush).not.toThrow();
// 	// 	});
// 	// 	describe('when the 2 users does not have access to the operations but should be displayed at the end of the list', function() {
// 	// 		beforeEach(function() {
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000\&appinstanceid=86\&operations=1,2,3/i).respond(200, RESPONSE_3_users);
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000/i).respond(200, RESPONSE_20_users);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 		it('should add users to the list of displayed users in the right position', function() {
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 3, 5, 7]);
// 	// 		});
// 	// 	});
// 	// 	describe('when the 2 users does not have access to the operations but should be displayed at the beginning of the list', function() {
// 	// 		beforeEach(function() {
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000\&appinstanceid=86\&operations=1,2,3/i).respond(200, RESPONSE_4_users_end);
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000/i).respond(200, RESPONSE_20_users);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 		it('should add users to the list of displayed users in the right position', function() {
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([5, 7, 17, 18, 19, 20]);
// 	// 		});
// 	// 	});
// 	// 	describe('when the 2 users have access to the operations', function() {
// 	// 		beforeEach(function() {
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000\&appinstanceid=86\&operations=1,2,3/i).respond(200, RESPONSE_20_users);
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000/i).respond(200, RESPONSE_20_users);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 		it('should not update the order of displayed users', function() {
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1]);
// 	// 		});
// 	// 	});
// 	// 	describe('when the 2 users does not have access to the operations and should not be displayed', function() {
// 	// 		beforeEach(function() {
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000\&appinstanceid=86\&operations=1,2,3/i).respond(200, RESPONSE_4_users);
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000/i).respond(200, RESPONSE_4_users);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 		it('should not add users to the list of displayed users', function() {
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 3, 4]);
// 	// 		});
// 	// 	});
// 	// 	describe('when the 2 users does not have access to the operations but one of them should be displayed', function() {
// 	// 		beforeEach(function() {
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000\&appinstanceid=86\&operations=1,2,3/i).respond(200, RESPONSE_4_users);
// 	// 			$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false\&limit=10000/i).respond(200, RESPONSE_1_user);
// 	// 			$httpBackend.flush();
// 	// 		});
// 	// 		it('should add the user to the list of displayed users', function() {
// 	// 			expect(_.pluck(isolateScope.users, 'id')).toEqual([1, 2, 3, 4, 7]);
// 	// 		});
// 	// 	});
// 	// });

// 	// /****************************
// 	// ** SHOW FORMER EMPLOYEES   **
// 	// ****************************/
// 	// describe('with showFormerEmployees', function() {
// 	// 	var findApiWithoutClue = /api\/v3\/users\/find\?/;
// 	// 	var withoutFormerEmployeesFilter = /formerEmployees=false\&limit=\d*/;
// 	// 	var withFormerEmployeesFilter = /formerEmployees=true\&limit=\d*/;

// 	// 	beforeEach(() => {
// 	// 		$scope.showFormerEmployees = false;
// 	// 		var tpl = angular.element('<luid-user-picker ng-model='myUser' show-former-employees='showFormerEmployees'></luid-user-picker>');
// 	// 		elt = $compile(tpl)($scope);
// 	// 		isolateScope = elt.isolateScope();
// 	// 		$scope.$digest();
// 	// 	});
// 	// 	it('should call the api with the right filters when showFormerEmployees attribute changes', () => {
// 	// 		$httpBackend.expectGET(new RegExp(findApiWithoutClue.source + withoutFormerEmployeesFilter.source)).respond(200, RESPONSE_0_users);
// 	// 		isolateScope.find();
// 	// 		expect($httpBackend.flush).not.toThrow();
// 	// 		// Update showFormerEmployees property
// 	// 		$scope.showFormerEmployees = true;
// 	// 		$httpBackend.expectGET(new RegExp(findApiWithoutClue.source + withFormerEmployeesFilter.source)).respond(200, RESPONSE_0_users);
// 	// 		$scope.$digest();
// 	// 		expect($httpBackend.flush).not.toThrow();
// 	// 	});
// 	// });

// 	// Not implemented yet
// 	// describe('pagination', () => {
// 	// 	it('onSelect should update the pagination label', () => {});
// 	// 	it('onRemove should update the pagination label', () => {});
// 	// });

// 	// responses from api
// 	const RESPONSE_userWhoseNameBeginsWithBe = {'header':{},'data':{'items':[{'id':401,'firstName':'Jean-Baptiste','lastName':'Beuzelin','employeeNumber':'3','mail':'no-reply@lucca.fr','dtContractEnd':null},{'id':416,'firstName':'Benoit','lastName':'Paugam','employeeNumber':'00057','mail':'no-reply@lucca.fr','dtContractEnd':null},{'id':421,'firstName':'Lucien','lastName':'Bertin','employeeNumber':'00068','mail':'no-reply@lucca.fr','dtContractEnd':null}]}};
// 	const RESPONSE_initWithoutFormerEmployees = {'header':{},'data':{'items':[{'id':0,'name':'Lucca Admin','firstName':'Lucca','lastName':'Admin'},{'id':328,'name':'Gilles Satgé','firstName':'Gilles','lastName':'Satgé'},{'id':329,'name':'Frédéric Pot','firstName':'Frédéric','lastName':'Pot'},{'id':338,'name':'Bruno Catteau','firstName':'Bruno','lastName':'Catteau'},{'id':344,'name':'Nicolas Faugout','firstName':'Nicolas','lastName':'Faugout'},{'id':353,'name':'Guillaume Allain','firstName':'Guillaume','lastName':'Allain'}]}};
// 	const RESPONSE_initCount = {'header':{},'data':{'count':51,'items':[]}};

// 	// Me
// 	const RESPONSE_me = {'header':{},'data':{'id':10}};
// 	// N users, no former employees, no homonyms
// 	const RESPONSE_0_users = {header:{}, data:{items:[]}};
// 	const RESPONSE_3_users = {'header':{},'data':{'items':[{'id':1,'firstName':'Guillaume','lastName':'Allain'},{'id':2,'firstName':'Elsa','lastName':'Arrou-Vignod'},{'id':3,'firstName':'Chloé','lastName':'Azibert Yekdah'}]}};
// 	const RESPONSE_4_users = {'header':{},'data':{'items':[{'id':1,'firstName':'Guillaume','lastName':'Allain'},{'id':2,'firstName':'Elsa','lastName':'Arrou-Vignod'},{'id':3,'firstName':'Chloé','lastName':'Azibert Yekdah'},{'id':4,'firstName':'Clément','lastName':'Barbotin'}]}};
// 	const RESPONSE_20_users = {'header':{},'data':{'items':[{'id':1,'firstName':'Guillaume','lastName':'Allain'},{'id':2,'firstName':'Elsa','lastName':'Arrou-Vignod'},{'id':3,'firstName':'Chloé','lastName':'Azibert Yekdah'},{'id':4,'firstName':'Clément','lastName':'Barbotin'},{'id':5,'firstName':'Lucien','lastName':'Bertin'},{'id':6,'firstName':'Jean-Baptiste','lastName':'Beuzelin'},{'id':7,'firstName':'Kevin','lastName':'Brochet'},{'id':8,'firstName':'Alex','lastName':'Carpentieri'},{'id':9,'firstName':'Bruno','lastName':'Catteau'},{'id':10,'firstName':'Orion','lastName':'Charlier'},{'id':11,'firstName':'Sandrine','lastName':'Conraux'},{'id':12,'firstName':'Tristan','lastName':'Couëtoux du Tertre'},{'id':13,'firstName':'Patrick','lastName':'Dai'},{'id':14,'firstName':'Larissa','lastName':'De Andrade Gaulia'},{'id':15,'firstName':'Christophe','lastName':'Demarle'},{'id':16,'firstName':'Manon','lastName':'Desbordes'},{'id':17,'firstName':'Nicolas','lastName':'Faugout'},{'id':18,'firstName':'Brice','lastName':'Francois'},{'id':19,'firstName':'Tristan','lastName':'Goguillot'},{'id':20,'firstName':'Julia','lastName':'Ivanets'}]}};
// 	const RESPONSE_4_users_end = {'header':{},'data':{'items':[{'id':17,'firstName':'Nicolas','lastName':'Faugout'},{'id':18,'firstName':'Brice','lastName':'Francois'},{'id':19,'firstName':'Tristan','lastName':'Goguillot'},{'id':20,'firstName':'Julia','lastName':'Ivanets'}]}};
// 	const RESPONSE_1_user = {'header':{},'data':{'items':[{'id':7,'firstName':'Kevin','lastName':'Brochet'}]}};

// 	// N users, SOME former employees, no homonyms
// 	const RESPONSE_4_users_FE = {header:{}, data:{items:[{'id': 1,'firstName': 'Frédéric','lastName': 'Pot','dtContractEnd': null},{'id': 2,'firstName': 'Catherine','lastName': 'Foliot','dtContractEnd': '2003-06-30T00:00:00'},{'id': 3,'firstName': 'Catherine','lastName': 'Lenzi','dtContractEnd': '2003-04-28T00:00:00'},{'id': 4,'firstName': 'Bruno','lastName': 'Catteau','dtContractEnd': null}]}};
// 	const RESPONSE_20_users_FE = {header:{}, data:{items:[]}};

// 	// N users, no former employees, SOME homonyms
// 	const RESPONSE_4_users_2_homonyms = {'header':{},'data':{'items':[{'id':1,'firstName':'Lucien','lastName':'Bertin'},{'id':2,'firstName':'Jean-Baptiste','lastName':'Beuzelin'},{'id':3,'firstName':'Lucien','lastName':'Bertin'},{'id':4,'firstName':'Benoit','lastName':'Paugam'}]}};
// 	const RESPONSE_20_users_4_homonyms = {'header':{},'data':{'items':[{'id':1,'firstName':'Guillaume','lastName':'Allain'},{'id':2,'firstName':'Elsa','lastName':'Arrou-Vignod'},{'id':3,'firstName':'Chloé','lastName':'Azibert Yekdah'},{'id':4,'firstName':'Clément','lastName':'Barbotin'},{'id':5,'firstName':'Lucien','lastName':'Bertin'},{'id':6,'firstName':'Jean-Baptiste','lastName':'Beuzelin'},{'id':7,'firstName':'Kevin','lastName':'Brochet'},{'id':8,'firstName':'Lucien','lastName':'Bertin'},{'id':9,'firstName':'Bruno','lastName':'Catteau'},{'id':10,'firstName':'Orion','lastName':'Charlier'},{'id':11,'firstName':'Sandrine','lastName':'Conraux'},{'id':12,'firstName':'Tristan','lastName':'Couëtoux du Tertre'},{'id':13,'firstName':'Lucien','lastName':'Bertin'},{'id':14,'firstName':'Larissa','lastName':'De Andrade Gaulia'},{'id':15,'firstName':'Christophe','lastName':'Demarle'},{'id':16,'firstName':'Lucien','lastName':'Bertin'},{'id':17,'firstName':'Nicolas','lastName':'Faugout'},{'id':18,'firstName':'Brice','lastName':'Francois'},{'id':19,'firstName':'Tristan','lastName':'Goguillot'},{'id':20,'firstName':'Julia','lastName':'Ivanets'}]}};

// 	// N users, SOME former employees, SOME homonyms
// 	const RESPONSE_4_users_FE_homonyms = {header:{}, data:{items:[]}};
// 	const RESPONSE_20_users_FE_homonyms = {header:{}, data:{items:[]}};

// 	// Details on homonyms
// 	// When 2 homonyms
// 	const RESPONSE_2_homonyms_details_0_1 = {header:{}, data:{items:[{'id':1,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca UK'},'department':{'name':'BU Timmi/Lucca'}},{'id':3,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':110,'legalEntity':{'name':'Lucca'},'department':{'name':'Sales'}}]}};
// 	const RESPONSE_2_homonyms_details_0_3 = {header:{}, data:{items:[{'id':1,'firstName':'Lucien','lastName':'Bertin','mail':'lbertin@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca'},'department':{'name':'BU Timmi/Lucca'}},{'id':3,'firstName':'Lucien','lastName':'Bertin','mail':'lbertin2@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca'},'department':{'name':'Sales'}}]}};
// 	const RESPONSE_2_homonyms_details_2 = {header:{}, data:{items:[{'id':1,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca'},'department':{'name':'BU Timmi/Lucca'}},{'id':3,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':110,'legalEntity':{'name':'Lucca'},'department':{'name':'BU Timmi/Lucca'}}]}};
// 	// With custom homonyms properties
// 	const RESPONSE_2_homonyms_details_0_2 = {header:{}, data:{items:[{'id':1,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','manager':{'name':'Romain Vergnory'},'birthDate':'1990-12-10T00:00:00'},{'id':3,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','manager':{'name':'Benoît Paugam'},'birthDate':'1986-03-25T00:00:00'}]}};
// 	// With other custom properties
// 	// When 4 homonyms
// 	const RESPONSE_4_homonyms_details_0_2 = {header:{}, data:{items:[{'id':5,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca UK'},'department':{'name':'BU Timmi/Lucca'}},{'id':8,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':110,'legalEntity':{'name':'Lucca'},'department':{'name':'BU Timmi/Lucca'}},{'id':13,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':163,'legalEntity':{'name':'Lucca UK'},'department':{'name':'BU Timmi/Lucca'}},{'id':16,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':145,'legalEntity':{'name':'Lucca UK'},'department':{'name':'Marketing'}}]}};
// 	const RESPONSE_4_homonyms_details_0_1 = {header:{}, data:{items:[{'id':5,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca UK'},'department':{'name':'BU Timmi/Lucca'}},{'id':8,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':110,'legalEntity':{'name':'Lucca'},'department':{'name':'BU Timmi/Lucca'}},{'id':13,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':163,'legalEntity':{'name':'Lucca UK'},'department':{'name':'Sales'}},{'id':16,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':145,'legalEntity':{'name':'Lucca'},'department':{'name':'Sales'}}]}};
// 	const RESPONSE_4_homonyms_details_1_2 = {header:{}, data:{items:[{'id':5,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca'},'department':{'name':'BU Timmi/Lucca'}},{'id':8,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':110,'legalEntity':{'name':'Lucca'},'department':{'name':'BU Timmi/Lucca'}},{'id':13,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':87,'legalEntity':{'name':'Lucca UK'},'department':{'name':'BU Timmi/Lucca'}},{'id':16,'firstName':'Lucien','lastName':'Bertin','mail':'no-reply@lucca.fr','employeeNumber':145,'legalEntity':{'name':'Lucca UK'},'department':{'name':'Sales'}}]}};

// 	// count
// 	const RESPONSE_find_count = {header:{}, data:{}};
// 	// Errors
// 	const RESPONSE_ERROR_FIND = {Message:'error_find'};
// 	const RESPONSE_ERROR_COUNT = {Message:'error_count'};
// 	const RESPONSE_ERROR_DETAILS = {Message:'error_details'};
// });