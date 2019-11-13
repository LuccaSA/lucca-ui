module lui.departmentpicker {
	"use strict";

	export interface IDepartmentPickerFilters extends ng.IFilterService {
		(name: "departmentFilter"): (departments: IDepartment[], clue: string) => IDepartment[];
	}

	export function DepartmentFilter(): ((departments: IDepartment[], clue: string) => IDepartment[]) {
		return function(departments: IDepartment[], clue: string): IDepartment[] {
			let loweredClue = clue.toLowerCase();
			let matching = _.filter(departments, (department: IDepartment) => {
				return department.name.toLowerCase().indexOf(loweredClue) === 0; // Department starts with the clue
			});
			let containing = _.difference(departments, matching)
				.filter((department: IDepartment) => {
					return department.name.toLowerCase().indexOf(loweredClue) > -1; // Has the clue in the department name
				});
			let childDepartments = _.filter(departments, (department: IDepartment) => {
				return department.name.toLowerCase().indexOf(loweredClue) === -1
				&& !!department.ancestorsLabel
				&& department.ancestorsLabel.toLowerCase().indexOf(loweredClue) > -1; // Has the clue in one of its ancestor
			});

			return _.union(matching, containing, childDepartments);
		};
	}
	angular.module("lui").filter("departmentFilter", DepartmentFilter);
}
