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
		$scope.values = ["zero","one","two","three"];
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


})();