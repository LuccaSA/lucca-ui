module lui.imagepicker {
	"use strict";
	/* tslint:disable */
	angular.module("lui.crop").config(["$translateProvider", function ($translateProvider) {
		$translateProvider.translations("en", {
			"LUIIMGPICKER_UPLOAD_IMAGE": "change picture",
			"LUIIMGPICKER_MODIFY_IMAGE": "modify picture",
			"LUIIMGPICKER_DELETE_IMAGE": "delete picture",
			"LUIIMGCROPPER_CROP": "Crop",
			"LUIIMGCROPPER_DO_NOT_CROP": "Do not crop",
		});
		$translateProvider.translations("de", {

		});
		$translateProvider.translations("es", {

		});
		$translateProvider.translations("fr", {
			"LUIIMGPICKER_UPLOAD_IMAGE": "changer l'image",
			"LUIIMGPICKER_MODIFY_IMAGE": "modifier l'image",
			"LUIIMGPICKER_DELETE_IMAGE": "supprimer l'image",
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
