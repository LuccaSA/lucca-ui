'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			singleRun: true,
			autoWatch: false,
		},
		debug: {
			configFile: 'karma.dev.js',
			singleRun: false,
			autoWatch: true,
		},
		coverage: {
			configFile: 'karma.dev.js',
			reporters: ['junit', 'coverage'],
		},
		spe: {
			configFile: 'karma.spe.js',
		},
		ng12:{
			configFile: 'karma.ng12.js',
		}
	};
}