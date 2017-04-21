module lui.translationslist {
	"use strict";

	export class LuidTranslationsListController {
		public static IID: string = "luidTranslationsList";

		public static $inject: string[] = [
			"$scope",
			"$translate"
		];

		private $scope: ILuidTranslationsListScope;

		constructor(
			$scope: ILuidTranslationsListScope,
			$translate: ng.translate.ITranslateService) {

			this.$scope = $scope;
			$scope.currentCulture = $translate.preferredLanguage();
			if (!$scope.currentCulture) { $scope.currentCulture = "en"; }

			$scope.cultures = AVAILABLE_LANGUAGES;
			let currentCultureIndex = _.indexOf($scope.cultures, $scope.currentCulture);
			if (currentCultureIndex !== -1) {
				$scope.cultures.splice(currentCultureIndex, 1);
				$scope.cultures.unshift($scope.currentCulture);
			}
			$scope.selectedCulture = $scope.currentCulture;

			$scope.values = {};

			$scope.selectCulture = (culture: string): void => { $scope.selectedCulture = culture; };

			$scope.addValue = (): void => {
				_.each(AVAILABLE_LANGUAGES, (culture: string) => {
					$scope.values[culture].values.push(<ICulturedValue>{ value: "" });
				});
			};

			$scope.deleteValue = (index: number): void => {
				_.each(AVAILABLE_LANGUAGES, (culture: string) => {
					$scope.values[culture].values.splice(index, 1);
				});
				if ($scope.values[AVAILABLE_LANGUAGES[0]].values.length === 0) {
					_.each(AVAILABLE_LANGUAGES, (culture: string) => {
						$scope.values[culture].values.push(<ICulturedValue>{ value: "" });
					});
				}
			};

			$scope.canAddValue = (): boolean => {
				return !_.some(AVAILABLE_LANGUAGES, (culture: string) => {
					let current = this.$scope.values[culture].values;
					return current[current.length - 1].value !== "";
				});
			};
		}
	}
	angular.module("lui").controller(LuidTranslationsListController.IID, LuidTranslationsListController);

	angular.module("lui.translate").config(["$translateProvider", function ($translateProvider: ng.translate.ITranslateProvider): void {
		$translateProvider.translations("en", {
			"LUID_TRANSLATIONSLIST_ADD_VALUE": "New value",
			"LUID_TRANSLATIONSLIST_INPUT_VALUE": "Input a value"
		});
		$translateProvider.translations("fr", {
			"LUID_TRANSLATIONSLIST_ADD_VALUE": "Nouvelle valeur",
			"LUID_TRANSLATIONSLIST_INPUT_VALUE": "Saisir une valeur"
		});
	}]);
}
