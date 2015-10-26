'use strict';

module.exports = function(grunt, options){
	return {
		files: ['js/**/*.js'],
		options: {
			// options here to override JSHint defaults
			globals: {
				jQuery: true,
				console: true,
				module: true,
				document: true
			}
		}
	};
}