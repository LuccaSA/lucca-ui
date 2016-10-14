(function(){
	'use strict';

	angular.module('demoApp')
	.controller('daterangepickerCtrl', ['$scope', function($scope){
		$scope.cnt = 0;
		$scope.hasChanged = function() {
			$scope.cnt++;
		}
		$scope.myDaterange = { start: moment().startOf("day"), end: moment().startOf("day").add(3, "days") };
		$scope.myDaterange3 = { foo: "20160525", bar: "20160603", bogus: "bogus" };
		$scope.min = moment().startOf("day");
		$scope.max = moment().startOf("day").add(1, "day");
		$scope.disableWeekends = function (date, mode) {
			if (mode === 0) {
				return (date.isoWeekday() === 7 || date.isoWeekday() === 6) ? "disabled" : "";
			}
			return "";
		};
		$scope.shortcuts = [
		{ label: "last week", start: moment().add(-1, "week").startOf("week"), end: moment().startOf("week") },
		{ label: "this week", start: moment().startOf("week"), end: moment().add(1, "week").startOf("week") },
		{ label: "next week", start: moment().add(1, "week").startOf("week"), end: moment().add(2, "week").startOf("week") },
		];
		$scope.groupedShortcuts = [
		[{ label: "last week", start: moment().add(-1, "week").startOf("week"), end: moment().startOf("week").add(-1, "day") },
		{ label: "this week", start: moment().startOf("week"), end: moment().add(1, "week").startOf("week").add(-1, "day") },
		{ label: "next week", start: moment().add(1, "week").startOf("week"), end: moment().add(2, "week").startOf("week").add(-1, "day") },],
		[{ label: "last month", start: moment().add(-1, "month").startOf("month"), end: moment().startOf("month").add(-1, "day") },
		{ label: "this month", start: moment().startOf("month"), end: moment().add(1, "month").startOf("month").add(-1, "day") },
		{ label: "next month", start: moment().add(1, "month").startOf("month"), end: moment().add(2, "month").startOf("month").add(-1, "day") },],
		];
	}]);
})();
