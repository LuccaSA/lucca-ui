'use strict';

module.exports = function(grunt, options){
	return {
		options:{
			outputStyle: 'compressed',
			sourcemap: 'inline',
			includePaths: [
				'bower_components',
				'themes/sample'
			],
		},
		dist:{
			files: [
				{
					"dist/lucca-ui.global.min.css": "scss/lucca-ui.global.scss"
				}
			]
		},
		demo:{
			files: [
				{
					"demo/demo.min.css": "demo/sass/demo.scss"
				}
			]
		}
	};
};
