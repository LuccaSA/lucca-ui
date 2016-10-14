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
	}]);
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
	angular.module('demoApp')
	.controller('progressCtrl', ['$scope', '$http', 'luisProgressBar', function($scope, $http, luisProgressBar){
		$scope.palettes = ["primary", "secondary", "grey", "light", "red", "orange", "yellow", "green"];
		$scope.currentPalette = "light";
		$scope.changeColor = function(palette) {
			$scope.currentPalette = palette;
			luisProgressBar.addProgressBar(palette);
		};
		$scope.fastListen = function(){
			luisProgressBar.startListening();
			$http.get("/bogus-progress");
		};
		$scope.slowListen = function(){
			luisProgressBar.startListening();
			$http.get("http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=l");
		};
	}]);
	angular.module('demoApp')
	.controller('ibanCtrl', ['$scope', function($scope){
		$scope.iban = "FR7630004000031234567890143";
	}]);

})();