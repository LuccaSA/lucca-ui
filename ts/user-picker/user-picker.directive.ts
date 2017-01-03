module Lui.Directives {
	"use strict";
	class LuidNewUserPicker implements angular.IDirective {
		public static IID: string = "luidNewUserPicker";
		public restrict = "E";
		public templateUrl = "lui/templates/user-picker/user-picker.html";
		public require = ["ngModel", LuidNewUserPicker.IID];
		public scope = {
			/* OK */ placeholder: "@",
			/* OK */ onSelect: "&",
			/* OK */ onRemove: "&",
			/* OK */ controlDisabled: "=", // BG: pas '@', sinon cast en string

			/* OK */ showFormerEmployees: "=", // bool, default false
			/* OK */ showFutureEmployees: "=", // bool, default true

			homonymsProperties: "=", // ISimpleProperty[], properties to handle homonymsProperties, default [department, legalEntity, mail]

			customFilter: "=", // (User) => bool

			appId: "=", // Id of the application users should have access to
			operations: "=", // List of operations Ids users should have access to

			customInfo: "=", // (User) => string
			customInfoAsync: "=", // (User) => ng.IPromise<string>
			displayMeFirst: "=",
			displayAllUsers: "=", // boolean, default false

			customHttpService: "=", // $http
			bypassOperationsFor: "=", // List of users that should be displayed even if they don't have access to the operations
		};
		public controller: string = LuidNewUserPickerController.IID;
		public static factory(): angular.IDirectiveFactory { return () => { return new LuidNewUserPicker(); }; }
		public link(
			scope: ILuidNewUserPickerScope,
			element: angular.IAugmentedJQuery,
			attrs: angular.IAttributes,
			ctrls: [ng.INgModelController, LuidNewUserPickerController]): void {

			let ngModelCtrl = ctrls[0];
			let userPickerCtrl = ctrls[1];

			userPickerCtrl.setNgModelCtrl(ngModelCtrl);
		}
	}

	interface ILuidNewUserPickerScope extends ng.IScope {
		placeholder: string;
		showFormerEmployees: boolean;
		showFutureEmployees: boolean;
		displayMeFirst: boolean;
		controlDisabled: boolean;
		homonymsProperties: any[];
		customHttpService: ng.IHttpService;

		appId: number;
		operations: string[];

		onSelect: () => any;
		onRemove: () => any;
		customFilter: (user: IUserLookup) => boolean;
		customInfo: (user: IUserLookup) => string;
		customInfoAsync: (user: IUserLookup) => ng.IPromise<string>;

		// // // //

		users: IUserLookup[];
		myId: number;
		apiUrl: string;
		limit: number;
		filter: string;
		selectedUser: IUserLookup;
		onSelectedUserChanged(user: IUserLookup): void;
		find(search: string): void;
	}

	const DEFAULT_HOMONYMS_PROPERTIES: ISimpleProperty[] = [
		<ISimpleProperty>{ translationKey: "LUIDUSERPICKER_DEPARTMENT", name: "department.name", icon: "location" },
		<ISimpleProperty>{ translationKey: "LUIDUSERPICKER_LEGALENTITY", name: "legalEntity.name", icon: "tree list" },
		// <ISimpleProperty>{ translationKey: "LUIDUSERPICKER_EMPLOYEENUMBER", name: "employeeNumber", icon: "user" },
		<ISimpleProperty>{ translationKey: "LUIDUSERPICKER_MAIL", name: "mail", icon: "email" },
	];

	class LuidNewUserPickerController {
		public static IID: string = "luidNewUserPickerController";
		public static $inject: Array<string> = [
			"$scope",
			"$q",
			"userPickerService"
		];

		private $scope: ILuidNewUserPickerScope;
		private $q: ng.IQService;
		private userPickerService: IUserPickerService;

		private ngModelCtrl: ng.INgModelController;

		constructor(
			$scope: ILuidNewUserPickerScope,
			$q: ng.IQService,
			userPickerService: IUserPickerService) {

			this.$scope = $scope;
			this.$q = $q;
			this.userPickerService = userPickerService;
			this.userPickerService.setCustomHttpService($scope.customHttpService);

			this.$scope.limit = 10000;

			this.$scope.$watchGroup(["showFormerEmployees", "showFutureEmployees"], () => {
				this.refresh(undefined);
			});
			this.$scope.$watchGroup(["appId", "operations"], () => {
				if (!!this.$scope.appId && !!this.$scope.operations && this.$scope.operations.length > 0) {
					this.refresh(undefined);
				}
			});

			this.$scope.find = (search: string): void => { this.refresh(search); }

			this.$scope.onSelectedUserChanged = (user: IUserLookup): void => {
				this.setViewValue(user);
				if (!!this.$scope.onSelect()) {
					this.$scope.onSelect();
				}
			};

			this.refresh(undefined);
		}

		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				this.$scope.selectedUser = this.getViewValue();
			};
		}
		private getViewValue(): IUserLookup {
			return <IUserLookup>this.ngModelCtrl.$viewValue;
		}
		private setViewValue(value: IUserLookup): void {
			this.ngModelCtrl.$setViewValue(angular.copy(value));
			this.ngModelCtrl.$setTouched();
		}
		private tidyUp(users: IUserLookup[]): ng.IPromise<IUserLookup[]> {
			let promises = new Array<ng.IPromise<any>>();
			let displayMeFirstIndex = -1;
			let customInfoDico = {}; // { 1: string, 2: string, X: string [...]} where x = user Id
			let homonymsDico = {};

			_.each(users, (user: IUserLookup) => {
				user.hasLeft = !!user.dtContractEnd && moment(user.dtContractEnd).isBefore(moment().startOf("day"));
			});

			// Custom filters
			if (this.$scope.customFilter) {
				users = _.filter(users, (user: IUserLookup) => { return this.$scope.customFilter(user); });
			}

			if (this.$scope.displayMeFirst) {
				promises.push(this.userPickerService.getMyId());
				displayMeFirstIndex = promises.length - 1;
			}

			// Custom info
			if (!!this.$scope.customInfo) {
				_.each(users, (user: IUserLookup) => {
					user.info = this.$scope.customInfo(user);
				});
			}
			if (!!this.$scope.customInfoAsync) {
				_.each(users, (user: IUserLookup) => {
					customInfoDico[user.id] = promises.push(this.$scope.customInfoAsync(user)) - 1;
				});
			}

			let homonyms = this.userPickerService.getHomonyms(users);
			if (!!homonyms && homonyms.length > 0) {
				let properties = !!this.$scope.homonymsProperties && this.$scope.homonymsProperties.length > 0 ?
					this.$scope.homonymsProperties : DEFAULT_HOMONYMS_PROPERTIES;
				_.each(homonyms, (user: IUserLookup) => {
					homonymsDico[user.id] = promises.push(this.userPickerService.getAdditionalProperties(user, properties)) - 1;
				});
			}

			return this.$q.all(promises).then((values: any[]) => {
				if (displayMeFirstIndex !== -1 && values[displayMeFirstIndex] !== undefined) {
					this.$scope.myId = <number>values[displayMeFirstIndex];
					let meIndex = _.findIndex(users, (u: IUserLookup) => { return u.id === this.$scope.myId; });
					if (meIndex !== -1) {
						let me = users[meIndex];
						users.splice(meIndex, 1);
						users.unshift(me);
					}
				}
				if (!!homonyms && homonyms.length > 0) {
					_.each(users, (user: IUserLookup) => {
						if (!!homonymsDico[user.id]) {
							user.additionalProperties = values[homonymsDico[user.id.toString()]];
							user.hasHomonyms = true;
						}
					});
					// Remove the properties which don't differentiate the homonyms
					users = this.userPickerService.reduceAdditionalProperties(users);
				}
				if (!!this.$scope.customInfoAsync) {
					_.each(users, (user: IUserLookup) => {
						let indexInValuesArray = customInfoDico[user.id.toString()];
						user.info = user.info === "" ? values[indexInValuesArray] : user.info + " " + values[indexInValuesArray];
					});
				}

				return users;
			});
		}

		private refresh(clue: string): void {
			this.updateFilter(clue);
			this.userPickerService.getUsers(this.$scope.filter)
				.then((allUsers: IUserLookup[]) => {
					this.tidyUp(allUsers).then((neatUsers: IUserLookup[]) => {
						this.$scope.users = neatUsers;
					});
				});
		}

		private updateFilter(clue: string): void {
			let s = this.$scope;
			this.$scope.filter =
				"formerEmployees=" + (!!s.showFormerEmployees ? s.showFormerEmployees.toString() : "false") + "&" +
				"futureEmployees=" + (!!s.showFutureEmployees ? s.showFutureEmployees.toString() : "false") + "&" +
				(!!s.appId && !!s.operations && s.operations.length > 0 ? "appinstanceid=" + s.appId + "&operations=" + s.operations.join(",") + "&" : "") +
				(!!clue ? "clue=" + clue + "&" : "") +
				"limit=" + s.limit;
		}
	}

	angular.module("lui.directives").controller(LuidNewUserPickerController.IID, LuidNewUserPickerController);
	angular.module("lui.directives").directive(LuidNewUserPicker.IID, LuidNewUserPicker.factory());
}
