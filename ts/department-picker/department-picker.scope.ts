module lui.departmentpicker {
	"use strict";

	export interface ILuidDepartmentPickerScope extends ng.IScope {
		internal: { selectedDepartment: IDepartment };
		departmentsToDisplay: IDepartment[];

		onDropdownToggle(isOpen: boolean): void;
		selectDepartment(): void;
		loadMore(): void;
		getLevel(department: IDepartment): Array<{}>;
	}
}
