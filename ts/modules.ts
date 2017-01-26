module lui {
	"use strict";

	angular.module("moment", []).factory("moment", () => moment );
	angular.module("underscore", []).factory("_", () => _ );
	angular.module("iban", []).factory("iban", () => IBAN );

	angular.module("lui", ["ngSanitize", "ui.bootstrap", "ui.select", "moment", "underscore"]);

	angular.module("lui.translate", ["lui", "pascalprecht.translate"]);
	angular.module("lui.notify", ["lui", "cgNotify"]);
	angular.module("lui.formly", ["lui", "formly"]);
	angular.module("lui.crop", ["lui", "lui.translate", "ngImgCrop"]);
	angular.module("lui.iban", ["lui", "iban"]);
	angular.module("lui.tablegrid", ["lui", "lui.translate"]);

}
