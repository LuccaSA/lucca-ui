(function(){

	angular.module('moment', []).factory('moment', function () { return window.moment; });
	angular.module('filterApp',['lui']);

	angular.module('filterApp')
	.controller('placeholderCtrl', ['$scope', function($scope){
		$scope.myValue = "not empty";
		$scope.myPlaceholder = "dynamic placeholder";
	}]);

	angular.module('filterApp')
	.controller('defaultcodeCtrl', ['$scope', function($scope){
		$scope.myValue = "With spaces and numb3rs";
	}]);

	angular.module('filterApp')
	.controller('startfromCtrl', ['$scope', function($scope){
		$scope.values = ["zero","one","two","three", "four", "five", "six", "seven","eight", "nine"];
		$scope.myIndex = 2;
	}]);

	angular.module('filterApp')
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
	angular.module('filterApp')
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

	angular.module('filterApp')
	.controller('friendlyrangeCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myBlock = { start: moment().startOf('month'), end: moment().add(1,'month').startOf('month') };
	}]);

	angular.module('filterApp')
	.controller('durationCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment.duration("10:00:00");
	}]);

	angular.module('filterApp')
	.controller('humanizeCtrl', ['$scope', 'moment', function($scope, moment){
		$scope.myValue = moment.duration("10:00:00");
	}]);


})();