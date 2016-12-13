(function(){
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment - for tagging former employees
	**  - underscore
	**  - ui.select
	**  - ngSanitize as a result of the dependency to ui.select
	**/

	var MAX_COUNT = 15; // MAGIC_NUMBER
	var MAGIC_NUMBER_maxUsers = 10000; // Number of users to retrieve when using a user-picker-multiple or custom filter
	var DEFAULT_HOMONYMS_PROPERTIES = [{
		"label": "LUIDUSERPICKER_DEPARTMENT",
		"name": "department.name",
		"icon": "location"
	}, {
		"label": "LUIDUSERPICKER_LEGALENTITY",
		"name": "legalEntity.name",
		"icon": "tree list"
	}, {
		"label": "LUIDUSERPICKER_EMPLOYEENUMBER",
		"name": "employeeNumber",
		"icon": "user"
	}, {
		"label": "LUIDUSERPICKER_MAIL",
		"name": "mail",
		"icon": "email"
	}]; // MAGIC LIST OF PROPERTIES

	var uiSelectChoicesTemplate = "<ui-select-choices position=\"down\" repeat=\"user in users\" refresh=\"find($select.search)\" refresh-delay=\"0\" ui-disable-choice=\"!!user.overflow\">" +
	"<div ng-class=\"{dividing: user.isDisplayedFirst}\">" +
		"<div class=\"selected-first\" ng-if=\"!!user.isSelected\" ng-bind-html=\"user.lastName + ' ' + user.firstName | luifHighlight : $select.search : user.info\"></div>" +
		"<div ng-if=\"!!user.isAll\">{{ 'LUIDUSERPICKER_ALL' | translate }}</div>" +
		"<div ng-if=\"!!user.isMe\" ng-bind-html=\"user.lastName + ' ' + user.firstName | luifHighlight : $select.search : user.info : 'LUIDUSERPICKER_ME'\"></div>" +
		"<div ng-if=\"!user.isDisplayedFirst\" ng-bind-html=\"user.lastName + ' ' + user.firstName | luifHighlight : $select.search : user.info\"></div>" +
		"<small ng-if=\"!user.overflow && user.hasHomonyms && getProperty(user, property.name)\" ng-repeat=\"property in displayedProperties\"><i class=\"lui icon {{property.icon}}\"></i> <b>{{property.label | translate}}</b> {{getProperty(user, property.name)}}<br/></small>" +
		"<small ng-if=\"showFormerEmployees && user.isFormerEmployee\" translate translate-values=\"{dtContractEnd:user.dtContractEnd}\">LUIDUSERPICKER_FORMEREMPLOYEE</small>" +
	"</div>" +
	"<small ng-if=\"user.overflow\" translate translate-values=\"{cnt:user.cnt, all:user.all}\">{{user.overflow}}</small>" +
	"</ui-select-choices>";

	var userPickerTemplate = "<ui-select uis-open-close=\"onDropdownToggle(isOpen)\" " +
	"class=\"lui {{size}} \" on-select=\"onSelect()\" on-remove=\"onRemove()\" ng-disabled=\"controlDisabled\">" +
	"<ui-select-match placeholder=\"{{ placeholder }}\" allow-clear=\"{{allowClear}}\">" +
		"<span ng-if=\"!$select.selected.isAll\">{{$select.selected.lastName}} {{ $select.selected.firstName }}</span>" +
		"<span ng-if=\"$select.selected.isAll\">{{ 'LUIDUSERPICKER_ALL' | translate }}</span>" +
	"</ui-select-match>" +
	uiSelectChoicesTemplate +
	"</ui-select>";

	var userPickerMultipleTemplate = "<ui-select multiple uis-open-close=\"onDropdownToggle(isOpen)\" " +
	"class=\"lui {{size}} input\" on-select=\"onSelect()\" on-remove=\"onRemove()\" ng-disabled=\"controlDisabled\" close-on-select=\"false\">" +
	"<ui-select-match placeholder=\"{{ placeholder }}\" allow-clear=\"{{allowClear}}\">{{$item.lastName}} {{$item.firstName}}" +
		"<small ng-if=\"$item.hasHomonyms && getProperty($item, property.name)\" ng-repeat=\"property in displayedProperties\"><b>{{property.label | translate}}</b> {{getProperty($item, property.name)}} </small>" +
		"<small ng-if=\"$item.isFormerEmployee\" translate  translate-values=\"{dtContractEnd:user.dtContractEnd}\">LUIDUSERPICKER_FORMEREMPLOYEE</small>" +
	"</ui-select-match>" +
	uiSelectChoicesTemplate +
	"</ui-select>";


	angular.module('lui.directives')
	.directive('luidUserPicker', function () {
		return {
			restrict: 'E',
			controller: "luidUserPickerController",
			template: userPickerTemplate,
			require: ["luidUserPicker","^ngModel"],
			scope: {
				/*** STANDARD ***/
				// size: "@", // x-short, short, long, x-long
				placeholder: "@",
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				allowClear: "@",
				/*** FORMER EMPLOYEES ***/
				showFormerEmployees: "=", // boolean
				/*** HOMONYMS ***/
				homonymsProperties: "=", // list of properties to handle homonyms
				/*** CUSTOM FILTER ***/
				customFilter: "=", // should be a function with this signature: function(user){ return boolean; }
				/*** OPERATION SCOPE ***/
				appId: "=", // id of the application that users should have access
				operations: "=", // list of operation ids that users should have access
				/*** CUSTOM COUNT ***/
				// Display a custom info in a label next to each user
				// You should only set one of these two attributes, otherwise it will only be 'customInfoAsync' that will be displayed
				// If you need to use a sync and an async functions, use 'customInfoAsync'
				customInfo: "=", // should be a function with this signature: function(user) { return string; }
				customInfoAsync: "=", // should be a function with this signature: function(user) { return promise; }
				/*** DISPLAY ME FIRST ***/
				displayMeFirst: "=", // boolean
				/*** DISPLAY ALL USERS ***/
				displayAllUsers: "=", // boolean
				/*** CUSTOM HTTP SERVICE ***/
				customHttpService: "=", // Custom $http
				/*** BYPASS OPERATIONS FOR ***/
				bypassOperationsFor: "=", // Display these users if they does not have access to the operations but are in the results set
			},
			link: function (scope, elt, attrs, ctrls) {
				var upCtrl = ctrls[0];
				var ngModelCtrl = ctrls[1];
				upCtrl.isMultipleSelect = false;
				upCtrl.asyncPagination = false;
				upCtrl.useCustomFilter = !!attrs.customFilter;
				upCtrl.displayCustomInfo = !!attrs.customInfo || !!attrs.customInfoAsync;
				scope.allowClear = !!attrs.allowClear ? scope.allowClear : false;

				scope.$watch(function() {
					return (ngModelCtrl.$viewValue || {}).id;
				}, function() {
					scope.reorderUsers();
				});

				upCtrl.getSelectedUsers = function() {
					if (!!ngModelCtrl.$viewValue) {
						return [ngModelCtrl.$viewValue];
					}
					return [];
				};
				upCtrl.getSelectedUserIds = function() {
					if(!!ngModelCtrl.$viewValue) {
						return [ngModelCtrl.$viewValue.id];
					}
					return [];
				};
				scope.onDropdownToggle = function(isOpen) {
					if (isOpen) {
						elt.addClass("ng-open");
					} else {
						elt.removeClass("ng-open");
					}
				};
			}
		};
	})

	.directive('luidUserPickerMultiple', function () {
		return {
			restrict: 'E',
			controller: "luidUserPickerController",
			template: userPickerMultipleTemplate,
			require: ["luidUserPickerMultiple", "^ngModel"],
			scope: {
				/*** STANDARD ***/
				// size: "@", // x-small, small, long, x-long
				placeholder: "@",
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				allowClear: "@",
				/*** FORMER EMPLOYEES ***/
				showFormerEmployees: "=", // boolean
				/*** HOMONYMS ***/
				homonymsProperties: "=", // list of properties to handle homonyms
				/*** CUSTOM FILTER ***/
				customFilter: "=", // should be a function with this signature: function(user){ return boolean; }
				/*** OPERATION SCOPE ***/
				appId: "=", // id of the application that users should have access
				operations: "=", // list of operation ids that users should have access
				/*** CUSTOM COUNT ***/
				// Display a custom info in a label next to each user
				// You should only set one of these two attributes, otherwise it will only be 'customInfoAsync' that will be displayed
				// If you need to use a sync and an async functions, use 'customInfoAsync'
				customInfo: "=", // should be a function with this signature: function(user) { return string; }
				customInfoAsync: "=", // should be a function with this signature: function(user) { return promise; }
				/*** DISPLAY ME FIRST ***/
				displayMeFirst: "=", // boolean
				/*** CUSTOM HTTP SERVICE ***/
				customHttpService: "=", // Custom $http
				/*** BYPASS OPERATIONS FOR ***/
				bypassOperationsFor: "=" // Display these users if they does not have access to the operations but are in the results set
			},
			link: function (scope, elt, attrs, ctrls) {
				var upCtrl = ctrls[0];
				var ngModelCtrl = ctrls[1];
				upCtrl.isMultipleSelect = true;
				upCtrl.asyncPagination = false;
				upCtrl.useCustomFilter = !!attrs.customFilter;
				upCtrl.displayCustomInfo = !!attrs.customInfo || !!attrs.customInfoAsync;
				scope.allowClear = !!attrs.allowClear ? scope.allowClear : false;

				scope.$watchCollection(function() {
					return ngModelCtrl.$viewValue;
				}, function() {
					scope.reorderUsers();
				});

				upCtrl.getSelectedUsers = function() {
					return (ngModelCtrl.$viewValue || []);
				};
				upCtrl.getSelectedUserIds = function() {
					if(!!ngModelCtrl.$viewValue){
						return _.pluck(ngModelCtrl.$viewValue, "id");
					}
					return [];
				};
			}
		};
	})

	.controller("luidUserPickerController", ['$scope', '$http', 'moment', '$timeout', '$q', function ($scope, $http, moment, $timeout, $q) {
		var ctrl = this;
		// Only used for UserPickerMultiple
		var selectedUsersCount = 0;
		// Only used for asynchronous pagination
		var timeout = {}; // object that handles timeouts - timeout.count will store the id of the timeout related to the count query
		var initConnectedUser = true; // boolean to initialise the connected user
		var myId; // used for 'display me first' feature
		var isInitialised = false;

		/** HttpService **/
		var getHttpMethod = function(method){
			if($scope.customHttpService &&  $scope.customHttpService[method]){
				return $scope.customHttpService[method];
			}
			return $http[method];
		};

		// Reset list of displayed users when showFormerEmployees attribute changes
		$scope.$watch(function() {
			return $scope.showFormerEmployees;
		}, function(newValue, oldValue) {
			// To avoid 2 calls when view is loaded
			if (newValue !== oldValue && isInitialised) {
				$scope.find();
			}
		});

		/****************/
		/***** FIND *****/
		/****************/
		var filteredUsers;
		var indexedUsers; // fetched users with their original position

		$scope.find = function (clue) {
			reinit();
			// Should only be executed once --> fetch 'me'
			initMe();
			getUsersAsync(clue)
			.then(function(results) {
				isInitialised = true;

				if (results.length > 0) {
					var users = results;
					filteredUsers = filterResults(users) || [];

					// If no clue, add 'all users' to the set of results
					if (!!$scope.displayAllUsers && (!clue || !clue.length)) {
						filteredUsers.push({ id: -1, isAll: true });
					}

					// Useful with user-picker-multiple
					// Store original position of fetched users to handle unselected users and replace them at their original position
					indexedUsers = filteredUsers;
					originalOrder(indexedUsers);

					// Save the order we got from the api
					// Set first users if they belong to the set of results
					// Handle pagination
					$scope.reorderUsers();

					/***** POST FILTERS *****/
					// Execute post filters on indexedUsers to include selected users if it is a user-picker-multiple
					if (hasFormerEmployees(indexedUsers)) {
						handleFormerEmployees(indexedUsers);
					}

					if (hasHomonyms(indexedUsers)) {
						tagHomonyms(indexedUsers);
						handleHomonymsAsync(indexedUsers).then(
							function(usersWithHomonymsProperties) {
								indexedUsers = usersWithHomonymsProperties;
							},
							function(message) {
								errorHandler("GET_HOMONYMS_PROPERTIES", message);
							});
					}
				} else {
					$scope.users = [{overflow: "LUIDUSERPICKER_NORESULTS", id:-1}];
				}
			}, function(message) {
				errorHandler("GET_USERS", message);
			});
		};

		var getUsersPromise; // store the current get request to fetch users
		var reinit = function() {
			reinitTimeout();

			// Reinitialise promise
			// Happen when the user starts typing a name, then waits enough to call the api and continues typing
			// We do not want to treat the result of the previous request since they are now obsolete
			if (getUsersPromise) {
				getUsersPromise.then(function(response) {}); // do nothing with the results
			}
		};

		/*******************/
		/***** FILTERS *****/
		/*******************/

		var filterResults = function(users) {
			var filteredUsers = users;

			// Used when a custom filtering function is given
			if (ctrl.useCustomFilter) {
				filteredUsers = _.filter(users, function(user){ return $scope.customFilter(angular.copy(user)); });
			}
			return filteredUsers;
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

		var getUsersPromises = function(input) {
			var formerEmployees = "formerEmployees=" + ($scope.showFormerEmployees ? "true" : "false");
			var limit = "&limit=" + getLimit();
			var clue = "clue=" + input;
			var operations = "";
			var appInstanceId = "";
			var query = "/api/v3/users/find?" + (input ? (clue + "&") : "") + formerEmployees + limit;
			var promises = [];

			// Both attributes should be defined
			if ($scope.appId && $scope.operations && $scope.operations.length) {
				appInstanceId = "&appinstanceid=" + $scope.appId;
				operations = "&operations=" + $scope.operations.join(',');
			}

			promises.push(getHttpMethod("get")(query + appInstanceId + operations));
			// Send query without operations filter if both bypassOperationsFor and operations are defined
			if (!!$scope.bypassOperationsFor && !!$scope.bypassOperationsFor.length && !!$scope.operations && !!$scope.operations.length) {
				promises.push(getHttpMethod("get")(query));
			}

			return promises;
		};

		var getUsersAsync = function(input) {
			var deferred = $q.defer();

			$q.all(getUsersPromises(input))
			.then(function(responses) {
				var users = responses[0].data.data.items;
				if (!!responses[1]) {
					// For each user to bypass, if he belongs to the set of results without operations filter, add it to the results
					_.each($scope.bypassOperationsFor, function(userId) {
						var userToAdd = _.find(responses[1].data.data.items, function(user) { return user.id === userId; });
						if (!!userToAdd) {
							users.push(userToAdd);
						}
					});
					users = _.chain(users)
					.uniq(function(user) {
						return user.id;
					})
					.sortBy(function(user) {
						return user.lastName;
					})
					.value();
				}
				deferred.resolve(users);
			}, function(response) {
				deferred.reject(response.data.Message);
			});
			return deferred.promise;
		};

		/**********************/
		/***** PAGINATION *****/
		/**********************/

		var hasPagination = function(users) {
			return !!users && users.length > MAX_COUNT;
		};

		var handlePagination = function(users) {
			if (!ctrl.asyncPagination) {
				$scope.count = users.length;
			}
			else {
				$scope.count = "...";
			}
			$scope.users = _.first(users, MAX_COUNT);
			handleOverflowMessage();
		};

		// asyncPagination feature, not yet implemented
		// var handlePaginationAsync = function(input, users) {
		// 	var delay = 2500; // default delay is 2,5s
		// 	var deferred = $q.defer();

		// 	reinitTimeout();
		// 	// Only select the X first users and display a message to the user to indicate that there are more results
		// 	handlePagination(users);

		// 	// launch new timeout
		// 	timeout.count = $timeout(function() {
		// 		getCountAsync(input).then(
		// 			function(count) {
		// 				$scope.count = count;
		// 				handleOverflowMessage();
		// 				deferred.resolve(count);
		// 			},
		// 			function(message) {
		// 				deferred.reject(message);
		// 			}
		// 		);
		// 	}, delay);
		// 	return deferred.promise;
		// };

		// asyncPagination feature, not yet implemented
		// var getCountAsync = function(input) {
		// 	var deferred = $q.defer();
		// 	var dtContractEnd = "&dtcontractend=since," + moment().format("YYYY-MM-DD") + ",null";
		// 	var query = "/api/v3/users?name=like," + input + "&fields=collection.count" + ($scope.showFormerEmployees ? "" : dtContractEnd); // query for count

		// 	delete timeout.count;
		// 	getHttpMethod("get")(query).then(
		// 		function(response) {
		// 			deferred.resolve(response.data.data.count);
		// 		},
		// 		function(message) {
		// 			deferred.reject(message);
		// 		}
		// 	);
		// 	return deferred.promise;
		// };

		var handleOverflowMessage = function() {
			$scope.users.push({ overflow: "LUIDUSERPICKER_OVERFLOW", cnt:MAX_COUNT, all:$scope.count,  id:-1 });
		};

		/********************/
		/***** HOMONYMS *****/
		/********************/

		var hasHomonyms = function(users) {
			// Should latinise names and take into account composite names
			var usersWithoutHomonyms = _.uniq(users, function(user) {
				if (user.firstName && user.lastName) {
					return (user.firstName.toLowerCase() + user.lastName.toLowerCase());
				}
			});
			if (usersWithoutHomonyms.length < users.length) {
				return true;
			}
			return false;
		};

		var handleHomonymsAsync = function(users) {
			var homonyms = _.where(users, { hasHomonyms: true });
			var found = false; // indicate if we have found two properties allowing to differentiate homonyms
			var deferred = $q.defer();
			var propertiesArray; // Will contain each couple of properties to compare
			var properties; // Object containing the couple of properties to compare
			var emergencyProperty; // used if NO couple of differentiating properties are found. In this case, only one property will be displayed
			var props; // List of properties that will be fetched in case of homonyms
			$scope.displayedProperties = []; // Will contain the name of the properties to display for homonyms

			// Define properties to fetch for homonyms
			if (!!$scope.homonymsProperties && $scope.homonymsProperties.length) {
				props = $scope.homonymsProperties;
			} else {
				props = DEFAULT_HOMONYMS_PROPERTIES;
			}
			getHomonymsPropertiesAsync(homonyms, props)
			.then(function(homonymsArray) {
					// Add fetched properties to the homonyms
					_.each(homonyms, function(user) {
						// Get the user returned by the api
						var userWithProps = _.find(homonymsArray, function(homonym) {
							return (user.id === homonym.id);
						});

						// Add each property to the user
						_.each(props, function(prop) {
							var newProp = prop.name.split('.')[0];
							if (!!userWithProps && !!userWithProps[newProp]) {
								user[newProp] = userWithProps[newProp];
							}
						});
					});

					// Compare properties between homonyms
					_.each(props, function (prop1, propIndex1) {
						if (!found) {
							// Compare prop1 with the rest of the properties array
							var propRest = _.rest(props, propIndex1 + 1);
							_.each(propRest, function (prop2, index) {
								if (!found) {
									// Build array with the two properties
									// Each element of the array is an object with the properties that we want to compare
									propertiesArray = [];
									_.each(homonymsArray, function(item) {
										var valueProp1 = $scope.getProperty(item, prop1.name);
										var valueProp2 = $scope.getProperty(item, prop2.name);
										properties = {};
										properties[prop1.name] = valueProp1;
										properties[prop2.name] = valueProp2;
										propertiesArray.push(properties);
									});

									// Used to check that all values for prop1 are not equal
									var prop1Values = _.chain(propertiesArray)
									.pluck(prop1.name)
									.uniq()
									.value();
									// Used to check that all values for prop2 are not equal
									var prop2Values = _.chain(propertiesArray)
									.pluck(prop2.name)
									.uniq()
									.value();

									// prop1 is a differentiating property: each homonym has a different value for this property
									// if we do not find a couple of differentiating properties, we will at least display this one
									if ((!emergencyProperty) && (prop1Values.length === homonyms.length)) {
										emergencyProperty = prop1;
									}

									// All values for both properties must not be equal
									// There must be at least two different values
									if ((prop1Values.length > 1) && (prop2Values.length > 1)) {
										// Check that each couple of values is different from the other couples
										var withoutDuplicates = _.uniq(propertiesArray, function(item) { return (item[prop1.name] + item[prop2.name]); });
										// If the arrays have the same length, each couple of values is different
										if (withoutDuplicates.length === propertiesArray.length) {
											found = true;
											$scope.displayedProperties.push(prop1);
											$scope.displayedProperties.push(prop2);
										}
									}
								}
							});
						}
					});

					// If no couple of properties are differentiating, we will display the first differentiating property (values are different for all homonyms)
					if (!found && emergencyProperty) {
						$scope.displayedProperties.push(emergencyProperty);
					}
					deferred.resolve(users);
			}, function(message) {
				deferred.reject(message);
			});
			return deferred.promise;
		};

		var tagHomonyms = function(users) {
			_.each(users, function(user, index) {
				if (user.firstName && user.lastName) {
					var rest = _.rest(users, index + 1);
					_.each(rest, function(otherUser) {
						if (otherUser.firstName && otherUser.lastName) {
							// Should latinise names and take into account composite names
							if ((user.firstName.toLowerCase() === otherUser.firstName.toLowerCase()) && (user.lastName.toLowerCase() === otherUser.lastName.toLowerCase())) {
								user.hasHomonyms = true;
								otherUser.hasHomonyms = true;
							}
						}
					});
				}
			});
		};

		/*******************************/
		/***** HOMONYMS PROPERTIES *****/
		/*******************************/

		var getHomonymsPropertiesAsync = function(homonyms, properties) {
			var urlCalls = [];
			var query = "/api/v3/users?id=";
			var fields = "&fields=id,firstname,lastname";
			var deferred = $q.defer();

			// WARNING: Do not check if the properties exist!
			// WARNING: If they do not exist, the request will fail
			_.each(properties, function(prop) {
				fields += "," + prop.name;
			});

			_.each(homonyms, function(user) {
				if (user !== _.last(homonyms)) {
					query += (user.id + ',');
				}
				else {
					query += (user.id + fields);
				}
			});

			getHttpMethod("get")(query)
			.then(function(response) {
				deferred.resolve(response.data.data.items);
			}, function(response) {
				deferred.reject(response.data.Message);
			});
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
			_.each(users, function(user) {
				if (user.id !== -1) {
					if (moment(user.dtContractEnd).isBefore(moment())) {
						user.isFormerEmployee = true;
					}
				}
			});
		};

		/***********************/
		/***** CUSTOM INFO *****/
		/***********************/

		var addInfoToUsers = function() {
			if ($scope.customInfo) {
				_.each($scope.users, function(user) {
					// We do not want customInfo to be called with overflow message or 'all users'
					// And we do not call customInfo if an info is already displayed
					if (user.id !== -1 && !user.info) {
						user.info = $scope.customInfo(angular.copy(user));
					}
				});
			}
			if ($scope.customInfoAsync) {
				_.each($scope.users, function(user) {
					// We do not want customInfoAsync to be called with overflow message or 'all users'
					// And we do not call customInfo if an info is already displayed
					if (user.id !== -1 && !user.info) {
						$scope.customInfoAsync(angular.copy(user))
						.then(function(info) {
							user.info = info;
						}, function(message) {
							errorHandler("GET_CUSTOM_INFO", message);
						});
					}
				});
			}
		};

		/**************/
		/***** ME *****/
		/**************/

		var initMe = function() {
			if (initConnectedUser && !!$scope.displayMeFirst) {
				getMeAsync().then(function(id) {
					myId = id;
				}, function(message) {
					errorHandler("GET_ME", message);
				});
				initConnectedUser = false;
			}
		};

		var getMeAsync = function() {
			var query = "/api/v3/users/me?fields=id";
			var dfd = $q.defer();
			getHttpMethod("get")(query)
			.then(function(response) {
				dfd.resolve(response.data.data.id);
			}, function(response) {
				dfd.reject(response.data.Message);
			});
			return dfd.promise;
		};

		/*************************/
		/***** DISPLAY USERS *****/
		/*************************/

		var originalOrder = function(users){
			if (!users || users.length === 0) { return users; }
			// do the users have an original order
			// this is in case we select different choices without calling find()
			if (users[0].originalPosition !== undefined) {
				// if so reorder them first
				users = _.sortBy(users, 'originalPosition');
			} else {
				// this is the original order we have to save
				_.each(users, function(u, index){ u.originalPosition = index; });
			}
			return users;
		};

		var displaySomeUsersFirst = function(users) {
			var sortedUsers = users;
			var selectedUser = !ctrl.isMultipleSelect ? _.find(users, function(user) { return user.id === ctrl.getSelectedUserIds()[0]; }) : null;
			var me = _.find(users, function(user) { return user.id === myId; });
			var all = _.findWhere(users, { isAll: true });

			// Display me first
			// Only if it is not a multiple user picker
			if (!!me && (!selectedUser || me.id !== selectedUser.id)) {
				me.isMe = true;
				sortedUsers = displayThisUserFirst(me, sortedUsers);
			}
			// Display "all users" first
			if (!!all) {
				sortedUsers = displayThisUserFirst(all, sortedUsers);
			}
			// Display selected user first
			if (!!selectedUser && (!all || selectedUser.id !== all.id)) {
				selectedUser.isSelected = true;
				sortedUsers = displayThisUserFirst(selectedUser, sortedUsers);
			}
			return sortedUsers;
		};

		// Display the user first
		var displayThisUserFirst = function(user, users) {
			var sortedUsers = users;
			if(!users || !users.length){ return; }
			// do the users have an original order
			// this is in case we select different choices without calling find()

			var partitions = _.partition(users, function(u) { return (u.id === user.id); }); // [[user], [rest]]

			// Sort users with 'user' as first result
			sortedUsers = _.union(partitions[0], partitions[1]);
			sortedUsers[0].isDisplayedFirst = true;

			return sortedUsers;
		};

		var removeDisplayProperties = function(users) {
			// Set display properties to false
			_.each(users, function(user) {
				user.isDisplayedFirst = false;
				user.isSelected = false;
				user.isMe = false;
			});
		};

		// this function is called when the filter results must be reordered for some reason
		// when the selected user changes for example, he has to be displayed as first result
		$scope.reorderUsers = function() {
			if (ctrl.isMultipleSelect) {
				// Compute ids to display from indexedUsers in order to handle unselected users
				var idsToDisplay = _.difference(_.pluck(indexedUsers, "id"), ctrl.getSelectedUserIds());
				filteredUsers = _.filter(indexedUsers, function(user) {
					return _.contains(idsToDisplay, user.id);
				});
			}

			// reorder them to their original order
			filteredUsers = originalOrder(filteredUsers);
			removeDisplayProperties(filteredUsers);
			// display some users first
			filteredUsers = displaySomeUsersFirst(filteredUsers);
			// Handle pagination
			if (hasPagination(filteredUsers)) {
				handlePagination(filteredUsers);
			} else {
				$scope.users = filteredUsers;
				$scope.count = ($scope.users||[]).length;
			}

			if (ctrl.displayCustomInfo) {
				addInfoToUsers();
			}
		};

		/**************************/
		/***** ERROR HANDLING *****/
		/**************************/

		var errorHandler = function(cause, message) {
			switch (cause) {
				case "GET_USERS": // error while trying to get the users matching the query
					$scope.users = [];
					$scope.users.push({ overflow: "LUIDUSERPICKER_ERR_GET_USERS", id:-1 });
					console.log({cause:cause, message:message});
					break;
				case "GET_COUNT": // error while trying to get the total number of users matching the query
				case "GET_HOMONYMS_PROPERTIES":  // error while trying to get the distinctive properties for homonyms
				case "GET_CUSTOM_INFO": // error while executing the customInfoAsync() function
				case "GET_ME": // error while trying to get the connected user
					console.log({cause:cause, message:message});
					break;
			}
		};
	}])

	// Filter to display custom info next to each user
	// Highlight the search in the name of the user and display a label next to each user
	.filter('luifHighlight', ['$filter', '$translate', function($filter, $translate) {
		return function(_input, _clue, _info, _key) {
			return (!!_info ? "<span class=\"lui label\">" + _info + "</span>" : "") + (!!_key ? "<i>" + $translate.instant(_key) + "</i> " : "") + "<span>" + $filter('highlight')(_input, _clue) + "</span>";
		};
	}]);

	/**************************/
	/***** TRANSLATIONS   *****/
	/**************************/
	angular.module('lui.translates.userpicker').config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('en', {
			"LUIDUSERPICKER_FORMEREMPLOYEE":"Left on {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS":"No results",
			"LUIDUSERPICKER_ERR_GET_USERS":"Error while loading users",
			"LUIDUSERPICKER_OVERFLOW":"{{cnt}} displayed results of {{all}}",
			// "LUIDUSERPICKER_PLACEHOLDER":"Type a last name or first name...",
			"LUIDUSERPICKER_DEPARTMENT":"Department",
			"LUIDUSERPICKER_LEGALENTITY":"Legal entity",
			"LUIDUSERPICKER_EMPLOYEENUMBER":"Employee number",
			"LUIDUSERPICKER_MAIL":"Email",
			"LUIDUSERPICKER_ME":"Me:",
			"LUIDUSERPICKER_ALL":"All users",
		});
		$translateProvider.translations('de', {
			"LUIDUSERPICKER_FORMEREMPLOYEE":"Verließ die {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS":"Keine Ergebnisse",
			"LUIDUSERPICKER_ERR_GET_USERS":"Fehler",
			"LUIDUSERPICKER_OVERFLOW":"Es werden {{cnt}} auf {{all}} Benutzernamen",
			// "LUIDUSERPICKER_PLACEHOLDER":"Geben Sie einen Benutzernamen...",
			"LUIDUSERPICKER_DEPARTMENT":"Abteilung",
			"LUIDUSERPICKER_LEGALENTITY":"Rechtsträger",
			"LUIDUSERPICKER_EMPLOYEENUMBER":"Betriebsnummer",
			"LUIDUSERPICKER_MAIL":"E-mail",
			"LUIDUSERPICKER_ME":"Mir:",
			"LUIDUSERPICKER_ALL":"Alle Benutzer",
		});
		$translateProvider.translations('es', {

		});
		$translateProvider.translations('fr', {
			"LUIDUSERPICKER_FORMEREMPLOYEE":"Parti(e) le {{dtContractEnd | luifMoment : 'LL'}}",
			"LUIDUSERPICKER_NORESULTS":"Aucun résultat",
			"LUIDUSERPICKER_ERR_GET_USERS":"Erreur lors de la récupération des utilisateurs",
			"LUIDUSERPICKER_OVERFLOW":"{{cnt}} résultats affichés sur {{all}}",
			// "LUIDUSERPICKER_PLACEHOLDER":"Saisissez un nom, prénom...",
			"LUIDUSERPICKER_DEPARTMENT":"Service",
			"LUIDUSERPICKER_LEGALENTITY":"Entité légale",
			"LUIDUSERPICKER_EMPLOYEENUMBER":"Matricule",
			"LUIDUSERPICKER_MAIL":"Email",
			"LUIDUSERPICKER_ME":"Moi :",
			"LUIDUSERPICKER_ALL":"Tous les utilisateurs",
		});
		$translateProvider.translations('it', {

		});
		$translateProvider.translations('nl', {

		});
	}]);
})();
