module lui.userpicker.Test {
	"use strict";

	describe("luidUserPicker", () => {

		let $httpBackend: ng.IHttpBackendService;
		let $q: ng.IQService;
		let service: lui.userpicker.IUserPickerService;

		let fakeUsers: IUserLookup[];

		let fakeUser1: IUserLookup;
		let fakeUser2: IUserLookup;
		let fakeUser3: IUserLookup;
		let fakeUser4: IUserLookup;
		let fakeUser5: IUserLookup;

		beforeEach(inject((
			_$httpBackend_: ng.IHttpBackendService,
			_$q_: ng.IQService,
			userPickerService: lui.userpicker.IUserPickerService) => {

			$httpBackend = _$httpBackend_;
			$q = _$q_;
			service = userPickerService;

			fakeUser1 = <IUserLookup>{ id: 42, firstName: "Robert", lastName: "Vincent", dtContractEnd: null };
			fakeUser2 = <IUserLookup>{ id: 43, firstName: "Roger", lastName: "Thomas", dtContractEnd: null };
			fakeUser3 = <IUserLookup>{ id: 44, firstName: "Albert", lastName: "Rick", dtContractEnd: null };
			fakeUser4 = <IUserLookup>{ id: 45, firstName: "Robert", lastName: "Dupuis", dtContractEnd: null };
			fakeUser5 = <IUserLookup>{ id: 46, firstName: "Robert", lastName: "Dupuis", dtContractEnd: null };

			fakeUsers = new Array<IUserLookup>(fakeUser1, fakeUser2, fakeUser3, fakeUser4, fakeUser5);
		}));

		describe("getMyId()", () => {
			it("should call the right API and return exactly what the API returns", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id*/i).respond(200, { data: { id: 42 } });
				service.getMyId().then((id: number) => { expect(id).toEqual(42); });
				expect($httpBackend.flush).not.toThrow();
			});
			it("should have a cache system and call the API only once even if it is called twice", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=id*/i).respond(200, { data: { id: 42 } });
				service.getMyId();
				expect($httpBackend.flush).not.toThrow();
				service.getMyId();
				expect($httpBackend.flush).toThrow();
			});
		});

		describe("getMe()", () => {
			it("should call the right API and return exactly what the API returns", () => {
				$httpBackend.expectGET(/api\/v3\/users\/me\?fields=Id,firstName,lastName,dtContractEnd*/i)
					.respond(200, { data: fakeUser1 });
				service.getMe().then((me: IUserLookup) => { expect(me).toEqual(fakeUser1) });
				expect($httpBackend.flush).not.toThrow();
			});
		});

		describe("getHomonyms()", () => {
			it("should return the homonyms", () => {
				let homonyms = service.getHomonyms(fakeUsers);
				expect(homonyms.length).toBe(2);
				expect(_.filter(homonyms, (h: IUserLookup) => { return h.id == fakeUser4.id }).length).toBe(1);
				expect(_.filter(homonyms, (h: IUserLookup) => { return h.id == fakeUser5.id }).length).toBe(1);
			});
		});

		describe("getUsers()", () => {
			it("should call the right API and return exactly what the API returns", () => {
				$httpBackend.expectGET(/api\/v3\/users\/find\?formerEmployees=false&paging=0,15&fields=Id,firstName,lastName,dtContractEnd*/i)
					.respond(200, { data: { items: { fakeUsers } } });
				service.getUsers("formerEmployees=false").then((users: IUserLookup[]) => {
					expect(_.intersection(users, fakeUsers).length).toBe(0);
				});
				expect($httpBackend.flush).not.toThrow();
			});
		});

		describe("getUserById()", () => {
			it("should call the right API and return exactly what the API returns", () => {
				$httpBackend.expectGET(/api\/v3\/users\?id=42\&fields=Id,firstName,lastName,dtContractEnd*/i)
					.respond(200, { data: { items: [fakeUser1] }});
				service.getUserById(42).then((user: IUserLookup) => {
					expect(user.id).toBe(fakeUser1.id);
				});
				expect($httpBackend.flush).not.toThrow();
			});
		})

		describe("getUsersByIds()", () => {
			it("should call the right API and return exactly what the API returns", () => {
				$httpBackend.expectGET(/api\/v3\/users\?id=42\&fields=Id,firstName,lastName,dtContractEnd*/i)
					.respond(200, { data: { items: [fakeUser1] }});
				$httpBackend.expectGET(/api\/v3\/users\?id=43\&fields=Id,firstName,lastName,dtContractEnd*/i)
					.respond(200, { data: { items: [fakeUser2] }});
				$httpBackend.expectGET(/api\/v3\/users\?id=44\&fields=Id,firstName,lastName,dtContractEnd*/i)
					.respond(200, { data: { items: [fakeUser3] }});
				service.getUsersByIds([42, 43, 44]).then((users: IUserLookup[]) => {
					expect(users.length).toBe(3);
					expect(_.filter(users, (h: IUserLookup) => { return h.id == fakeUser1.id }).length).toBe(1);
					expect(_.filter(users, (h: IUserLookup) => { return h.id == fakeUser2.id }).length).toBe(1);
					expect(_.filter(users, (h: IUserLookup) => { return h.id == fakeUser3.id }).length).toBe(1);
				});
				expect($httpBackend.flush).not.toThrow();
			});
		});

		describe("getAdditionalProperties()", () => {
			it("should call the right API", () => {
				let properties: IHomonymProperty[] = [
					<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_MAIL", name: "mail", icon: "email" },
					<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_LEGALENTITY", name: "legalEntity.name", icon: "tree list" }
				];

				$httpBackend.expectGET(/api\/v3\/users\?id=45\&fields=mail,legalEntity.name*/i)
					.respond(200, { data: { items: [{ mail: "fakeuser@gmail.com", legalEntity: { name: "TotoEntity" } }]}});

				service.getAdditionalProperties(fakeUser4, properties)
					.then((props: IHomonymProperty[]) => {
						expect(props.length).toBe(2);

						let mail = _.filter(props, (prop: IHomonymProperty) => { return prop.name == properties[0].name });
						expect(mail.length).toBe(1);
						expect(mail[0].value).toBe("fakeuser@gmail.com");

						let le = _.filter(props, (prop: IHomonymProperty) => { return prop.name == properties[1].name });
						expect(le.length).toBe(1);
						expect(le[0].value).toBe("TotoEntity");
					});
				expect($httpBackend.flush).not.toThrow();
			})
		});

		describe("reduceAdditionalProperties()", () => {
			it("should remove the useless properties", () => {
				fakeUser4.additionalProperties = new Array<IHomonymProperty>(
					<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_MAIL", name: "mail", icon: "email", value: "something@gmail.com" },
					<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_LEGALENTITY", name: "legalEntity.name", icon: "tree list", value: "sameLE" }
				);
				fakeUser5.additionalProperties = new Array<IHomonymProperty>(
					<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_MAIL", name: "mail", icon: "email", value: "somethingElse@gmail.com" },
					<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_LEGALENTITY", name: "legalEntity.name", icon: "tree list", value: "sameLE" }
				);

				// The two users have the same LE : the LE property must be removed
				let result = service.reduceAdditionalProperties([fakeUser4, fakeUser5]);
				expect(result.length).toBe(2);
				expect(result[0].additionalProperties.length).toBe(1);
				expect(result[1].additionalProperties.length).toBe(1);
				expect(result[0].additionalProperties[0].name).toBe("mail");
				expect(result[1].additionalProperties[0].name).toBe("mail");
			});
		});
	});
}