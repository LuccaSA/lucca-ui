'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			configFile: "protractor.conf.js", // Default config file
			keepAlive: false, // If false, the grunt process stops when the test fails.
			noColor: false, // If true, protractor will not use colors in its output.
			args: {
				specs: [
					'tests/e2e/**/*.spec.js'
				],
				capabilities: {
					'browserName': 'chrome' 
				},
				rootElement: '[ng-app]'
			}
		},
		continuous: {
		},
		dev: {
			configFile: "protractor.conf.js"
		}
	};
}