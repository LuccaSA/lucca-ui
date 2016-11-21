export class HomonymProperty {
	name: string;
	label: string;
	icon: string;
	priority?: number;
}

export const defaultHomonymsProperties: Array<HomonymProperty> = [
	{
		name: 'department.name',
		label: 'LUIDUSERPICKER_DEPARTMENT',
		icon: 'location',
		priority: 3
	},
	{
		name: 'legalEntity.name',
		label: 'LUIDUSERPICKER_LEGALENTITY',
		icon: 'tree list',
		priority: 2
	},
	{
		name: 'mail',
		label: 'LUIDUSERPICKER_MAIL',
		icon: 'email',
		priority: 1
	},
	{
		name: 'employeeNumber',
		label: 'LUIDUSERPICKER_EMPLOYEENUMBER',
		icon: 'user',
		priority: 0
	}
];

export const API_LIMIT = 10;

export const INPUT_DEBOUNCE = 300;
