'use strict';
module.exports = function(grunt, options){
	return {
		options:{
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
			sourceMap: false,
		},
		dist:{
			src: ["ts/**/*.ts", "!ts/**/*.spec.ts"],
			dest: ".temp/lucca-ui-ts.js",
			options: {
				declaration: true,
			},
		},
		tests:{
			src: ["ts/**/*.spec.ts"], 
			outDir: ".tests",
			options: {
				fast: 'never'
			}
		}
	};
};
