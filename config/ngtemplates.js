'use strict';
module.exports = function(grunt, options){
	return {
		dist:{
			cwd: 'ts',
			src: '**/*.html',
			dest: '.temp/templates.js',
			options: {
				module: "lui.directives",
				prefix: 'lui/templates',
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: false,
					removeComments: true,
					removeEmptyAttributes: false,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				}
			}
		}
	};
}
