module lui.departmentpicker {
	"use strict";

	export interface IDepartmentPickerService {
		getDepartments(): ng.IPromise<IDepartment[]>;
	}

	class DepartmentPickerService implements IDepartmentPickerService {
		public static IID: string = "departmentPickerService";
		public static $inject: Array<string> = ["$http"];

		private $http: ng.IHttpService;

		constructor($http: ng.IHttpService) {
			this.$http = $http;
		}

		public getDepartments(): ng.IPromise<IDepartment[]> {
			return this.getDepartmentsTree()
			.then((tree: IDepartmentTree) => {
				let departmentTrees: IDepartmentTree[] = tree.children;
				let departments = this.buildDepartmentsArrayRecursively(departmentTrees);
				return departments;
			});
		}

		private getDepartmentsTree(): ng.IPromise<IDepartmentTree> {
			return this.$http.get("/api/v3/departments/tree?fields=id,name")
			.then((response: ng.IHttpPromiseCallbackArg<{ data: IDepartmentTree }>) => {
				return response.data.data;
			});
		}

		private buildDepartmentsArrayRecursively(departmentTrees: IDepartmentTree[]): IDepartment[] {
			let departments: IDepartment[] = [];
			if (!!departmentTrees) {
				_.each(departmentTrees, (departmentTree: IDepartmentTree) => {
					this.setAncestorsLabel(departmentTree.node, departmentTree.children);
					departments.push(departmentTree.node);
					departments = _.flatten([departments, this.buildDepartmentsArrayRecursively(departmentTree.children)]);
				});
			}
			return departments;
		}

		private setAncestorsLabel(department: IDepartment, departmentTrees: IDepartmentTree[]): void {
			_.each(departmentTrees, (departmentTree: IDepartmentTree) => {
				if (!departmentTree.node.ancestorsLabel) {
					departmentTree.node.ancestorsLabel = "";
				} else {
					departmentTree.node.ancestorsLabel += " > ";
				}
				departmentTree.node.ancestorsLabel += department.name;

				this.setAncestorsLabel(department, departmentTree.children);
			});
		}
	}

	angular.module("lui").service(DepartmentPickerService.IID, DepartmentPickerService);
}
