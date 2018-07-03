module lui.imagepicker {
	"use strict";
	/* tslint:disable */
	angular.module("lui.crop").config(["$translateProvider", function ($translateProvider) {
		$translateProvider.translations("en", {
			"LUIIMGPICKER_UPLOAD_IMAGE": "Change image",
			"LUIIMGPICKER_MODIFY_IMAGE": "Upload an image",
			"LUIIMGPICKER_DELETE_IMAGE": "Remove image",
			"LUIIMGCROPPER_CROP": "Crop",
			"LUIIMGCROPPER_DO_NOT_CROP": "Do not crop",
		});
		$translateProvider.translations("de", {

		});
		$translateProvider.translations("es", {

		});
		$translateProvider.translations("fr", {
			"LUIIMGPICKER_UPLOAD_IMAGE": "Changer l'image",
			"LUIIMGPICKER_MODIFY_IMAGE": "Télécharger une nouvelle image",
			"LUIIMGPICKER_DELETE_IMAGE": "Supprimer l'image",
			"LUIIMGCROPPER_CROP": "Recadrer",
			"LUIIMGCROPPER_DO_NOT_CROP": "Ne pas recadrer",
		});
		$translateProvider.translations("it", {

		});
		$translateProvider.translations("nl", {

		});
	}]);
	/* tslint:enable */
}
