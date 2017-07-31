module lui.departmentpicker {
	"use strict";

	export interface ILuidDepartmentPickerScope extends ng.IScope {
		internal: { selectedDepartment: IDepartment };
		departmentsToDisplay: IDepartment[];

		onDropdownToggle(isOpen: boolean): void;
		selectDepartment(): void;
		getLevel(department: IDepartment): Array<{}>;
		loadMore(clue: string): void;
		search(clue: string): void;
	}
}
