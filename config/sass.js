const sass = require('sass');

module.exports = function(grunt, options){
	return {
		options:{
			implementation: sass,
			outputStyle: 'compressed',
			sourcemap: 'inline',
			includePaths: [
				'scss/themes/sample'
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
			options: {
				includePaths: [
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
