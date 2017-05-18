(function(){
	'use strict';

	angular.module('demoApp')
	.controller('datepickerCtrl', ['$scope', function($scope){
		$scope.dateMoment = moment().add(22, "days").startOf("day");
		$scope.dateMin = moment().add(-22, "days").startOf("day");
		$scope.dateMax = moment().add(22, "days").startOf("day");
		$scope.disableWeekends = function (date, mode) {
			if (mode === 0) {
				return (date.isoWeekday() === 7 || date.isoWeekday() === 6) ? "disabled" : "";
			}
			return "";
		};
		$scope.highlightThisWeek = function (date) {
			return date.week() === moment().week() ? "in-between" : "";
		};
		$scope.shortcuts = [
		{ label: "yesterday", date: moment().add(-1, "day").startOf("day") },
		{ label: "today", date: moment().startOf("day") },
		{ label: "tomorrow", date: moment().add(1, "day").startOf("day") },
		{ label: "last monday", date: moment().add(-1, "week").startOf("week") },
		{ label: "this monday", date: moment().startOf("week") },
		{ label: "next monday", date: moment().add(1, "week").startOf("week") },
		];
		$scope.groupedShortcuts = [
		[{ label: "yesterday", date: moment().add(-1, "day").startOf("day") },
		{ label: "today", date: moment().startOf("day") },
		{ label: "tomorrow", date: moment().add(1, "day").startOf("day") },],
		[{ label: "last monday", date: moment().add(-1, "week").startOf("week") },
		{ label: "this monday", date: moment().startOf("week") },
		{ label: "next monday", date: moment().add(1, "week").startOf("week") },],
		];

		$scope.keyboardInputDisabled = false;
		$scope.keyboardDemoMin = moment().add(-20, "year").format("DD/MM/YYYY");
		$scope.keyboardDemoMax = moment().add(20, "year").format("DD/MM/YYYY");
	}]);
})();
