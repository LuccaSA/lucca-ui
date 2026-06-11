module lui.tablegrid {
	"use strict";
	angular.module("lui.tablegrid").config(["$translateProvider", function ($translateProvider: angular.translate.ITranslateProvider): void {
		$translateProvider.translations("en", {
			"SELECT_ITEM": "Select an item",
			"SELECT_ITEMS": "Select items",
		});
		$translateProvider.translations("de", {
			"SELECT_ITEM": "Element auswählen",
			"SELECT_ITEMS": "Elemente auswählen",
		});
		$translateProvider.translations("es", {
			"SELECT_ITEM": "Seleccione un elemento",
			"SELECT_ITEMS": "Seleccione elementos",
		});
		$translateProvider.translations("fr", {
			"SELECT_ITEM": "Sélectionnez un élément",
			"SELECT_ITEMS": "Sélectionnez des éléments",
		});
		$translateProvider.translations("it", {
			"SELECT_ITEM": "Seleziona un elemento",
			"SELECT_ITEMS": "Seleziona elementi",
		});
		$translateProvider.translations("nl", {
			"SELECT_ITEM": "Selecteer een item",
			"SELECT_ITEMS": "Selecteer items",
		});
		$translateProvider.translations("pt", {
			"SELECT_ITEM": "Selecione um item",
			"SELECT_ITEMS": "Selecione itens",
		});
		$translateProvider.translations("pl", {
			"SELECT_ITEM": "Wybierz element",
			"SELECT_ITEMS": "Wybierz elementy",
		});
	}]);
}
