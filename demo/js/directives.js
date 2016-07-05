(function(){
	'use strict';

	angular.module('demoApp')
	.controller('timespanCtrl', ['$scope', function($scope){
		$scope.myTimespan = "1.11:00:00";
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
		$scope.myDuration = moment.duration(2, 'hours');
		$scope.myTimespan2 = "02:05:00";
		$scope.min = '0:10';
		$scope.max = '11:00';
	}]);

	angular.module('demoApp')
	.controller('percentageCtrl', ['$scope', function($scope){
		$scope.myValue = 0.1;
		$scope.myCoeff = 1.1;
		$scope.myPrice = 150;
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
	}]);

	angular.module('demoApp')
	.controller('momentCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment();
		$scope.myStr = "14:00:00";
		$scope.myValue2 = moment().startOf('day').add(14, 'hours');
		$scope.myValue3 = moment().startOf('day').add(14, 'hours');
		$scope.min = moment().startOf('day').add(8, 'hours');
		$scope.max = moment().startOf('day').add(26, 'hours');
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
	}]);

	angular.module('demoApp')
	.controller('daterangeCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
		$scope.myPeriod = {
			startsOn: moment().startOf('day'),
			endsOn: moment().startOf('day').add(3, 'd'),

			dateStart: moment().startOf('month').toDate(),
			dateEnd: moment().startOf('d').toDate(),

			stringStart: "2015/01/01",
			stringEnd: "2015/03/05",
		};
		$scope.myPeriods = [
			{label:"This month", startsOn:moment().startOf('month'), endsOn:moment().endOf('month').startOf('day')},
			{label:"Battle of Marignan", startsOn:moment("1515-09-13"), endsOn:moment("1515-09-14")},
			{label:"World cup 2014", startsOn:moment("2014-06-12"), endsOn:moment("2014-07-13")},
			{label:"TI5 main event", startsOn:moment("2015-08-03"), endsOn:moment("2015-08-08")},
			];
			$scope.doAlert = function(){
				alert($scope.myPeriod.stringStart);
			}
		}]);

	angular.module('demoApp')
	.controller('keydownCtrl', ['$scope', function($scope){
		$scope.enterCnt = 0;
		$scope.escCnt = 0;
		$scope.zCnt = 0;
		$scope.arrows = [];

		var enterPressed = function(){
			$scope.enterCnt++;
			$scope.$apply();
		};
		var escPressed = function(){
			$scope.escCnt++;
			$scope.$apply();
		};
		var zPressed = function(){
			$scope.zCnt++;
			$scope.$apply();
		};

		var leftPressed = function(){ $scope.arrows.push("left"); $scope.$apply(); };
		var upPressed = function(){ $scope.arrows.push("up"); $scope.$apply(); };
		var rightPressed = function(){ $scope.arrows.push("right"); $scope.$apply(); };
		var downPressed = function(){ $scope.arrows.push("down"); $scope.$apply(); };

		$scope.myMappings = { 13: enterPressed, 27: escPressed, 90: zPressed, 37: leftPressed, 38: upPressed, 39: rightPressed, 40: downPressed };
	}]);

	angular.module('demoApp')
	.controller('dayBlockCtrl', ['$scope', function($scope){
		$scope.myDate = new Date();
		$scope.palette = "";
		$scope.sizing = "";
	}]);
	angular.module('demoApp')
	.controller('datepickerCtrl', ['$scope', function($scope){
		$scope.dateMoment = moment().add(22, "days").startOf("day");
		$scope.dateMin = moment().add(-22, "days").startOf("day");
		$scope.dateMax = moment().add(22, "days").startOf("day");
		$scope.disableWeekends = function (date) {
			return (date.isoWeekday() === 7 || date.isoWeekday() === 6) ? "disabled" : "";
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
		$scope.myDaterange = { start: moment().startOf("day"), end: moment().startOf("day").add(3, "days") };
		$scope.myDaterange3 = { foo: "20160525", bar: "20160603" };
		$scope.min = moment().startOf("day");
		$scope.max = moment().startOf("day").add(1, "day");
		$scope.disableWeekends = function (date) {
			return (date.isoWeekday() === 7 || date.isoWeekday() === 6) ? "disabled" : "";
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


})();