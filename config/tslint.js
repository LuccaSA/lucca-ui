'use strict';
module.exports = function(grunt, options){
	return {
		options: {
			configuration: "tslint-options.json",
		},
		files: {
			src: ["ts/**/*.ts", "!ts/**/*.spec.ts"],
		}
	};
};
