(function () {
	'use strict';
	angular.module("demoApp")
		.controller("translationsListCtrl", ["$scope", function ($scope) {
			$scope.translationsListChangedCount = 0;
			$scope.listDisabled = false;
			$scope.translationsListChanged = function () {
				$scope.translationsListChangedCount++;
			}
			$scope.luccaTranslations = [
				{
					id: 1,
					culturedLabels: [
						{ id: 1, cultureCode: 1033, value: "Hello", translationId: 1 },
						{ id: 2, cultureCode: 1036, value: "Bonjour", translationId: 1 },
						{ id: 3, cultureCode: 1034, value: "Hola", translationId: 1 },
					]
				},
				{
					id: 2,
					culturedLabels: [
						{ id: 4, cultureCode: 1033, value: "Thanks", translationId: 2 },
						{ id: 5, cultureCode: 1036, value: "Merci", translationId: 2 },
						{ id: 6, cultureCode: 1034, value: "Gracias", translationId: 2 }
					]
				},
				{
					id: 3,
					culturedLabels: [
						{ id: 7, cultureCode: 1033, value: "Goodbye", translationId: 3 },
						{ id: 8, cultureCode: 1036, value: "Au revoir", translationId: 3 },
						{ id: 8, cultureCode: 1034, value: "Adios", translationId: 3 },
					]
				},
			];

			$scope.translationsListChangedCount2 = 0;
			$scope.listDisabled2 = false;
			$scope.translationsListChanged2 = function () { $scope.translationsListChangedCount2++; }
			$scope.luccaTranslations2 = [
				{
					id: 1,
					culturedLabels: [
						{ id: 1, cultureCode: 1033, value: "Hello", translationId: 1 },
						{ id: 2, cultureCode: 1036, value: "Bonjour", translationId: 1 },
						{ id: 3, cultureCode: 1034, value: "Hola", translationId: 1 },
					]
				},
				{
					id: 2,
					culturedLabels: [
						{ id: 4, cultureCode: 1033, value: "Thanks", translationId: 2 },
						{ id: 5, cultureCode: 1036, value: "Merci", translationId: 2 },
						{ id: 6, cultureCode: 1034, value: "Gracias", translationId: 2 }
					]
				},
				{
					id: 3,
					culturedLabels: [
						{ id: 7, cultureCode: 1033, value: "Goodbye", translationId: 3 },
						{ id: 8, cultureCode: 1036, value: "Au revoir", translationId: 3 },
						{ id: 8, cultureCode: 1034, value: "Adios", translationId: 3 },
					]
				},
			];
		}]);
})();
