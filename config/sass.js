'use strict';

module.exports = function(grunt, options){
	var jsonImporter = require('node-sass-json-importer');

	return {
		options:{
			outputStyle: 'compressed',
			sourcemap: 'inline',
			includePaths: [
				'scss/themes/sample'
			],
			importer: [jsonImporter]
		},
		dist:{
			files: [
				{
					"dist/lucca-ui.min.css": "scss/lucca-ui.namespaced.scss"
				}
			],
		},
		demo:{
			options: {
				importer: jsonImporter,
				includePaths: [
					'demo/sass/demo-theme',
					'scss/themes/sample'
				],
			},
			files: [
				{
					"demo/demo.min.css": "demo/sass/demo.scss"
				}
			],
		}
	};
};
