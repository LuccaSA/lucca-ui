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
	};
}