module lui.userpicker {
	"use strict";

	/**
	 * List containing the default properties used to differentiate homonyms users when
	 * the user of the user-picker doesn't specify the 'homonymsProperties' attribute.
	 */
	const DEFAULT_HOMONYMS_PROPERTIES: IHomonymProperty[] = [
		<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_DEPARTMENT", name: "department.name", icon: "location" },
		<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_LEGALENTITY", name: "legalEntity.name", icon: "tree list" },
		// <ISimpleProperty>{ translationKey: "LUIDUSERPICKER_EMPLOYEENUMBER", name: "employeeNumber", icon: "user" },
		<IHomonymProperty>{ translationKey: "LUIDUSERPICKER_MAIL", name: "mail", icon: "email" },
	];

	/**
	 * Number of user fetched each time the API is called.
	 *
	 * **Warning**: if the value is to low, the scrollbar will not show up
	 * in the user picker, and the user will not be able to load more users.
	 */
	export const MAGIC_PAGING = 15;
	export const MAX_SEARCH_LIMIT = 10000;

	/**
	 * Controller of the luid-user-picker directive as well as the luid-user-picker-multiple directive.
	 */
	export class LuidUserPickerController {
		public static IID: string = "luidUserPickerController";
		public static $inject: Array<string> = ["$scope", "$q", "userPickerService"];

		private $scope: ILuidUserPickerScope;
		private $q: ng.IQService;
		private userPickerService: IUserPickerService;

		private ngModelCtrl: ng.INgModelController;

		/** Indicates if the controller controls a user-picker or a user-picker-multiple directive */
		private multiple: boolean;

		constructor(
			$scope: ILuidUserPickerScope,
			$q: ng.IQService,
			userPickerService: IUserPickerService) {

			this.$scope = $scope;
			this.$q = $q;
			this.userPickerService = userPickerService;
			this.userPickerService.setCustomHttpService($scope.customHttpService);

			this.$scope.lastPagingOffset = 0;
			this.$scope.users = new Array<IUserLookup>();
			this.userPickerService.getMyId().then((id: number) => {
				this.$scope.myId = id;
				this.refresh().then((users: IUserLookup[]) => {
					// To avoid triggering the multiple $scope.$watch before getting the first page of data
					this.initializeScope();
				});
			});
		}

		public setNgModelCtrl(ngModelCtrl: ng.INgModelController, multiple: boolean = false): void {
			this.multiple = true;
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				if (this.multiple) {
					this.$scope.selectedUsers = <IUserLookup[]>this.getViewValue();
				} else {
					this.$scope.selectedUser = <IUserLookup>this.getViewValue();
				}
			};
		}
		private getViewValue(): IUserLookup | IUserLookup[] { return this.ngModelCtrl.$viewValue; }
		private setViewValue(value: IUserLookup | IUserLookup[]): void {
			this.ngModelCtrl.$setViewValue(angular.copy(value));
			this.ngModelCtrl.$setTouched();
		}

		/**
		 * Initialize the functions of the scope.
		 */
		private initializeScope(): void {
			this.$scope.$watch("displayMeFirst", (newValue: boolean, oldValue) => {
				if (this.$scope.displayMeFirst) {
					if (newValue) {
						let myIndex = _.findIndex(this.$scope.users, (user: IUserLookup) => { return user.id === this.$scope.myId; });
						if (myIndex !== -1) {
							let me = this.$scope.users[myIndex];
							this.$scope.users.splice(myIndex, 1);
							this.$scope.users.unshift(me);
						} else {
							this.userPickerService.getMe().then((me: IUserLookup) => {
								this.tidyUp([me]).then((meComplete: IUserLookup[]) => {
									this.$scope.users.unshift(meComplete[0]);
								});
							});
						}
					}
				}
			});

			this.$scope.$watch("showFormerEmployees", (newValue: boolean, oldValue: boolean) => {
				if (!!this.$scope.showFormerEmployees && newValue !== oldValue) {
					this.resetUsers();
					this.refresh();
				}
			});

			this.$scope.$watchCollection("bypassOperationsFor", (newValue: number[], oldValue: number[]) => {
				if (newValue !== undefined) {
					this.userPickerService.getUsersByIds(newValue).then((bypassedUsers: IUserLookup[]) => {
						this.tidyUp(bypassedUsers).then((completedByPassedUsers: IUserLookup[]) => {
							_.each(completedByPassedUsers, (byPassedUser: IUserLookup) => {
								if (_.find(this.$scope.users, (user: IUserLookup) => { return user.id === byPassedUser.id; }) === undefined) {
									this.$scope.users.push(byPassedUser);
								}
							});
						});
					});
				}
			});

			this.$scope.$watchGroup(["appId", "operations"], (newValue: [number, string[]], oldValue: [number, string[]]) => {
				if (angular.isDefined(newValue) && angular.isDefined(newValue[0]) &&
					angular.isDefined(newValue[1]) && newValue[1].length > 0 &&
					newValue[0] !== oldValue[0] && !_.isEqual(newValue[1], oldValue[1])) {
					this.resetUsers();
					this.refresh();
				}
			});

			this.$scope.find = (search: string): void => {
				this.resetUsers();
				this.refresh(search);
			};

			this.$scope.loadMore = (): void => {
				if (!this.$scope.loadingMore) {
					this.$scope.lastPagingOffset += MAGIC_PAGING;
					this.$scope.loadingMore = true;
					this.refresh().then(() => { this.$scope.loadingMore = false; });
				}
			};

			this.$scope.onSelectedUserChanged = (user: IUserLookup): void => {
				this.setViewValue(user);
				if (!!this.$scope.onSelect()) {
					this.$scope.onSelect();
				}
			};

			this.$scope.onSelectedUsersChanged = (): void => {
				this.setViewValue(this.$scope.selectedUsers);
				if (!!this.$scope.onSelect()) {
					this.$scope.onSelect();
				}
			};

			this.$scope.onSelectedUserRemoved = (): void => {
				this.setViewValue(this.$scope.selectedUsers);
				if (!!this.$scope.onRemove()) {
					this.$scope.onRemove();
				}
			};
		}

		/**
		 * Fetches most of the additional properties given in the attributes of the directive (custom-info, customInfoAsync, etc).
		 * Also handles homonyms.
		 */
		private tidyUp(users: IUserLookup[], clue: string = ""): ng.IPromise<IUserLookup[]> {
			let promises = new Array<ng.IPromise<any>>();
			let customInfoDico: { [userId: number]: ng.IPromise<string> } = {};
			let homonymsDico: { [userId: number]: number } = {};

			_.each(users, (user: IUserLookup) => {
				user.hasLeft = !!user.dtContractEnd && moment(user.dtContractEnd).isBefore(moment().startOf("day"));
			});

			// if (!!this.$scope.customFilter) {
			// 	users = _.filter(users, (user: IUserLookup) => { return this.$scope.customFilter(user); });
			// }
			if (!!this.$scope.customInfo) {
				_.each(users, (user: IUserLookup) => {
					user.info = this.$scope.customInfo(user);
				});
			}
			if (!!this.$scope.customInfoAsync) {
				_.each(users, (user: IUserLookup) => {
					customInfoDico[user.id.toString()] = promises.push(this.$scope.customInfoAsync(user)) - 1;
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
				if (!!homonyms && homonyms.length > 0) {
					_.each(users, (user: IUserLookup) => {
						if (angular.isDefined(homonymsDico[user.id])) {
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
						if (angular.isDefined(user.info) && user.info !== "") {
							user.info = user.info + " " + values[indexInValuesArray];
						} else {
							user.info = values[indexInValuesArray];
						}
					});
				}
				return users;
			});
		}

		private refresh(clue: string = ""): ng.IPromise<any> {
			return this.getUsers(clue).then(users => this.tidyUpAndAssign(users, clue));
		}

		// gets the users according to clue, also adds me and all if needed
		// handles paging and customfilter
		private getUsers(clue: string = ""): ng.IPromise<IUserLookup[]> {
			let paging = MAGIC_PAGING;
			let offset = this.$scope.lastPagingOffset;
			// only use paging if no customfilter
			let fetchPaging = paging;
			let fetchOffset = offset;
			if (!!this.$scope.customFilter) {
				fetchPaging = MAX_SEARCH_LIMIT;
				fetchOffset = 0;
			}

			let get = () => {
				return this.userPickerService.getUsers(this.getFilter(clue), fetchPaging, fetchOffset)
				.then(users => {
					if (!!this.$scope.customFilter) {
						return _.chain(users)
						.filter(u => this.$scope.customFilter(u))
						.rest(offset)
						.first(paging)
						.value();
					}
					return users;
				});
			};

			return this.$q.all([
				get(),
				this.userPickerService.getMe(),
			]).then((datas: [IUserLookup[], IUserLookup]) => {
					let allUsers = datas[0];
					let me = datas[1];
					if (!offset) {
						if (!clue && this.$scope.displayAllUsers) {
							let all: IUserLookup = { id: -1, firstName: "", lastName: "" };
							allUsers.unshift(all);
						}
						if (!clue && this.$scope.displayMeFirst) {
							let myIndex = _.findIndex(allUsers, (user: IUserLookup) => { return user.id === this.$scope.myId; });
							if (myIndex !== -1) {
								allUsers.splice(myIndex, 1);
							}
							allUsers.unshift(me);
						}
					}
					return allUsers;
				});
		}

		private tidyUpAndAssign(allUsers: IUserLookup[], clue: string): ng.IPromise<IUserLookup[]> {
			return this.tidyUp(allUsers, clue)
				.then((neatUsers: IUserLookup[]) => {
					this.$scope.users = this.$scope.users || [];
					// No duplication
					this.$scope.users.push(..._.filter(neatUsers, (neatUser: IUserLookup) => { return !_.any(this.$scope.users, (user: IUserLookup) => { return user.id === neatUser.id; }); }));
					return this.$scope.users;
				});
		}

		/**
		 * Clean $scope.users and reset the last paging offset.
		 */
		private resetUsers(): void {
			this.$scope.users = [];
			this.$scope.lastPagingOffset = 0;
		}

		/**
		 * Update the filters string given to the service.
		 * @param {string} clue what the users wrote in the search input
		 */
		private getFilter(clue: string): string {
			let s = this.$scope;
			let filter =
				"formerEmployees=" + (!!s.showFormerEmployees ? s.showFormerEmployees.toString() : "false") +
				(!!s.appId && !!s.operations && s.operations.length > 0 ? "&appinstanceid=" + s.appId + "&operations=" + s.operations.join(",") : "") +
				(!!clue ? "&clue=" + clue : "");
				// (!!clue || s.disablePaging ? "&paging=0," + MAX_SEARCH_LIMIT : "&paging=" + s.lastPagingOffset + "," + MAGIC_PAGING);
			return filter;
		}
	}

	angular.module("lui").controller(LuidUserPickerController.IID, LuidUserPickerController);

	/**
	 * Filter to display custom info next to each user
	 * Highlight the search in the name of the user and display a label next to each user
	 */
	angular.module("lui").filter("luifHighlight", ["$filter", "$translate",
		function ($filter: ng.IFilterService, $translate: ng.translate.ITranslateService): (input: string, clue: string, info: string, key: string) => string {
			return function (_input: string, _clue: string, _info: string, _key: string): string {
				let highlight = <(input: string, clue: string) => string>$filter("highlight");
				return (!!_info ? "<span class=\"lui label\">" + _info + "</span>" : "") + (!!_key ? "<i>" + $translate.instant(_key) + "</i> " : "") + "<span>" + highlight(_input, _clue) + "</span>";
			};
		}]);

	/**
	 * Translations dictionaries used by the luid-user-picker directive.
	 */
	angular.module("lui.translate").config(["$translateProvider", function ($translateProvider: ng.translate.ITranslateProvider): void {
		$translateProvider.translations("en", {
			"LUIDUSERPICKER_FORMEREMPLOYEE": "Left on {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS": "No results",
			"LUIDUSERPICKER_ERR_GET_USERS": "Error while loading users",
			"LUIDUSERPICKER_OVERFLOW": "{{cnt}} displayed results of {{all}}",
			// "LUIDUSERPICKER_PLACEHOLDER":"Type a last name or first name...",
			"LUIDUSERPICKER_DEPARTMENT": "Department",
			"LUIDUSERPICKER_LEGALENTITY": "Legal entity",
			"LUIDUSERPICKER_EMPLOYEENUMBER": "Employee number",
			"LUIDUSERPICKER_MAIL": "Email",
			"LUIDUSERPICKER_ME": "Me:",
			"LUIDUSERPICKER_ALL": "All users",
		});
		$translateProvider.translations("de", {
			"LUIDUSERPICKER_FORMEREMPLOYEE": "Verließ die {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS": "Keine Ergebnisse",
			"LUIDUSERPICKER_ERR_GET_USERS": "Fehler",
			"LUIDUSERPICKER_OVERFLOW": "Es werden {{cnt}} auf {{all}} Benutzernamen",
			// "LUIDUSERPICKER_PLACEHOLDER":"Geben Sie einen Benutzernamen...",
			"LUIDUSERPICKER_DEPARTMENT": "Abteilung",
			"LUIDUSERPICKER_LEGALENTITY": "Rechtsträger",
			"LUIDUSERPICKER_EMPLOYEENUMBER": "Betriebsnummer",
			"LUIDUSERPICKER_MAIL": "E-mail",
			"LUIDUSERPICKER_ME": "Mir:",
			"LUIDUSERPICKER_ALL": "Alle Benutzer",
		});
		$translateProvider.translations("fr", {
			"LUIDUSERPICKER_FORMEREMPLOYEE": "Parti(e) le {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS": "Aucun résultat",
			"LUIDUSERPICKER_ERR_GET_USERS": "Erreur lors de la récupération des utilisateurs",
			"LUIDUSERPICKER_OVERFLOW": "{{cnt}} résultats affichés sur {{all}}",
			// "LUIDUSERPICKER_PLACEHOLDER":"Saisissez un nom, prénom...",
			"LUIDUSERPICKER_DEPARTMENT": "Service",
			"LUIDUSERPICKER_LEGALENTITY": "Entité légale",
			"LUIDUSERPICKER_EMPLOYEENUMBER": "Matricule",
			"LUIDUSERPICKER_MAIL": "Email",
			"LUIDUSERPICKER_ME": "Moi :",
			"LUIDUSERPICKER_ALL": "Tous les utilisateurs",
		});
	}]);
}
