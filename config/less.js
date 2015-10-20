'use strict';

module.exports = function(grunt, options){
	return {
		less: {
			development: {
				options: {
					compress: true,
					relativeUrls:true,
					sourceMap:true,
					sourceMapFileInline:true,
					sourceMapRootpath:"..",
					optimization: 2
				},
				files: [{
					"dist/lucca-ui.min.css": "src/lucca-ui.dist.less",
					"demo/demo.min.css": "demo/less/demo.less"
				}]
			}
		},
	};
}