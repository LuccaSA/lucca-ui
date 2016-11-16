export class HomonymProperty {
	name: string;
	label: string;
	icon: string;
}

export const defaultHomonymsProperties: Array<HomonymProperty> = [
	{name: 'employeeNumber', label: 'LUIDUSERPICKER_LEGALENTITY', icon: 'user'},
	{name: 'legalEntity.name', label: 'LUIDUSERPICKER_EMPLOYEENUMBER', icon: 'tree list'},
	{name: 'mail', label: 'LUIDUSERPICKER_MAIL', icon: 'email'}
];

export const API_LIMIT = 10;

export const INPUT_DEBOUNCE = 300;
