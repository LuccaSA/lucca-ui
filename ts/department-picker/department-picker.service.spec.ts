module lui.departmentpicker.Test {
	"use strict";

	describe("luidDepartmentPicker", () => {
		let $httpBackend: ng.IHttpBackendService;
		let service: lui.departmentpicker.IDepartmentPickerService;
		let departmentsTree: lui.departmentpicker.IDepartmentTree;

		beforeEach(inject((
			_$httpBackend_: ng.IHttpBackendService,
			departmentPickerService: lui.departmentpicker.IDepartmentPickerService) => {

			$httpBackend = _$httpBackend_;
			service = departmentPickerService;

			departmentsTree = {
				node: null,
				children: [{
					node: {
						id: 1,
						name: "IXBLUE"
					},
					children: [{
						node: {
							id: 10,
							name: "Holding"
						},
						children:[{
							node: {
								id: 100,
								name: "Direction R&T"
							},
							children: []
						}, {
							node: {
								id: 101,
								name: "Direction Administrative et Financière"
							},
							children: [{
								node: {
									id: 1010,
									name: "Comptabilité"
								},
								children:[]
							}, {
								node:{
									id: 1011,
									name: "Accueil"
								},
								children: []
							}]
						}, {
							node: {
								id: 102,
								name: "Ressources Humaines"
							},
							children: [{
								node: {
									id: 1020,
									name: "Recrutement et Mobilité"
								},
								children:[{
									node: {
										id: 10200,
										name: "Juridique"
									},
									children: []
								}]
							}]
						}, {
							node: {
								id: 103,
								name: "BU SYSTEMES DE NAVIGATION"
							},
							children: [{
								node: {
									id: 1030,
									name: "NS - Développement Produits Inertiels"
								},
								children: []}]
						}]
					}, {
						node: {
							id: 11,
							name: "BU Chantier naval"
						},
						children: [{
							node: {
								id: 110,
								name: "MW - Comptabilité"
							},
							children: []
						}, {
							node: {
								id: 111,
								name: "MW - Administration"
							},
							children: []
						}]
					}]
				}, {
					node: {
						id: 2,
						name: "IXCORE"
					},
					children: [{
						node: {
							id: 20,
							name: "IXcore - Direction Générale"
						},
						children: []
					}, {
						node: {
							id: 21,
							name: "IXcore - Holding"
						},
						children: [{
							node: {
								id: 210,
								name: "IXcore - Diretion Administrative et Financière"
							},
							children: [{
								node: {
									id: 2100,
									name: "IXcore - Facility Management et HSE"
								},
								children: []
							}, {
								node: {
									id: 2101,
									name: "IXcore - Accueil"
								},
								children: []
							}]
						}]
					}]
				}]
			};
		}));

		describe("getDepartments()", () => {
			beforeEach(() => {
				$httpBackend.expectGET(/api\/v3\/departments\/tree\?fields=id,name*/i).respond(200, { data: departmentsTree });
			});
			it("should call the right API", () => {
				service.getDepartments();
				expect($httpBackend.flush).not.toThrow();
			});
			it("should have the right departments in the right order", () => {
				service.getDepartments()
				.then((departments: IDepartment[]) => {
					expect(departments.length).toBe(20);
					expect(_.pluck(departments, "id")).toEqual([1, 10, 100, 101, 1010, 1011, 102, 1020, 10200, 103, 1030, 11, 110, 111, 2, 20, 21, 210, 2100, 2101]);
				});
				$httpBackend.flush();
			});
			it("should set the right ancestorsLabel property", () => {
				service.getDepartments()
				.then((departments: IDepartment[]) => {
					expect(departments[0].ancestorsLabel).toBeUndefined();
					expect(departments[1].ancestorsLabel).toBe("IXBLUE");
					expect(departments[2].ancestorsLabel).toBe("IXBLUE > Holding");
					expect(departments[5].ancestorsLabel).toBe("IXBLUE > Holding > Direction Administrative et Financière");
					expect(departments[8].ancestorsLabel).toBe("IXBLUE > Holding > Ressources Humaines > Recrutement et Mobilité");
					expect(departments[9].ancestorsLabel).toBe("IXBLUE > Holding");
					expect(departments[12].ancestorsLabel).toBe("IXBLUE > BU Chantier naval");
					expect(departments[14].ancestorsLabel).toBeUndefined();
					expect(departments[17].ancestorsLabel).toBe("IXCORE > IXcore - Holding");
					expect(departments[18].ancestorsLabel).toBe("IXCORE > IXcore - Holding > IXcore - Diretion Administrative et Financière");
					expect(departments[19].ancestorsLabel).toBe("IXCORE > IXcore - Holding > IXcore - Diretion Administrative et Financière");
				});
				$httpBackend.flush();
			});
		});
	});
}