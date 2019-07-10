'use strict';

const sass = require('sass');

module.exports = function(grunt, options){
	return {
		options:{
			outputStyle: 'compressed',
			sourcemap: 'inline',
			includePaths: [
				'scss/themes/sample'
			],
			implementation: sass
		},
		dist:{
			files: [
				{
					"dist/lucca-ui.global.min.css": "scss/lucca-ui.global.scss"
				}
			]
		},
		demo:{
			options: {
				includePaths: [
					'demo/sass/theme',
					'scss/themes/sample'
				],
				outputStyle: "expanded",
			},
			files: [
				{
					"demo/demo.min.css": "demo/demo.scss"
				}
			]
		}
	};
};
