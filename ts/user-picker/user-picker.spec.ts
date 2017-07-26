module lui.userpicker.Test {
	"use strict";

	describe("luidUserPicker", () => {
		let $rootScope: ng.IScope;
		let $httpBackend: ng.IHttpBackendService;
		let $q: ng.IQService;
		let service: lui.userpicker.IUserPickerService;

		let me: IUserLookup;
		let user2, user3, user4, user5, user6, user7, user8: IUserLookup;
		let users: IUserLookup[];
		let usersWithHomonyms: IUserLookup[];

		beforeEach(inject((
			_$rootScope_: ng.IRootScopeService,
			_$httpBackend_: ng.IHttpBackendService,
			_$q_: ng.IQService,
			userPickerService: lui.userpicker.IUserPickerService) => {

			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$q = _$q_;
			service = userPickerService;

			me = <IUserLookup>{ id: 1, firstName: "Roger", lastName: "Thomas", dtContractEnd: null };

			user2 = <IUserLookup>{ id: 2, firstName: "Jon", lastName: "Snow", dtContractEnd: null };
			user3 = <IUserLookup>{ id: 3, firstName: "Rick", lastName: "Sanchez", dtContractEnd: null };
			user4 = <IUserLookup>{ id: 4, firstName: "Dirk", lastName: "Gently", dtContractEnd: null };
			user5 = <IUserLookup>{ id: 5, firstName: "Jane", lastName: "Ives", dtContractEnd: null };
			user6 = <IUserLookup>{ id: 6, firstName: "Homer", lastName: "Simpson", dtContractEnd: null };

			user7 = <IUserLookup>{ id: 7, firstName: "John", lastName: "Doe", dtContractEnd: null };
			user8 = <IUserLookup>{ id: 8, firstName: "John", lastName: "Doe", dtContractEnd: null };

			users = new Array<IUserLookup>(me, user2, user3, user4, user5, user6);
			usersWithHomonyms = new Array<IUserLookup>(me, user2, user3, user4, user5, user6, user7, user8);
		}));


		describe("service relationship", () => {
			it("should call the services methods getMyId and getUsers only once", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=.*/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: users } }); spyOn(service, "getMyId").and.callThrough();
				spyOn(service, "getUsers").and.callThrough();

				let scope = <ILuidUserPickerScope>$rootScope.$new();
				let controller = new LuidUserPickerController(scope, $q, service);

				expect($httpBackend.flush).not.toThrow();
				expect(service.getMyId).toHaveBeenCalledTimes(1);
				expect(service.getUsers).toHaveBeenCalledTimes(1);
			});
			it("should try to handle homonyms", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=.*/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: users } });
				spyOn(service, "getHomonyms");

				let scope = <ILuidUserPickerScope>$rootScope.$new();
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();
				expect(service.getHomonyms).toHaveBeenCalledTimes(1);
			});
			it("should fetch additional properties if homonyms are found", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id*/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: usersWithHomonyms } });

				$httpBackend.expectGET(/api\/v3\/users\?id=7\&fields=department.name,legalEntity.name,mail.*/i)
					.respond({ data: { items: [{ department: { name: "BU" }, legalEntity: { name: "LE" }, mail: "john.doe1@mail.com" }]}});
				$httpBackend.expectGET(/api\/v3\/users\?id=8\&fields=department.name,legalEntity.name,mail.*/i)
					.respond({ data: { items: [{ department: { name: "BU" }, legalEntity: { name: "LE" }, mail: "john.doe2@mail.com" }]}});

				let homonymsCount = service.getHomonyms(usersWithHomonyms).length;
				spyOn(service, "getAdditionalProperties").and.callThrough();
				let scope = <ILuidUserPickerScope>$rootScope.$new();
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();
				expect(service.getAdditionalProperties).toHaveBeenCalledTimes(homonymsCount);
			});
			it("should only display homonyms' discriminating properties", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id*/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: usersWithHomonyms } });

				$httpBackend.expectGET(/api\/v3\/users\?id=7\&fields=department.name,legalEntity.name,mail.*/i)
					.respond({ data: { items: [{ department: { name: "BU" }, legalEntity: { name: "LE" }, mail: "john.doe1@mail.com" }]}});
				$httpBackend.expectGET(/api\/v3\/users\?id=8\&fields=department.name,legalEntity.name,mail.*/i)
					.respond({ data: { items: [{ department: { name: "BU" }, legalEntity: { name: "LE" }, mail: "john.doe2@mail.com" }]}});

				let homonymsCount = service.getHomonyms(usersWithHomonyms).length;
				let scope = <ILuidUserPickerScope>$rootScope.$new();
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();

				let homonym1 = _.filter(scope.users, u => u.id === 7)[0];
				expect(homonym1.additionalProperties.length).toBe(1);
				expect(homonym1.additionalProperties[0].name).toBe("mail");

				let homonym2 = _.filter(scope.users, u => u.id === 8)[0];
				expect(homonym2.additionalProperties.length).toBe(1);
				expect(homonym2.additionalProperties[0].name).toBe("mail");
			});
		});

		describe("optional attributes", () => {
			it("should add custom info to the users if asked to", () => {
				let getCustomInfo = (user: IUserLookup) => { return "customInfo"; };
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id*/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: users } });

				let scope = <ILuidUserPickerScope>$rootScope.$new();
				scope.customInfo = getCustomInfo;
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();

				_.each(scope.users, (u: IUserLookup) => {
					expect(u.info).toBe(getCustomInfo(u));
				})
			});

			it("should add custom info to the users if asked to", () => {
				let getCustomInfoAsync = (user: IUserLookup): ng.IPromise<string> => {
					let dfd = $q.defer();
					dfd.resolve("customInfoAsync");
					return dfd.promise;
				};

				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id*/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: users } });

				let scope = <ILuidUserPickerScope>$rootScope.$new();
				scope.customInfoAsync = getCustomInfoAsync;
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();

				_.each(scope.users, (u: IUserLookup) => {
					expect(u.info).toBe("customInfoAsync");
				})
			});

			it("should handle bypassOperationsFor", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id*/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: users } });

				$httpBackend.expectGET(/api\/v3\/users\?id=7\&fields=.*/i).respond(200, { data: { items: [user7] }});

				let scope = <ILuidUserPickerScope>$rootScope.$new();
				scope.bypassOperationsFor = [7];
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();

				expect(_.filter(scope.users, (u: IUserLookup) => { return u.id === 7 }).length).toBe(1);
			});

			it("should handle appInstanceId and operations attributes", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false&appinstanceid=104&operations=1,2&paging=0,15&fields=Id,firstName,lastName,dtContractEnd/i)
					.respond(200, { data: { items: users } });
				let scope = <ILuidUserPickerScope>$rootScope.$new();
				scope.appId = 104;
				scope.operations = ["1", "2"];
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();
			});

			it("should display the principal user first if the 'displayMeFirst' attribute is set to True", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=/i).respond(200, { data: { id: me.id, firstName: "bob", lastName: "builder" } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i)
					.respond(200, { data: { items: [user2, user3, user4, me, user5, user6] } });
				let scope = <ILuidUserPickerScope>$rootScope.$new();
				scope.displayMeFirst = true;
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();
				expect(scope.users[0].id).toBe(me.id);
			});

			it("it should apply custom filters if the 'customFilter' attribute is set", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*/i).respond(200, { data: { items: users } });

				let scope = <ILuidUserPickerScope>$rootScope.$new();
				scope.customFilter = (user: IUserLookup) => { return user.id !== 4 && user.id !== 5; };
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();
				expect(_.filter(scope.users, (u: IUserLookup) => { return u.id === 4 || u.id === 5; }).length).toBe(0);
			});

			it("it should apply the formerEmployees=true filter if the 'showFormerEmployees' is set to True", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id/i).respond(200, { data: { id: me.id } });
				$httpBackend.expectGET(/api\/v3\/users\/find\?.*formerEmployees=true.*/i).respond(200, { data: { items: users } });

				let scope = <ILuidUserPickerScope>$rootScope.$new();
				scope.showFormerEmployees = true;
				let controller = new LuidUserPickerController(scope, $q, service);

				$httpBackend.flush();
			});
		});
	});
}