'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			logConcurrentOutput: true
		},
		debug: ['watch:js','watch:sassdemo','karma:debug'],
		e2e: ['watch:e2ejs', 'watch:e2espec'],
	};
};
