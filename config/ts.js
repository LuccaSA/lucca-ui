'use strict';
module.exports = function(grunt, options){
	return {
		options:{
			sourceMap: false,
		},
		dist:{
			// src: [
			// 	// "ts/**/*.ts",
			// 	"typings/index.d.ts",
			// 	// "ts/modules.ts",
			// 	// "ts/**/*.ts",
			// 	"!**/*.spec.ts", 
			// 	"!**/*.e2e.ts",
			// ],
			// dest: ".temp/lucca-ui-ts.js",
			tsconfig: 'tsconfig.json',
			// options: {
			// 	declaration: true,
			// },
		},
		test:{
			src: [
				"typings/index.d.ts",
				"dist/lucca-ui.d.ts",
				"ts/**/*.spec.ts",
			], 
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
