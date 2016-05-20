'use strict';
module.exports = function(grunt, options){
	return {
		options:{
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
			sourceMap: false,
		},
		dist:{
			src: [
				"ts/**/*.ts", 
				"!ts/**/*.spec.ts", 
				"!ts/**/*.e2e.ts",
				"!ts/table-grid/**/*.*",
				"!ts/notify-service/**/*.*",
				"typings/tsd.d.ts"
			],
			dest: ".temp/lucca-ui-ts.js",
			// options: {
			// 	declaration: true,
			// },
		},
		distspe:{
			src: [
				"ts/**/*.ts",
				"!ts/**/*.spec.ts",
				"!ts/**/*.e2e.ts",
				"typings/tsd.d.ts"
			],
			dest: ".temp/lucca-ui-spe-ts.js",
			options: {
				declaration: true,
			},
		},
		test:{
			src: ["ts/**/*.spec.ts"], 
			outDir: ".tests",
			options: {
				fast: 'never'
			}
		},
		e2e:{
			src: ["ts/**/*.e2e.ts"], 
			outDir: ".tests",
			options: {
				fast: 'never'
			}
		}
	};
};
