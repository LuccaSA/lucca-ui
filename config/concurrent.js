'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			logConcurrentOutput: true
		},
		debug: ['watch:js', 'watch:jsspec', 'watch:ts', 'watch:tsspec', 'watch:html', 'watch:sassdemo'],
		e2e: ['watch:e2esrc', 'watch:e2espec'],
	};
};
