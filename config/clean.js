'use strict';
module.exports = function(grunt, options){
	return {
		tests: {
			src: [
				".tests",
			]
		},
		dist: {
			src: [
				".temp",
				"dist",
			]
		}
	};
};