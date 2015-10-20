'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			// define a string to put between each file in the concatenated output
			separator: ';'
		},
		dist: {
			// we dont use the **/*.js synthax cuz it's still a WIP in the transition and all the js files are not meant to be distributed
			src: [
				'js/lui.js',
				'js/directives/*.js',
				'js/directives/lucca/*.js',
				'js/filters/*.js',
			],
			// the location of the resulting JS file
			dest: 'dist/lucca-ui.js'
		},
		ng12:{
			src:[
				'js/lui.js',
				'js/directives/percentage-picker.js',
				'js/directives/timespan-picker.js',
				'js/filters/*.js',
			],
			dest: 'dist/custom/lucca-ui-compat-ng-1-2.js'
		}
	};
}