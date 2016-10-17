(function(){
	'use strict';
	angular.module("demoApp")
	.controller("notifyCtrl", ["$scope", "luisNotify", "$q", function($scope, luisNotify, $q){
		$scope.message = "this is a notification";
		$scope.details = "open console with f12 to witness the logging";
		$scope.notifyError = function(message, details) {
			luisNotify.error(message, details);
		};
		$scope.notifyWarning = function(message, details) {
			luisNotify.warning(message, details);
		};
		$scope.notifySuccess = function(message, details) {
			luisNotify.success(message, details);
		};
		$scope.loadingMessage = "doing a long treatment";
		$scope.resolvedMessage = "It worked!";
		$scope.rejectedMessage = "It failed :'(";
		$scope.canceledMessage = "It was taking too long";
		var cancel = function() {
			luisNotify.warning("The user clicked the x before the treatment was done");
			$scope.loading = false;
		}
		var loadingDfd;
		$scope.notifyLoading = function(message) {
			loadingDfd = $q.defer();
			$scope.loading = true;
			luisNotify.loading(loadingDfd.promise, message, cancel);
		};
		$scope.changeLoading = function(message) {
			loadingDfd.notify(message);
		};
		$scope.resolveLoading = function(message) {
			$scope.loading = false;
			loadingDfd.resolve(message);
		};
		$scope.rejectLoading = function(message) {
			$scope.loading = false;
			loadingDfd.reject(message);
		};

		$scope.message2 = "are you really sure?";
		$scope.notifyAlert = function(message) {
			luisNotify.alert(message)
			.then(function (hasConfirmed) {
				if (hasConfirmed) {
					$scope.confirmationMessage = "the user clicked ok";
				} else {
					$scope.confirmationMessage = "the user clicked cancel";
				}
			}, function() {
				$scope.confirmationMessage = "the user clicked outside";
			});
		};
		$scope.notifyConfirm = function(message) {
			luisNotify.confirm(message)
			.then(function (hasConfirmed) {
				if (hasConfirmed) {
					$scope.confirmationMessage = "the user clicked ok";
				} else {
					$scope.confirmationMessage = "the user clicked cancel";
				}
			}, function() {
				$scope.confirmationMessage = "the user clicked outside";
			});
		};
	}]);
})();
