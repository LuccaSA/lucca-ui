(function(){
	'use strict';
	angular.module('demoApp')
	.controller('modalCtrl', function ($scope, $uibModal) {
		$scope.size = "desktop";
		$scope.open = function () {
			var modalInstance = $uibModal.open({
				size: $scope.size,
				backdropClass: 'lui',
				windowClass: 'lui',
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				appendTo: angular.element(document.getElementById("demo")),
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
