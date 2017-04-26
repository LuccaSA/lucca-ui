module lui.translationslist {
	"use strict";

	export class LuidTranslationsListController {
		public static IID: string = "luidTranslationsList";

		public static $inject: string[] = [
			"$scope",
			"$translate",
			"$timeout"
		];

		private $scope: ILuidTranslationsListScope;

		constructor(
			$scope: ILuidTranslationsListScope,
			$translate: ng.translate.ITranslateService,
			$timeout: ng.ITimeoutService) {

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

			$scope.isAddValueDisabled = (): boolean => {
				return !_.some(AVAILABLE_LANGUAGES, (culture: string) => {
					let current = this.$scope.values[culture].values;
					return current[current.length - 1].value !== "";
				});
			};

			$scope.onPaste = (event: ClipboardEvent, index: number): void => {
				// Don't do anything if the directive is disabled
				if ($scope.disabled) { return; }

				let values = _.reject(event.clipboardData.getData("text/plain").split("\r\n"), (value: string) => value === "");
				if (values.length <= 1) { return; }

				// If the first item in the selectedCulture isn't empty, simply paste the first value inside it
				if ($scope.values[$scope.selectedCulture].values[index] !== undefined) {
					$scope.values[$scope.selectedCulture].values[index].value += values[0];
					values.splice(0, 1);
					++index;
				}

				_.each(AVAILABLE_LANGUAGES, (culture: string) => {
					for (let i = 0; i < values.length; ++i) {
						if ($scope.values[culture].values[i + index] !== undefined) {
							$scope.values[culture].values[i + index].value = culture === $scope.selectedCulture ? values[i] : "";
						} else {
							$scope.values[culture].values.splice(i + index, 0, <ICulturedValue>{ value: culture === $scope.selectedCulture ? values[i] : "" });
						}
					}
				});

				(<HTMLInputElement>event.target).blur();
			};
			$scope.addValueOnEnter = {
				"13": ($event: any): void => {
					// The index is stored in the target's id (not very pretty ikr)
					let index = Number($event.target.id.split("_")[1]);
					if (index === $scope.values[$scope.selectedCulture].values.length - 1) {
						if (!$scope.isAddValueDisabled()) {
							// Add a value
							index++;
							$scope.addValue();
							$scope.$apply();
							$timeout(() => {
								document.getElementById($scope.selectedCulture + "_" + index).focus();
							});
						}
					} else {
						index++;
						document.getElementById($scope.selectedCulture + "_" + index).focus();
						$scope.$apply();
					}
				}
			};
		}
	}
	angular.module("lui").controller(LuidTranslationsListController.IID, LuidTranslationsListController);

	angular.module("lui.translate").config(["$translateProvider", function ($translateProvider: ng.translate.ITranslateProvider): void {
		$translateProvider.translations("en", {
			"LUID_TRANSLATIONSLIST_ADD_VALUE": "Add new value",
			"LUID_TRANSLATIONSLIST_INPUT_VALUE": "Input a value"
		});
		$translateProvider.translations("fr", {
			"LUID_TRANSLATIONSLIST_ADD_VALUE": "Ajouter une nouvelle valeur",
			"LUID_TRANSLATIONSLIST_INPUT_VALUE": "Saisir une valeur"
		});
	}]);
}
