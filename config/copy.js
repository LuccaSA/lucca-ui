"use strict";
module.exports = function(grunt, options){
	return {
		tsdefinitions: {
			src: ".temp/lucca-ui-ts.d.ts",
			dest: "dist/lucca-ui.d.ts",
		},
		demolibs: {
			expand: true,
			flatten: true,
			src: [
				"dist/lucca-ui.js",
				"node_modules/iban/iban.js", 
				"node_modules/@cgross/angular-notify/dist/angular-notify.min.js", 
				"node_modules/ng-img-crop-full-extended/compile/minified/ng-img-crop.js"
			],
			dest: "demo/libs/",
		},
	};
}