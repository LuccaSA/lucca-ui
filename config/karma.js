'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			singleRun: true,
			autoWatch: false,
		},
		debug: {
			configFile: 'karma.conf.js',
		},
		travis: {
			configFile: 'karma.conf.js',
		},
		coverage: {
			configFile: 'karma.conf.js',
			reporters: ['junit', 'coverage'],
		},
	};
}