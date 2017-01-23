'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			// define a string to put between each file in the concatenated output
			separator: ';'
		},
		standard: {
			src: [
				".temp/lucca-ui-ts.js",
				".temp/templates.js",
				"js/**/*.js",
			],
			// the location of the resulting JS file
			dest: "dist/lucca-ui.js"
		},
		// spe: {
		// 	src: [
		// 		'js/lui.js',
		// 		'js/directives/*.js',
		// 		'js/directives/lucca/*.js',
		// 		'js/filters/*.js',
		// 		'.temp/lucca-ui-spe-ts.js',
		// 		'.temp/templates.js',
		// 	],
		// 	// the location of the resulting JS file
		// 	dest: 'dist/custom/lucca-ui-spe.js'
		// },
	};
}