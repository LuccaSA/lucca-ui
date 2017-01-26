module lui.tablegrid {
	"use strict";
	angular.module("lui.tablegrid").config(["$translateProvider", function ($translateProvider: angular.translate.ITranslateProvider): void {
		$translateProvider.translations("en", {
			"SELECT_ITEM": "Select an item",
			"SELECT_ITEMS": "Select items",
		});
		$translateProvider.translations("de", {

		});
		$translateProvider.translations("es", {

		});
		$translateProvider.translations("fr", {
			"SELECT_ITEM": "Sélectionnez un élément",
			"SELECT_ITEMS": "Sélectionnez des éléments",
		});
		$translateProvider.translations("it", {

		});
		$translateProvider.translations("nl", {

		});
	}]);
}
