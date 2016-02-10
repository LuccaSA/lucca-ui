'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			// define a string to put between each file in the concatenated output
			separator: ';'
		},
		standard: {
			src: [
				'js/lui-light.js',
				'js/directives/*.js',
				'js/filters/*.js',
			],
			// the location of the resulting JS file
			dest: 'dist/lucca-ui.js'
		},
		spe: {
			src: [
				'js/lui.js',
				'js/directives/*.js',
				'js/directives/lucca/*.js',
				'js/filters/*.js',
			],
			// the location of the resulting JS file
			dest: 'dist/custom/lucca-ui-spe.js'
		},
	};
}