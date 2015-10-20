'use strict';

module.exports = function(grunt, options){

	return {
		options: {
			compress: true,
			relativeUrls:true,
			sourceMap:true,
			sourceMapFileInline:true,
			sourceMapRootpath:"..",
			optimization: 2
		},
		dist: {
			files: [{
				"dist/lucca-ui.min.css": "src/lucca-ui.dist.less"
			}]
		},
		demo: {
			files: [{
				"demo/demo.min.css": "demo/less/demo.less"
			}]
		},
	};
}