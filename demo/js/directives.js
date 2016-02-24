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
		.controller('tableGridCtrl', ['$scope', function ($scope) {
			$scope.people = [
				{
					id: 0,
					name: "john cena",
					adress: "1234 avenue john cena",
					phone: "0123456789",
					mail: "john.cena@john.cena.com"
				},
				{
					id: 1,
					name: "hubert robert",
					adress: "14 rue du gouffre",
					phone: "0607080910",
					mail: "hrobert@yahoo.fr"
				},
				{
					id: 2,
					name: "George Monck",
					adress: "10 downing street",
					phone: "0123456789",
					mail: "g.monck@britishgovernment.co.uk"
				},
				{
					id: 3,
					name: "Marie Pogz",
					adress: "4 place pigalle",
					phone: "0607080910",
					mail: "m.pogz@yopmail.com"
				},
				{
					id: 4,
					name: "Obi Wan Kenobi",
					adress: "Jedi Temple, Coruscant",
					phone: "0123456789",
					mail: "owkenobi@theforce.com"
				},
			];

			$scope.headerTree = {
				node: null,
				children: [
					{
						node: {
							filterable: true,
							fixed: true,
							label: "id",
							width: 20,
							getValue: function (someone) { return someone.id; },
							getOrderByValue: function (someone) { return someone.id; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "right",
						},
						children: [],
					},
					{
						node: {
							filterable: true,
							fixed: false,
							label: "name",
							width: 20,
							getValue: function (someone) { return someone.name; },
							getOrderByValue: function (someone) { return someone.name; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "left",
						},
						children: [],
					},
					{
						node: {
							filterable: true,
							fixed: false,
							label: "adress",
							width: 20,
							getValue: function (someone) { return someone.adress; },
							getOrderByValue: function (someone) { return someone.adress; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "left",
						},
						children: [],
					},
					{
						node: {
							filterable: true,
							fixed: false,
							label: "contacts",
							width: 20,
							getValue: function (someone) { return; },
							getOrderByValue: function (someone) { return; },
							colspan: null,
							hidden: false,
							rowspan: null,
							textAlign: "right",
						},
						children: [
							{
								node: {
									filterable: true,
									fixed: false,
									label: "phone",
									width: 20,
									getValue: function (someone) { return someone.phone; },
									getOrderByValue: function (someone) { return someone.phone; },
									colspan: null,
									hidden: false,
									rowspan: null,
									textAlign: "right",
								},
								children: [],
							},
							{
								node: {
									filterable: true,
									fixed: false,
									label: "mail",
									width: 20,
									getValue: function (someone) { return someone.mail; },
									getOrderByValue: function (someone) { return someone.mail; },
									colspan: null,
									hidden: false,
									rowspan: null,
									textAlign: "center",
								},
								children: [],
							},
						],
					},
				]
			};
		}]);

})();