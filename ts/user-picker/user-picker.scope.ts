module lui.userpicker {
	"use strict";

	export interface ILuidUserPickerScope extends ng.IScope {
		placeholder: string;

		/** Indicates if the user-picker has to display the former employees */
		showFormerEmployees: boolean;

		/** Indicates if the connected user has to displayed first in the dropdown */
		displayMeFirst: boolean;

		/** Indicates if the control is disabled or not */
		controlDisabled: boolean;

		/** List of properties used to differentiate the homonyms users */
		homonymsProperties: IHomonymProperty[];

		/** Custom http service given to the user-picker service */
		customHttpService: ng.IHttpService;

		/** The set of results should have access to the application matching this id */
		appId: number;

		/** list of operations that the set of results should support for the given application */
		operations: string[];

		/** List of users ids that must be displayed even if they shouldn't be because of the given appID and operations */
		bypassOperationsFor: number[];

		/** If true, disables paging and display all the users at once */
		displayAllUsers: boolean;

		/** Callback called when a user is selected */
		onSelect: () => any;

		/** Callback called when a user is unselected */
		onRemove: () => any;

		/**
		 * Function that filters users. For a given user, returns if he should be kept in the set of results or not.
		 * @param {IUserLookup} user The user you want to filter.
		 */
		customFilter: (user: IUserLookup) => boolean;

		/**
		 * Function that will return the information to display next to each user.
		 * @param {IUserLookup} user The user for whom you need custom information.
		 */
		customInfo: (user: IUserLookup) => string;

		/**
		 * Same idea than custom-info, except that the information is fetched asynchronously.
		 * @param {IUserLookup} user The user for whom you need custom information.
		 */
		customInfoAsync: (user: IUserLookup) => ng.IPromise<string>;

		// // // //

		users: IUserLookup[];

		lastPagingOffset: number;
		myId: number;
		apiUrl: string;
		selectedUser: IUserLookup;
		loadingMore: boolean;
		selectedUsers: IUserLookup[];
		onSelectedUserChanged(user: IUserLookup): void;
		find(search: string): void;
		loadMore(): void;

		// Specific to the luid-select-multiple
		onSelectedUsersChanged(): void;
		onSelectedUserRemoved(): void;
	}
}
