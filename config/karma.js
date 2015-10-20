'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			configFile: 'karma.conf.js',
			singleRun: true,
			autoWatch: false,
		},
		dev: {
			singleRun: false,
			autoWatch: true,
		},
		singlerun: {
		},
		ng12:{
			configFile: 'karma.ng12.js',
		}
	};
}