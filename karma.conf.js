// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	config.set({

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'node_modules/api-check/dist/api-check.js',
			'node_modules/angular/angular.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
			'node_modules/angular-formly/dist/formly.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'node_modules/@cgross/angular-notify/dist/angular-notify.min.js',
			'node_modules/angular-sanitize/angular-sanitize.js',
			'node_modules/angular-translate/dist/angular-translate.js',
			'node_modules/moment/min/moment-with-locales.js',
			'node_modules/ui-cropper/compile/unminified/ui-cropper.js',
			'node_modules/ui-select/dist/select.js',
			'node_modules/underscore/underscore-min.js',


			"dist/lucca-ui.js",

			'tests/spec/**/*.js',
			".tests/**/*.spec.js",
		],
		preprocessors: {
			"dist/lucca-ui.js": ["coverage"],
		},
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
		reporters: ['progress', 'coverage'],
		junitReporter: {
			outputFile: 'karma-results.xml',
			useBrowserName: false,
			suite: 'Lucca-ui'
		},
		coverageReporter: {
			type : 'html',
			dir : 'coverage/',
			subdir: '.',
			// file : 'coverage-final.json'
		}
	});
};
