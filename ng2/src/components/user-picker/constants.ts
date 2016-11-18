export class HomonymProperty {
	name: string;
	value: string;
	label: string;
	icon: string;
	priority?: number;
}

export const defaultHomonymsProperties: Array<HomonymProperty> = [
	{
		name: 'department',
		value: 'department.name',
		label: 'LUIDUSERPICKER_DEPARTMENT',
		icon: 'location',
		priority: 3
	},
	{
		name: 'legalEntity',
		value: 'legalEntity.name',
		label: 'LUIDUSERPICKER_EMPLOYEENUMBER',
		icon: 'tree list',
		priority: 2
	},
	{
		name: 'mail',
		value: 'mail',
		label: 'LUIDUSERPICKER_MAIL',
		icon: 'email',
		priority: 1
	},
	{
		name: 'employeeNumber',
		value: 'employeeNumber',
		label: 'LUIDUSERPICKER_LEGALENTITY',
		icon: 'user',
		priority: 0
	}
];

export const API_LIMIT = 10;

export const INPUT_DEBOUNCE = 300;
