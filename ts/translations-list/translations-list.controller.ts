module lui.translate {
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
			$timeout: ng.ITimeoutService
		) {
			this.$scope = $scope;
			$scope.currentCulture = $translate.preferredLanguage();
			if (!$scope.currentCulture) { $scope.currentCulture = "en"; }

			$scope.cultures = AVAILABLE_LANGUAGES;
			const currentCultureIndex = _.indexOf($scope.cultures, $scope.currentCulture);
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
				$scope.onInputValueChanged();
			};

			$scope.isAddValueDisabled = (): boolean => {
				return !_.some(AVAILABLE_LANGUAGES, (culture: string) => {
					const current = this.$scope.values[culture].values;
					return current[current.length - 1].value !== "";
				});
			};

			$scope.onPaste = (event: ClipboardEvent | JQueryEventObject, index: number): void => {
				// Don't do anything if the directive is disabled
				if ($scope.isDisabled) { return; }

				const originalEvent: ClipboardEvent = event instanceof ClipboardEvent ? <ClipboardEvent>event : (<ClipboardEvent>(<JQueryEventObject>event).originalEvent);
				const values = _.reject(originalEvent.clipboardData.getData("text/plain").split("\r\n"), (value: string) => value === "");

				if (values.length === 1) { return; }

				for (let i = 0; i < values.length; ++i, ++index) {
					$scope.values[$scope.selectedCulture].values[index] = <ICulturedValue>{ value: values[i] };
				}
				const currentLength = $scope.values[$scope.selectedCulture].values.length;
				_.chain(AVAILABLE_LANGUAGES)
					.reject(lang => lang === $scope.selectedCulture)
					.filter(lang => $scope.values[lang].values.length < currentLength)
					.each(lang => {
						for (let i = $scope.values[lang].values.length; i < currentLength; ++i) {
							$scope.values[lang].values.push(<ICulturedValue>{ value: "" });
						}
					});

				$scope.onInputValueChanged();
				event.preventDefault();
				(<HTMLInputElement>originalEvent.target).blur();
			};

			$scope.addValueAndFocus = (): void => {
				const maxIndex = $scope.values[$scope.selectedCulture].values.length - 1;
				$scope.addValue();
				$timeout(() => document.getElementById($scope.getUniqueId($scope.selectedCulture, maxIndex + 1)).focus());
			};

			$scope.addValueOnEnter = {
				"13": ($event: JQueryEventObject): void => {
					// The index is stored in the target's id (not very pretty ikr)
					let index = Number($event.target.id.split("_")[2]);
					if (index === $scope.values[$scope.selectedCulture].values.length - 1) {
						if (!$scope.isAddValueDisabled()) {
							// Add a value
							index++;
							$scope.addValue();
							$scope.$apply();
							$timeout(() => document.getElementById($scope.getUniqueId($scope.selectedCulture, index)).focus());
						}
					} else {
						index++;
						document.getElementById($scope.getUniqueId($scope.selectedCulture, index)).focus();
						$scope.$apply();
					}

					$event.preventDefault();
				}
			};

			$scope.getPlaceholder = (culture: string, index: number): string => {
				const selectedCultureValue = $scope.values[$scope.selectedCulture].values[index].value;
				if (!!selectedCultureValue) {
					return selectedCultureValue;
				}

				const currentCultureValue = $scope.values[$scope.currentCulture].values[index].value;
				if (!!currentCultureValue) {
					return $scope.isDisabled ? "" : currentCultureValue;
				}

				for (let i = 0; i < $scope.cultures.length; i++) {
					const currentLanguage = $scope.cultures[i];
					const cultureValue = $scope.values[currentLanguage].values[index].value;
					if (!!cultureValue) {
						return $scope.isDisabled ? "" : cultureValue;
					}
				}

				return $scope.isDisabled ? "" : $translate.instant("LUID_TRANSLATIONSLIST_INPUT_VALUE");
			};

			$scope.getUniqueId = (culture: string, index: number): string => {
				return `${culture}_${$scope.uniqueId}_${index}`;
			};
		}
	}
	angular.module("lui.translate").controller(LuidTranslationsListController.IID, LuidTranslationsListController);

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
