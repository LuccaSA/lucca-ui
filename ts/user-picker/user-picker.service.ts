module Lui.Directives {
	"use strict";

	export interface IUserLookup {
		id: number;
		firstName: string;
		lastName: string;
		dtContractEnd: string;
		dtContractStart: string;

		hasLeft: boolean;
		info: string;
		hasHomonyms: boolean;
		additionalProperties: ISimpleProperty[];
	}

	export interface ISimpleProperty {
		translationKey: string;
		name: string;
		icon: string;
		value?: string;
	}

	export interface IUserPickerService {
		getMyId(): ng.IPromise<number>;
		getHomonyms(user: IUserLookup[]): IUserLookup[];
		getUsers(filters: string): ng.IPromise<IUserLookup[]>;
		getAdditionalProperties(user: IUserLookup, properties: ISimpleProperty[]): ng.IPromise<ISimpleProperty[]>;

		reduceAdditionalProperties(users: IUserLookup[]): IUserLookup[];
		setCustomHttpService(httpService: ng.IHttpService): void;
	}

	class UserPickerService implements IUserPickerService {
		public static IID: string = "userPickerService";
		public static $inject: Array<string> = [
			"$http", "$q", "$filter"
		];

		private $http: ng.IHttpService;
		private defaultHttpService: ng.IHttpService;
		private $q: ng.IQService;

		private usersMeFullQuery = "/api/v3/users/me?fields=id";
		private userLookUpApiUrl = "/api/v3/users/find";

		private userLookupFields = "&fields=Id,firstName,lastName,dtContractEnd,dtContractStart";

		private myIdCache: number;
		private stripAccents: (str: string) => string;

		constructor($http: ng.IHttpService, $q: ng.IQService, $filter: ng.IFilterService) {
			this.$http = $http;
			this.defaultHttpService = $http;
			this.$q = $q;
			this.stripAccents = <(str: string) => string>$filter("luifStripAccents");
		}

		public getMyId(): ng.IPromise<number> {
			if (!!this.myIdCache) {
				let dfd = this.$q.defer();
				dfd.resolve(this.myIdCache);
				return dfd.promise;
			}

			return this.$http.get(this.usersMeFullQuery)
				.then((response: ng.IHttpPromiseCallbackArg<{ data: { id: number } }>) => {
					this.myIdCache = response.data.data.id;
					return this.myIdCache;
				}).catch((reason: any) => {
					return undefined;
				});
		}

		public getHomonyms(users: IUserLookup[]): IUserLookup[] {
			return _.chain(users)
				.groupBy((user: IUserLookup) => { return this.concatName(user); })
				.filter(groups => { return groups.length > 1; })
				.flatten()
				.value();
		}

		public getUsers(filters: string): ng.IPromise<IUserLookup[]> {
			return this.$http.get(this.userLookUpApiUrl + "?" + filters + this.userLookupFields)
				.then((response: ng.IHttpPromiseCallbackArg<{ data: { items: IUserLookup[] } }>) => {
					return response.data.data.items;
				});
		}

		public getAdditionalProperties(user: IUserLookup, properties: ISimpleProperty[]): ng.IPromise<ISimpleProperty[]> {
			let fields = _.map(properties, (prop: ISimpleProperty) => { return prop.name; }).join(",");
			return this.$http.get("/api/v3/users/" + user.id + "?fields=" + fields)
				.then((response: ng.IHttpPromiseCallbackArg<{ data: any }>) => {
					let result = new Array<ISimpleProperty>();
					_.each(properties, (property: ISimpleProperty) => {
						let value = <string>this.getProperty(response.data.data, property.name);
						if (!!value) {
							result.push(<ISimpleProperty>{
								translationKey: property.translationKey,
								name: property.name,
								icon: property.icon,
								value: value
							});
						}
					});
					return result;
				});
		}

		public reduceAdditionalProperties(users: IUserLookup[]): IUserLookup[] {
			let groupedHomonyms = _.chain(users)
				.groupBy((user: IUserLookup) => { return this.concatName(user); })
				.filter(groups => { return groups.length > 1; })
				.value();

			if (groupedHomonyms.length === 0) {
				return users;
			}

			_.each(groupedHomonyms, (homonyms: IUserLookup[]) => {
				let reducableProperties = new Array<string>();
				let groupedProperties = _.chain(homonyms)
					.map((user: IUserLookup) => { return user.additionalProperties; })
					.flatten()
					.groupBy((property: ISimpleProperty) => { return property.name; })
					.value();
				_.each(groupedProperties, propertyGroup => {
					let uniq = _.uniq(propertyGroup, (property: ISimpleProperty) => { return property.value });
					if (uniq.length === 1) {
						// this property can be removed
						reducableProperties.push(propertyGroup[0].name);
					}
				});

				_.each(reducableProperties, (propertyName: string) => {
					_.each(homonyms, (user: IUserLookup) => {
						let propIndex = _.findIndex(user.additionalProperties, property => { return property.name === propertyName; });
						user.additionalProperties.splice(propIndex, 1);
					});
				});
			});

			return users;
		}

		public setCustomHttpService(httpService: ng.IHttpService): void {
			this.$http = !!httpService ? httpService : this.defaultHttpService;
		}

		private getProperty(object: any, prop: string): any {
			let splitted = prop.split(".");
			let curObject = object;
			_.each(splitted, (propName: string) => {
				if (!!curObject && !!curObject[propName]) {
					curObject = curObject[propName];
				} else {
					curObject = undefined;
				}
			});
			return curObject;
		}

		private concatName(user: IUserLookup): string {
			return this.stripAccents(user.firstName.toLowerCase()) + this.stripAccents(user.lastName.toLowerCase());
		}
	}

	angular.module("lui.directives").service(UserPickerService.IID, UserPickerService);
}
