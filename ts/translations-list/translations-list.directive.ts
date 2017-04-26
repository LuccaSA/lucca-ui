module lui.translationslist {
	"use strict";

	class LuidTranslationsList implements angular.IDirective {
		public static IID: string = "luidTranslationsList";
		public restrict: string = "E";
		public templateUrl: string = "lui/templates/translations-list/translations-list.html";

		public require: string[] = ["ngModel", LuidTranslationsList.IID];
		public scope = {
			mode: "@", // Allowed values: "lucca",
			disabled: "=ngDisabled", // enable editing
		};

		public controller: string = LuidTranslationsListController.IID;

		public static factory(): angular.IDirectiveFactory {
			return () => { return new LuidTranslationsList(); };
		}

		private static toModel(viewModel: _.Dictionary<CulturedList>, mode: string): any {
			let result: any;
			switch (mode) {
				case "lucca": result = LuidTranslationsList.toLuccaModel(viewModel); break;
				default: result = undefined; break;
			}
			return result;
		}

		/** Converts a dictionary of cultured list into an array of ILuccaTranslation objects */
		private static toLuccaModel(viewModel: _.Dictionary<CulturedList>): ILuccaTranslation[] {
			let result = new Array<ILuccaTranslation>();
			let numberOfTranslations = -1;
			let filledLanguages = _.filter(AVAILABLE_LANGUAGES, (language: string) => {
				if (viewModel[language].values.length > numberOfTranslations) {
					numberOfTranslations = viewModel[language].values.length;
				}
				// Only parse the languages which contain non empty values
				return _.some(viewModel[language].values, (label: ICulturedValue) => { return label.value !== ""; });
			});

			// If everything is empty return undefined instead (usefull to support ng-required)
			if (filledLanguages.length === 0) { return undefined; }

			for (let i = 0; i < numberOfTranslations; ++i) {
				result.push(<ILuccaTranslation>{ id: undefined, culturedLabels: new Array<ILuccaCulturedLabel>() });
			}
			let currentIndex = 0;
			_.each(result, (translation: ILuccaTranslation) => {
				_.each(filledLanguages, (language: string) => {
					if (viewModel[language].values[currentIndex].value !== "") {
						let vmLabel = viewModel[language].values[currentIndex];
						translation.culturedLabels.push(<ILuccaCulturedLabel>{
							id: vmLabel.originalLuccaCulturedLabelId, translationId: vmLabel.originalLuccaTranslationId,
							cultureCode: LANGUAGES_TO_CODE[language],
							value: vmLabel.value
						});
						if (!translation.id && !!vmLabel.originalLuccaTranslationId) {
							translation.id = vmLabel.originalLuccaTranslationId;
						}
					}
				});
				++currentIndex;
			});

			result = _.reject(result, (translation: ILuccaTranslation) => { return translation.culturedLabels.length === 0; });

			return result;
		}

		/** Parses the value given to the directive via ng-model and convert it into an object comprehensible by the controller */
		private static parse(value: any, mode: string): _.Dictionary<CulturedList> {
			let result: _.Dictionary<CulturedList>;
			switch (mode) {
				case "lucca": result = LuidTranslationsList.parseLucca(<ILuccaTranslation[]>value); break;
				default: result = undefined; break;
			}
			return result;
		}

		/** Parses a model which uses the Lucca proprietary format */
		private static parseLucca(value: ILuccaTranslation[]): _.Dictionary<CulturedList> {
			let result: _.Dictionary<CulturedList> = LuidTranslationsList.getEmptyCulturedLists();

			_.each(value, (translation: ILuccaTranslation) => {
				_.each(translation.culturedLabels, (label: ILuccaCulturedLabel) => {
					let language = CODES_TO_LANGUAGES[label.cultureCode];
					result[language].values.push(<ICulturedValue>{
						value: label.value,
						originalLuccaCulturedLabelId: label.id,
						originalLuccaTranslationId: label.translationId
					});
				});
				// blanks ?
				if (translation.culturedLabels.length > 0) {
					let count = result[CODES_TO_LANGUAGES[translation.culturedLabels[0].cultureCode]].values.length;
					_.each(AVAILABLE_LANGUAGES, (language: string) => {
						if (result[language].values.length !== count) {
							result[language].values.push(<ICulturedValue>{ value: "" });
						}
					});
				}
			});

			return result;
		}

		/** Creates a new empty dictionary of CulturedList objects */
		private static getEmptyCulturedLists(): _.Dictionary<CulturedList> {
			let result: _.Dictionary<CulturedList> = {};
			_.each(AVAILABLE_LANGUAGES, (culture: string) => { result[culture] = new CulturedList(culture); });
			return result;
		}

		public link(
			scope: ILuidTranslationsListScope,
			element: angular.IAugmentedJQuery,
			attrs: angular.IAttributes & { mode: string, ngDisabled: boolean },
			ctrls: [ng.INgModelController, LuidTranslationsListController]): void {

			let ngModelCtrl = ctrls[0];

			let mode = attrs.mode;
			if (!mode) { mode = "lucca"; }

			ngModelCtrl.$render = (): void => {
				let viewModel = LuidTranslationsList.parse(ngModelCtrl.$viewValue, mode);
				if (!!viewModel) {
					scope.values = viewModel;
				}
			};

			scope.$watch("values", (): void => {
				ngModelCtrl.$setViewValue(LuidTranslationsList.toModel(scope.values, mode));
			}, true);
		}
	}
	angular.module("lui.translationslist").directive(LuidTranslationsList.IID, LuidTranslationsList.factory());
}
