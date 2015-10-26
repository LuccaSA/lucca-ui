(function(){
	'use strict';

	angular.module('demoApp')
	.controller('placeholderCtrl', ['$scope', function($scope){
		$scope.myValue = "not empty";
		$scope.myPlaceholder = "dynamic placeholder";
	}]);

	angular.module('demoApp')
	.controller('defaultcodeCtrl', ['$scope', function($scope){
		$scope.myValue = "With spaces and numb3rs";
	}]);

	angular.module('demoApp')
	.controller('numberCtrl', ['$scope', function($scope){
		$scope.myValue = 12.5;
	}]);

	angular.module('demoApp')
	.controller('startfromCtrl', ['$scope', function($scope){
		$scope.values = ["zero","one","two","three", "four", "five", "six", "seven","eight", "nine"];
		$scope.myIndex = 2;
	}]);

	angular.module('demoApp')
	.controller('momentCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = "2015-10-01";
		$scope.myFormat = "MMMM Do";
		$scope.setToDate = function(){
			$scope.myValue = new Date();
		};
		$scope.setToMoment = function(){
			$scope.myValue = moment().startOf('week');
		}
	}]);
	angular.module('demoApp')
	.controller('calendarCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment().add(-1,'days');
		$scope.myRefDate = moment().add(-2,'days');
		$scope.setToThisWeek = function(){
			$scope.myValue = moment().startOf('week');
		};
		$scope.setToLastWeek = function(){
			$scope.myValue = moment().add(-1,'week');
		};
	}]);

	angular.module('demoApp')
	.controller('friendlyrangeCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myBlock = { start: moment().startOf('month'), end: moment().add(1,'month').startOf('month') };
	}]);

	angular.module('demoApp')
	.controller('durationCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment.duration("10:00:00");
	}]);

	angular.module('demoApp')
	.controller('humanizeCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment.duration("10:00:00");
	}]);


})();