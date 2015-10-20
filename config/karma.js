'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			singleRun: true,
			autoWatch: false,
		},
		dev: {
			configFile: 'karma.dev.js',
			singleRun: false,
			autoWatch: true,
		},
		continuous: {
			configFile: 'karma.dev.js',
		},
		spe: {
			configFile: 'karma.spe.js',
		},
		ng12:{
			configFile: 'karma.ng12.js',
		}
	};
}