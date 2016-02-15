
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
	.controller('paginationCtrl', ['$scope', function($scope){
		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function (pageNo) {
		  $scope.currentPage = pageNo;
		};

		$scope.pageChanged = function() {
		  $log.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize = 5;
		$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;
	}]);

	angular.module('demoApp')
	.controller('datepickerCtrl', ['$scope', function($scope){
	}]);

	angular.module('demoApp')
	.controller('modalCtrl', function ($scope, $uibModal) {

		$scope.open = function () {
			var modalInstance = $uibModal.open({
				backdropClass: 'lui',
				windowClass: 'lui',
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				appendTo: angular.element(document.getElementById("demo")),
				size: 'lg'
			});
		};
		$scope.openWithoutNamespace = function () {
			var modalInstance = $uibModal.open({
				backdropClass: 'lui',
				windowClass: 'lui',
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
			});
		};
		$scope.openWithoutPrefix = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				appendTo: angular.element(document.getElementById("demo")),
			});
		};
	});
	angular.module('demoApp')
	.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
		$scope.ok = function () {
			$uibModalInstance.close();
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})();
