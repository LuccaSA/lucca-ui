// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	config.set({

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-translate/angular-translate.js',
			'bower_components/angular-sanitize/angular-sanitize.js',
			'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
			'bower_components/ui-select/dist/select.js',
			'bower_components/moment/min/moment-with-locales.js',
			'bower_components/underscore/underscore-min.js',
			'bower_components/angular-notify/dist/angular-notify.min.js',
			'bower_components/ng-img-crop-full-extended/compile/unminified/ng-img-crop.js',
			'bower_components/api-check/dist/api-check.js',
			'bower_components/angular-formly/dist/formly.js',

			'bower_components/angular-mocks/angular-mocks.js',

			// 'js/lui.js',
			// 'js/filters/*.js',
			// 'js/directives/*.js',
			// 'js/directives/lucca/*.js',
			"dist/lucca-ui.js",

			'tests/spec/**/*.js',
			".tests/**/*.spec.js",
		],
		preprocessors: {
			"dist/lucca-ui.js": ['coverage'],
			// 'js/lui.js': ['coverage'],
			// 'js/filters/*.js': ['coverage'],
			// 'js/directives/*.js': ['coverage'],
			// 'js/directives/lucca/*.js': ['coverage'],
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
