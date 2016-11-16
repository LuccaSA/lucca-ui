import { User } from './user.model';
import * as moment from 'moment';

const getNameIdentifier = user => `${user.firstName}${user.lastName}`.toLowerCase();

export function markFormerEmployees(users: Array<User>): Array<User> {
	return users.map(user => {
		if (user.id !== -1 && moment(user.dtContractEnd).isBefore(moment())) {
			return Object.assign(user, {isFormerEmployee: true});
		}

		return user;
	});
}

export function markHomonyms(users: Array<User>): Array<User> {
	const nbOfUsersByName = users.reduce((prev, cur) => {
		let name = getNameIdentifier(cur);

		return Object.assign(prev, {[name]: (prev[name] || 0) + 1}, {});
	}, {});

	return users.map(user => {
		let name = getNameIdentifier(user);
		if (nbOfUsersByName[name] > 1) {
			return Object.assign(user, {hasHomonyms: true});
		}
		return user;
	});
}

export function formatItems(users: Array<User>): Array<{id: any, text: string}> {
	return users
		.map(user => {
			let text = `<div>${user.firstName} ${user.lastName}</div>`;
			if (user.hasHomonyms) {
				text += `<div>Has homonyms ! ${JSON.stringify(user.homonyms)}</div>`;
			}

			if (user.isFormerEmployee) {
				text += `<div>Is a former employee: ${user.dtContractEnd}</div>`;
			}

			if (user.info) {
				text += `<div>Custom Info: ${user.info}</div>`;
			}

			if (user.infoAsync) {
				text += `<div>Custom Info async: ${user.infoAsync}</div>`;
			}

			return { id: user.id, text: text};
		});
}

const arePropertiesEqual = (a, b) => {
	if (a instanceof Object) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
	return a === b;
};

const keepDifferentiatingKeys = (users: Array<any>) => {
	const unusedKeys = ['id', 'firstName', 'lastName'];
	const keys = Object
		.keys(users[0])
		.filter(k => unusedKeys.indexOf(k) === -1);

	const differentiatingKeys = keys.map(key => {
		if (users.every(user => arePropertiesEqual(user[key], users[0][key]))) {
			return null;
		}
		return key;
	}).filter(key => key !== null)
	.slice(0, 2);

	return users.map(user => ({
		id: user.id,
		homonyms: [ ...differentiatingKeys.map(key => ({key: key, value: user[key]}))]
	}));
};

export function getDifferentiatingPropertiesByUserid(usersWithHomonyms: Array<any>): {[id: number]: any} {
	const homonymsDictionary = usersWithHomonyms.reduce((prev, cur) => {
		let name = getNameIdentifier(cur);

		return Object.assign(prev, {[name]: [...(prev[name] || []), cur]}, {});
	}, {});

	return Object.keys(homonymsDictionary)
		.map(key => keepDifferentiatingKeys(homonymsDictionary[key]))
		.reduce((prev, cur) => [...prev, ...cur], [])
		.reduce((prev, cur) => Object.assign(prev, {[cur.id]: cur}, {}), {});
}
