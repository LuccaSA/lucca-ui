module lui.apiselect {
	"use strict";
	export interface IStandardApiResource {
		id: string | number;
		name: string;
	}
	export class StandardApiService {
		public static IID: string = "luisStandardApiService";
		public static $inject: Array<string> = ["$http"];
		private $http: ng.IHttpService;

		constructor($http: angular.IHttpService) {
			this.$http = $http;
		}
		public get(clue: string, api: string, additionalFilter?: string, paging?: string): ng.IPromise<IStandardApiResource[]> {
			let clueFilter: string = !!clue ? "name=like," + clue : undefined;
			let pagingFilter: string = paging ? `paging=${paging}` : undefined;
			let fields = "fields=id,name";
			let filter = _.reject([fields, clueFilter, pagingFilter, additionalFilter], i => !i).join("&");
			return this.$http.get(api + "?" + filter)
			.then( (response: ng.IHttpPromiseCallbackArg<{data: { items: IStandardApiResource[] } } & { data: IStandardApiResource[] }>) => {
				if (api.indexOf("/v3/") !== -1) {
					return response.data.data.items;
				} else {
					return response.data.data;
				}
			});
		}
	}
	angular.module("lui").service(StandardApiService.IID, StandardApiService);
}
