
(function(){
	'use strict';

	angular.module('demoApp')
	.controller('uiselectCtrl', ['$scope', function($scope){
		$scope.person = {};
		$scope.people = [
			{ name: 'Adam',      email: 'adam@email.com',      age: 10 },
			{ name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
			{ name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
			{ name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
			{ name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
			{ name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
			{ name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
			{ name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
		];

		$scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
		$scope.colors = ['Blue','Red'];
	}]);

	angular.module('demoApp')
	.controller('dropdownCtrl', ['$scope', function($scope){
	}]);

	angular.module('demoApp')
	.controller('tooltipCtrl', ['$scope', function($scope){
	}]);

	angular.module('demoApp')
	.controller('popoverCtrl', ['$scope', function($scope){
		$scope.popoverHtml="<b>Bold stuff</b> and a <span class='lui label'>lui label</span>";
	}]);

	angular.module('demoApp')
	.controller('datepickerCtrl', ['$scope', function($scope){
	}]);
})();