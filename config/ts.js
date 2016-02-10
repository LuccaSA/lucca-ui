'use strict';
module.exports = function(grunt, options){
	return {
		options:{
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
		},
		dist:{
			src: ["ts/**/*.ts", "!ts/**/*.spec.ts"],
			dest: ".temp/lucca-ui-ts.js"
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
