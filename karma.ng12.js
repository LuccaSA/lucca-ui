// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	config.set({

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.29/angular.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.29/angular-mocks.js',
			'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.29/angular-sanitize.js',

			'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
			'bower_components/ui-select/dist/select.js',
			'bower_components/moment/min/moment-with-locales.js',
			'bower_components/underscore/underscore-min.js',
			
			'dist/custom/lucca-ui-compat-ng-1-2.js',

			'tests/spec/genericFilters.spec.js',
			'tests/spec/timeFilters.spec.js',
			'tests/spec/directives/timespan-picker.spec.js',
			'tests/spec/directives/percentage-picker.spec.js',
		],

		// web server port
		port: 9876,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		plugins: [
			'karma-jasmine',
			'karma-phantomjs-launcher',
			'karma-junit-reporter',
			'karma-coverage',
		],

		browsers: ['PhantomJS'],
		reporters: ['progress'],
		junitReporter: {
			outputFile: 'test-karma-admin-results.xml',
			suite: 'Lucca-ui'
		}
	});
};
