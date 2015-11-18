(function(){
	'use strict';

	angular.module('demoApp')
	.controller('timespanCtrl', ['$scope', function($scope){
		$scope.myValue = "1.11:00:00";
		$scope.updateCnt = 0;
		$scope.hasChanged = function(){
			$scope.updateCnt++;
		};
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
		]
	}]);

})();