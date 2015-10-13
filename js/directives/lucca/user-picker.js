(function(){
	'use strict';

	var MAX_COUNT = 5; // MAGIC_NUMBER
	var DEFAULT_HOMONYMS_PROPERTIES = ["department.name", "legalEntity.name", "employeeNumber", "mail"]; // MAGIC_STRING

	var uiSelectChoicesTemplate = "<ui-select-choices repeat=\"user in users\" refresh=\"find($select.search)\" refreshDelay=\"200\" ui-disable-choice=\"!!user.overflow\">" +
		"<div ng-bind-html=\"user.firstName + ' ' + user.lastName | highlight: $select.search\" ng-if=\"!user.overflow\"></div>" +
		"<small ng-if=\"!user.overflow && user.hasHomonyms && getProperty(user, property)\" ng-repeat=\"property in properties\">{{property}}: {{getProperty(user, property)}}<br/></small>" +
		"<small ng-if=\"showFormerEmployees && user.isFormerEmployee\">VAR_TRAD Parti(e) le {{user.dtContractEnd | luifMoment: 'll'}}</small>" +
		"<small ng-if=\"user.overflow\">{{user.overflow}}</small>" +
	"</ui-select-choices>";

	var userPickerTemplate = "<ui-select theme=\"bootstrap\"" +
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


	angular.module('lui.directive')
	.directive('luidUserPicker', function () {
		return {
			restrict: 'E',
			controller: "luiUserPickerController",
			template: userPickerTemplate,
			require: "luidUserPicker",
			scope: {
				showFormerEmployees: "=",
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				useCustomFilter: "=",
				customFilter: "&",
				appId: "@",
				operation: "@",
				homonymsProperties: "@"
			},
			link: function (scope, elt, attrs, ctrls) {
				if (attrs.homonymsProperties) {
					scope.properties = attrs.homonymsProperties.split(',');
				}
				else {
					scope.properties = DEFAULT_HOMONYMS_PROPERTIES;
				}
			}
		};
	})

	.directive('luiUserPickerMultiple', function () {
		return {
			restrict: 'E',
			controller: "luiUserPickerController",
			template: userPickerMultipleTemplate,
			require: "luiUserPickerMultiple",
			scope: {
				showFormerEmployees: "=",
				onSelect: "&",
				onRemove: "&",
				controlDisabled: "=",
				useCustomFilter: "=",
				customFilter: "&",
				appId: "@",
				operation: "@",
				homonymsProperties: "@"
			},
			link: function (scope, elt, attrs, ctrls) {
				if (attrs.homonymsProperties) {
					scope.properties = attrs.homonymsProperties.split(',');
				}
				else {
					scope.properties = DEFAULT_HOMONYMS_PROPERTIES;
				}
			}
		};
	})

	.controller("luiUserPickerController", ['$scope', '$http', 'moment', '$timeout', '$q', function ($scope, $http, moment, $timeout, $q) {
		var timeout = {};
		var promise;
		var maxUsers = 0;
		var selectedUsersCount = 0;

		$scope.user = {};
		$scope.selected = {};
		$scope.selected.users = [];

		var init = function () {
			// To update with right query
			var fields = "fields=id,name,firstname,lastname,collection.count";
			var dtContractEnd = "dtcontractend=since," + moment().format("YYYY-MM-DD") + ",null";
			var query = "/api/v3/users?" + fields + ($scope.showFormerEmployees ? "" : "&" + dtContractEnd);

			$http.get(query).then(function (response) {
				$scope.users = response.data.data.items;

				// Custom post treatment
				if ($scope.useCustomFilter) {
					// Get new set of users
					$scope.users = $scope.customFilter({ users: $scope.users });
				}
				maxUsers = $scope.users.length;

				if (maxUsers > MAX_COUNT) {
					$scope.users = _.first(response.data.data.items, MAX_COUNT);
					$scope.users.push({ overflow: MAX_COUNT + "/" + maxUsers });
				}

				if ($scope.showFormerEmployees) {
					checkFormerEmployees();
				}
				checkHomonyms();
			});
		};

		var checkFormerEmployees = function () {
			_.each($scope.users, function (user) {
				if (moment(user.dtContractEnd).isBefore(moment())) {
					user.isFormerEmployee = true;
				}
			});
		};

		var checkHomonyms = function () {
			_.each($scope.users, function (user) {
				// Search homonyms in set of results
				_.each($scope.users, function (otherUser) {
					if ((user.firstName === otherUser.firstName) && (user.lastName === otherUser.lastName) && (user.id !== otherUser.id)) {
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

			getHomonymsProperties();
		};

		var getHomonymsProperties = function () {
			var homonyms = _.where($scope.users, { hasHomonyms: true });
			var homonymsArray = [];

			loadPropertiesFromUrls(homonyms).then(function (response) {
				// Add homonyms properties for each user
				_.each(homonyms, function (user, item) {
					// Get the returned user
					var userWithProps = response[item].data.data.items[0];

					// Add each property to the user
					_.each($scope.properties, function (prop) {
						var newProp = prop.split('.')[0];
						user[newProp] = userWithProps[newProp];
					});
				});
			});
		};

		var loadPropertiesFromUrls = function (homonyms) {
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

			$q.all(urlCalls)
				.then(
				function (response) {
					deferred.resolve(response);
				},
				function (error) {
					deferred.reject(error);
				}
				);
			return deferred.promise;
		};

		var countTimeout = function (input, delay) {
			delay = delay || 5000; // default delay value 1s

			// cancel previous timeout
			if (timeout.count) {
				console.log("-- cancel previous timeout");
				$timeout.cancel(timeout.count);
			}

			// launch new timeout to save in _delay_ 
			timeout.count = $timeout(function () {
				doCount(input);
			}, delay);
		};

		var doCount = function (input) {
			var query = "/api/v3/users?name=like," + input + "&fields=collection.count"; // query for count

			delete timeout.count;

			$http.get(query)
			.then(function (response) {
					$scope.count = response.data.data.count; // To update with right query
					_.last($scope.users).overflow = MAX_COUNT + "/" + $scope.count;
				});
		};

		$scope.getProperty = function (user, prop) {
			var propList = prop.split('.');
			var value = user[_.first(propList)];

			_.each(propList, function (item) {
				if (value && (item !== _.first(propList))) {
					value = value[item];
				}
			});

			return value;
		};

		// Used by UserPickerMultiple
		// Function executed when onSelect is fired
		$scope.addSelectedUser = function () {
			$scope.onSelect();
			selectedUsersCount++;
			// Update overflow message
			if ($scope.count > MAX_COUNT) {
				_.last($scope.users).overflow = (MAX_COUNT - selectedUsersCount) + "/" + $scope.count;
			}
		};

		$scope.find = function (input) {
			var formerEmployees = "&formerEmployees=";
			var limit = "&limit=";
			var query = "/api/v3/users/find?clue=" + input + ($scope.showFormerEmployees ? formerEmployees + "true" : formerEmployees + "false");

			if (input) {
				if (promise) {
					console.log("promise already exists");
					promise.then(function (response) {
						console.log("-- doing nothing");
					});
				}

				// Cancel previous timeout
				if (timeout.count) {
					console.log("-- cancel previous timeout");
					$timeout.cancel(timeout.count);
				}

				// If pagination is enabled, only ask for the MAX_COUNT first matching elements
				if (!$scope.useCustomFilter) {
					if (selectedUsersCount === 0) {
						limit += (MAX_COUNT + 1);
					}
					else {
						limit += maxUsers;
					}
				}
				else {
					limit += maxUsers;
				}
				query += limit;

				promise = $http.get(query);
				promise.then(function (response) {
					$scope.users = response.data.data.items;

					if (!$scope.useCustomFilter && (selectedUsersCount === 0)) {
						// If there are more results than MAX_COUNT, launch a timer to get the number of results
						if ($scope.users.length > MAX_COUNT) {
							console.log("-- call to count timeout");
							countTimeout(input);
							$scope.users = _.first($scope.users, MAX_COUNT);
							$scope.users.push({ overflow: MAX_COUNT + "/..." });
						}
					}
					else {
						// Used for UserPickerMultiple only
						if (selectedUsersCount > 0) {
							// Remove duplicates between results and selected users
							_.each($scope.selected.users, function (selectedUser) {
								$scope.users = _.reject($scope.users, function (user) {
									return (user.id === selectedUser.id);
								});
							});
							// Number of results matching the query
							$scope.count = $scope.users.length;
						}

						// Used when a custom filtering function is given
						if ($scope.useCustomFilter) {
							// Get new set of users
							$scope.users = $scope.customFilter({ users: $scope.users });
							$scope.count = $scope.users.length;
						}

						if ($scope.users.length > MAX_COUNT) {
							$scope.users = _.first($scope.users, MAX_COUNT);
							$scope.users.push({ overflow: MAX_COUNT + "/" + $scope.count });
						}
					}

					if ($scope.showFormerEmployees) {
						checkFormerEmployees();
					}

					checkHomonyms();
				});
			}
		};

		init();
	}]);
})();