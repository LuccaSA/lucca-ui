'use strict';

module.exports = function(grunt, options){
	return {
		options:{
			style: 'compressed',
			sourcemap: 'inline',
			includePaths: [
				'scss',
				'themes/default',
				'themes/sample',
				'bower_components/lucca-icons/src'
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
