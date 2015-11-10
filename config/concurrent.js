'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			logConcurrentOutput: true
		},
		js: ['watch:js','karma:dev'],
		dev: ['watch:js','watch:sass','karma:dev'],
		demo: ['watch:js','watch:distdemo', 'watch:sassdemo','karma:dev'],
		e2e: ['watch:e2ejs', 'watch:e2espec'],
	};
};
