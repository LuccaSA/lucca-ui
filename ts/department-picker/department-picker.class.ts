module lui.departmentpicker {
	"use strict";

	export interface IDepartment {
		id: number;
		name: string;
		ancestorsLabel?: string;
		level?: number;
	}

	export interface ITree<T> {
		node: IDepartment;
		children: ITree<T>[];
	}
	export type IDepartmentTree = ITree<IDepartment>;
}
