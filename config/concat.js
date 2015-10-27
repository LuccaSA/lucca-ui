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
		light: {
			src: [
				'js/lui-light.js',
				'js/directives/timespan-picker.js',
				'js/directives/percentage-picker.js',
				'js/directives/moment-picker.js',
				'js/filters/genericFilters.js',
				'js/filters/timeFilters.js',
			],
			// the location of the resulting JS file
			dest: 'dist/lucca-ui-light.js'
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
		ng12:{
			src:[
				'js/lui.js',
				'js/directives/percentage-picker.js',
				'js/directives/timespan-picker.js',
				'js/filters/*.js',
			],
			dest: 'dist/custom/lucca-ui-compat-ng-1-2.js'
		},
		ng12Spe:{
			src:[
				'js/lui.js',
				'js/directives/percentage-picker.js',
				'js/directives/timespan-picker.js',
				'js/directives/lucca/user-picker.js',
				'js/filters/*.js',
			],
			dest: 'dist/custom/lucca-ui-spe-compat-ng-1-2.js'
		}
	};
}