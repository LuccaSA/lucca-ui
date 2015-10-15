(function(){
	'use strict';

	var MAX_COUNT = 5; // MAGIC_NUMBER
	var MAGIC_NUMBER_maxUsers = 10000; // Number of users to retrieve when using a user-picker-multiple or custom filter
	var DEFAULT_HOMONYMS_PROPERTIES = ["department.name", "legalEntity.name", "employeeNumber", "mail"]; // MAGIC_STRING

	var uiSelectChoicesTemplate = "<ui-select-choices repeat=\"user in users\" refresh=\"find($select.search)\" refreshDelay=\"200\" ui-disable-choice=\"!!user.overflow\">" +
	"<div ng-bind-html=\"user.firstName + ' ' + user.lastName | highlight: $select.search\" ng-if=\"!user.overflow\"></div>" +
	"<small ng-if=\"!user.overflow && user.hasHomonyms && getProperty(user, property)\" ng-repeat=\"property in properties\">{{property}}: {{getProperty(user, property)}}<br/></small>" +
	"<small ng-if=\"showFormerEmployees && user.isFormerEmployee\">VAR_TRAD Parti(e) le {{user.dtContractEnd | luifMoment: 'll'}}</small>" +
	"<small ng-if=\"user.overflow\">{{user.overflow}}</small>" +
	"</ui-select-choices>";

	var userPickerTemplate = "<ui-select ng-model=\"user\" theme=\"bootstrap\"" +
	"class=\"lui regular nguibs-ui-select\" on-select=\"onSelect()\" on-remove=\"onRemove()\" ng-disabled=\"controlDisabled\">" +
	"<ui-select-match placeholder=\"{{ $select.selected.firstName }} {{$select.selected.lastName}}\">{{ $select.selected.firstName }} {{$select.selected.lastName}}</ui-select-match>" +
	uiSelectChoicesTemplate +
	"</ui-select>";

	var userPickerMultipleTemplate = "<ui-select multiple ng-model=\"selected.users\" theme=\"bootstrap\"" +
	"class=\"lui regular nguibs-ui-select\" on-select=\"addSelectedUser()\" on-remove=\"onRemove()\" ng-disabled=\"controlDisabled\">" +
	"<ui-select-match placeholder=\"VAR_TRAD Sélectionner un utilisateur...\">{{$item.firstName}} {{$item.lastName}} " +
	"<span ng-if=\"$item.hasHomonyms\" ng-repeat=\"property in properties\">&lt{{getProperty($item, property)}}&gt</span>" +
	"<span ng-if=\"$item.isFormerEmployee\">&lt;VAR_TRAD Parti(e) le {{$item.dtContractEnd | luifMoment: 'll'}}&gt;</span>" +
	"</ui-select-match>" +
	uiSelectChoicesTemplate +
	"</ui-select>";


	angular.module('lui.directives')
	.directive('luidUserPicker', function () {
		return {
			restrict: 'E',
			controller: "luidUserPickerController",
			template: userPickerTemplate,
			// require: "luidUserPicker",
			scope: {
				/*** STANDARD ***/
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				/*** FORMER EMPLOYEES ***/
				showFormerEmployees: "=", // boolean
				/*** HOMONYMS ***/
				homonymsProperties: "@", // list of properties to handle homonyms
				/*** CUSTOM FILTER ***/
				customFilter: "&", // should be a function with this signature: function(user){ return boolean; } 
				/*** OPERATION SCOPE ***/
				appId: "@",
				operation: "@"
			},
			link: function (scope, elt, attrs, ctrl) {
				if (attrs.homonymsProperties) {
					scope.properties = attrs.homonymsProperties.split(',');
				}
				else {
					scope.properties = DEFAULT_HOMONYMS_PROPERTIES;
				}
				ctrl.isMultipleSelect = false;
				ctrl.asyncPagination = false;
				ctrl.useCustomFilter = !!attrs.customFilter;
			}
		};
	})

	.directive('luidUserPickerMultiple', function () {
		return {
			restrict: 'E',
			controller: "luidUserPickerController",
			template: userPickerMultipleTemplate,
			// require: "luidUserPicker",
			scope: {
				/*** STANDARD ***/
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				/*** FORMER EMPLOYEES ***/
				showFormerEmployees: "=", // boolean
				/*** HOMONYMS ***/
				homonymsProperties: "@", // list of properties to handle homonyms
				/*** CUSTOM FILTER ***/
				customFilter: "&", // should be a function with this signature: function(user){ return boolean; } 
				/*** OPERATION SCOPE ***/
				appId: "@",
				operation: "@"
			},
			link: function (scope, elt, attrs, ctrl) {
				if (attrs.homonymsProperties) {
					scope.properties = attrs.homonymsProperties.split(',');
				}
				else {
					scope.properties = DEFAULT_HOMONYMS_PROPERTIES;
				}
				ctrl.isMultipleSelect = true;
				ctrl.asyncPagination = false;
				ctrl.useCustomFilter = !!attrs.customFilter;
			}
		};
	})

	.controller("luidUserPickerController", ['$scope', '$http', 'moment', '$timeout', '$q', function ($scope, $http, moment, $timeout, $q) {
		var ctrl = this;
		var promise; // store the current get request to fetch users
		// Only used for UserPickerMultiple
		var selectedUsersCount = 0;
		// Only used for asynchronous pagination
		var timeout = {}; // object that handles timeouts - timeout.count will store the id of the timeout related to the count query

		//$scope.user = {};
		$scope.selected = {};
		$scope.selected.users = [];

		/****************/
		/***** FIND *****/
		/****************/

		$scope.find = function (clue) {
			getUsersAsync(clue).then(
				function(users) {
					var filteredUsers = users;
					var count = filteredUsers.length;

					// Used for UserPickerMultiple only
					if (ctrl.isMultipleSelect) {
						// Remove duplicates between results and selected users
						_.each($scope.selected.users, function (selectedUser) {
							filteredUsers = _.reject(filteredUsers, function (user) {
								return (user.id === selectedUser.id);
							});
						});
						// Number of results matching the query
						count = filteredUsers.length;
					}

					// Used when a custom filtering function is given
					if (ctrl.useCustomFilter) {
						// Get new set of users
						filteredUsers = _.filter(filteredUsers, function(user){ return $scope.customFilter(angular.copy(user)); });
						count = filteredUsers.length;
					}

					if (hasFormerEmployees(filteredUsers)) {
						handleFormerEmployees(filteredUsers);
					}

					if (hasHomonyms(filteredUsers)) {
						tagHomonyms(filteredUsers);
						handleHomonyms(filteredUsers);
					}

					if (hasPagination(filteredUsers)) {
						if (asyncPagination) {
							filteredUsers = addOverflowMessage(filteredUsers, "...");
							// Call the api to get the right count and update the message to the user
							handlePaginationAsync(clue).then(function(cnt){
								count = cnt;
								filteredUsers = updateOverflowMessage(filteredUsers, MAX_COUNT, count);
							}, function(error) {
								// HANDLE ERROR
							});
						}
						else {
							filteredUsers = addOverflowMessage(filteredUsers, count);
						}
					}
					$scope.users = filteredUsers;
					$scope.count = count;
				}, 
				function(error) {
					// HANDLE ERROR
				}
			);
		};

		/*******************/
		/***** TIMEOUT *****/
		/*******************/

		var reinitTimeout = function() {
			// Cancel previous timeout
			if (timeout.count) {
				$timeout.cancel(timeout.count);
			}
		};

		/*****************/
		/***** USERS *****/
		/*****************/

		var getLimit = function() {
			var limit = MAGIC_NUMBER_maxUsers;

			if (ctrl.asyncPagination) {
				limit = MAX_COUNT + 1;
			}
			return limit;
		};

		var getUsersAsync = function(input) {
			var formerEmployees = "formerEmployees=" + ($scope.showFormerEmployees ? "true" : "false");
			var limit = "&limit=" + getLimit();
			var clue = "&clue=" + input;
			var query = "/api/v3/users/find?" + (init ? "" : (clue + "&")) + formerEmployees + limit;
			var deferred = $q.defer();

			// Happen when the user starts typing a name, then waits enough to call the api and continues typing
			// We do not want to treat the result of the previous request since they are now obsolete
			if (promise) {
				promise.then(function (response) {}); // do nothing with the results
			}

			reinitTimeout();

			promise = $http.get(query);
			promise.then(
				function (response) {
					deferred.resolve(response.data.data.items);
				}, 
				function (error) {
					deferred.reject(error); // HANDLE ERROR
				}
			);
			return deferred.promise;
		};

		/**********************/
		/***** PAGINATION *****/
		/**********************/

		var hasPagination = function(users) {
			if (users.length > MAX_COUNT) {
				return true;
			}
			return false;
		};

		var handlePaginationAsync = function(input) {
			var delay = 2500; // default delay is 2,5s
			var deferred = $q.defer();

			reinitTimeout();

			// launch new timeout 
			timeout.count = $timeout(function() {
				getCountAsync(input).then(
					function (count) {
						deferred.resolve(count);
					},
					function (error) {
						// HANDLE ERROR
						deferred.reject(error);
					}
				);
			}, delay);
			return deferred.promise;
		};

		var getCountAsync = function(input) {
			var deferred = $q.defer();
			var dtContractEnd = "&dtcontractend=since," + moment().format("YYYY-MM-DD") + ",null";
			var query = "/api/v3/users?name=like," + input + "&fields=collection.count" + ($scope.showFormerEmployees ? "" : dtContractEnd); // query for count

			delete timeout.count;
			$http.get(query).then(
				function(response) {
					deferred.resolve(response.data.data.count);
				},
				function(error) {
					deferred.reject(error);
				}
			);
			return deferred.promise;
		};

		var addOverflowMessage = function(users, maxNbUsers) {
			var firstUsers = _.first(users, MAX_COUNT);
			firstUsers.push({ overflow: MAX_COUNT + "/" + maxNbUsers });
			return firstUsers;
		};

		var updateOverflowMessage = function(users, nbUsers, maxNbUsers) {
			_.last(users).overflow = nbUsers + "/" + maxNbUsers;
			return users;
		};

		/********************/
		/***** HOMONYMS *****/
		/********************/

		var hasHomonyms = function(users) {
			var usersWithoutHomonyms = _.uniq(users, function(user) { return (user.firstName + user.lastName); });

			if (usersWithoutHomonyms.length < users.length) {
				return true;
			}
			return false;
		};

		var handleHomonyms = function(users) {
			var homonyms = _.where(users, { hasHomonyms: true });
			var homonymsArray = [];

			getHomonymsPropertiesAsync(homonyms).then(
				function (response) {
					// Add homonyms properties for each user
					_.each(homonyms, function(user, item) {
						// Get the returned user
						var userWithProps = response[item].data.data.items[0];

						// Add each property to the user
						_.each($scope.properties, function (prop) {
							var newProp = prop.split('.')[0];
							user[newProp] = userWithProps[newProp];
						});
					});
				},
				function(error) {
					// HANDLE ERROR
				}
			);
		};

		var tagHomonyms = function(users) {
			_.each(users, function (user, index) {
				var rest = _.rest(users, index + 1);
				_.each(rest, function (otherUser) {
					if ((user.firstName === otherUser.lastName) && (user.lastName === otherUser.lastName)) {
						user.hasHomonyms = true;
						otherUser.hasHomonyms = true;
					}
				});

				// Search homonyms in selected users (used by UserPickerMultiple only)
				_.each($scope.selected.users, function (selectedUser) {
					if ((user.firstName === selectedUser.firstName) && (user.lastName === selectedUser.lastName)) {
						user.hasHomonyms = true;
						selectedUser.hasHomonyms = true;
					}
				});
			});
		};

		/*******************************/
		/***** HOMONYMS PROPERTIES *****/
		/*******************************/

		var getHomonymsPropertiesAsync = function(homonyms) {
			var urlCalls = [];
			var queries = [];
			var templateQuery = "/api/v3/users?id=";
			var fields = "&fields=id,name,firstname,lastname,dtcontractend";
			var deferred = $q.defer();

			// WARNING: Do not check if the properties exist!
			// WARNING: If they do not exist, the request will fail
			_.each($scope.properties, function (prop) {
				fields += "," + prop;
			});

			_.each(homonyms, function (user) {
				queries.push(templateQuery + user.id + fields);
			});

			_.each(queries, function (query) {
				urlCalls.push($http.get(query));
			});

			$q.all(urlCalls).then(
				function (response) {
					deferred.resolve(response);
				},
				function (error) {
					deferred.reject(error);
				}
			);
			return deferred.promise;
		};

		$scope.getProperty = function(user, prop) {
			var propList = prop.split('.');
			var value = user[_.first(propList)];

			_.each(propList, function(item) {
				if (value && (item !== _.first(propList))) {
					value = value[item];
				}
			});
			return value;
		};

		/****************************/
		/***** FORMER EMPLOYEES *****/
		/****************************/

		var hasFormerEmployees = function(users) {
			var formerEmployee = _.find(users, function(user) {
				return (moment(user.dtContractEnd).isBefore(moment()));
			});

			if (formerEmployee) {
				return true;
			}
			return false;
		};

		var handleFormerEmployees = function(users) {
			_.each(users, function (user) {
				if (moment(user.dtContractEnd).isBefore(moment())) {
					user.isFormerEmployee = true;
				}
			});
		};

		/*********************/
		/***** ON-SELECT *****/
		/*********************/

		// Used by UserPickerMultiple
		// Function executed when onSelect is fired
		$scope.addSelectedUser = function () {
			$scope.onSelect();
			selectedUsersCount++;
			// Update overflow message
			if ($scope.count > MAX_COUNT) {
				$scope.users = updateOverflowMessage($scope.users, MAX_COUNT - selectedUsersCount, $scope.count);
			}
		};
	}]);
})();

