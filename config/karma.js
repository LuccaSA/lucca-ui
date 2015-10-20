'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			configFile: 'karma.conf.js'
		},
		dev: {
		},
		continuous: {
			singleRun: true,
			autoWatch: false,
			browsers: ['PhantomJS'],
			reporters: ['progress']
		},
		coverage: {
			singleRun: true,
			autoWatch: false,
			browsers: ['PhantomJS'],
			reporters: ['coverage'],
			preprocessors: {
				'test/**/*.js': ['coverage'],
			}
		},
		ng12:{
			configFile: 'karma.ng12.js',
			singleRun: true,
			autoWatch: false,
			browsers: ['PhantomJS'],
			reporters: ['progress']
		}
	};
}