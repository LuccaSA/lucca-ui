import { HomonymProperty } from './constants';
import { User } from './user.model';
import * as moment from 'moment';

const getNameIdentifier = user => `${user.firstName}_${user.lastName}`.toLowerCase();

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

export function formatItems(users: Array<User>, homonymsPropertiesCandidates: Array<HomonymProperty>): Array<{id: any, text: string}> {
	return users
		.map(user => {
			let text = `<div>${user.firstName} ${user.lastName}</div>`;

			if (user.hasHomonyms) {
				const homonyms = user.homonyms.map(h => `<i class="lui icon ${h.icon}"></i> <strong>${h.label}</strong> ${h.value}`);

				text += `<div>${homonyms.join('<br>')}</div>`;
			}

			if (user.isFormerEmployee) {
				text += `<div>Left on ${user.dtContractEnd}</div>`;
			}

			if (user.info) {
				text += `<div>${user.info}</div>`;
			}

			if (user.infoAsync) {
				text += `<div>${user.infoAsync}</div>`;
			}

			return { id: user.id, text: text};
		});
}

const getDeepKeyValue = (object: Object, key: string) => {
	const keys = key.split('.');

	if (keys.length > 1) {
		return getDeepKeyValue(object[keys[0]], keys.slice(1).join('.'));
	}

	return object[keys[0]];
};

const keepDifferentiatingKeys = (users: Array<any>, homonymsProperties: Array<HomonymProperty>) => {
	const orderedProperties = homonymsProperties
		.sort((a, b) => {
			if (a.priority > b.priority) {
				return -1;
			} else {
				return 1;
			}
		});

	const differentiatingProperties = orderedProperties.map(prop => {
		const key = prop.name;
		const firstUserValue = getDeepKeyValue(users[0], key);
		if (users.every(user => getDeepKeyValue(user, key) === firstUserValue)) {
			return null;
		}
		return prop;
	}).filter(prop => prop !== null)
	.slice(0, 2);

	return users.map(user => ({
		id: user.id,
		homonyms: [ ...differentiatingProperties.map(prop => ({
			name: prop.name,
			value: getDeepKeyValue(user, prop.name),
			label: prop.label,
			icon: prop.icon
		}))]
	}));
};

export function getDifferentiatingPropertiesByUserid(
	usersWithHomonyms: Array<any>,
	homonymsProperties: Array<HomonymProperty>
): {[id: number]: any} {
	const homonymsDictionary = usersWithHomonyms.reduce((prev, cur) => {
		let name = getNameIdentifier(cur);

		return Object.assign(prev, {[name]: [...(prev[name] || []), cur]}, {});
	}, {});

	return Object.keys(homonymsDictionary)
		.map(key => keepDifferentiatingKeys(homonymsDictionary[key], homonymsProperties))
		.reduce((prev, cur) => [...prev, ...cur], [])
		.reduce((prev, cur) => Object.assign(prev, {[cur.id]: cur}, {}), {});
}
