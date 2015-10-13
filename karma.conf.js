// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	config.set({
	// base path, that will be used to resolve files and exclude
	basePath: '',

	// testing framework to use (jasmine/mocha/qunit/...)
	frameworks: ['jasmine'],

	// list of files / patterns to load in the browser
	files: [

		'bower_components/angular/angular.js',
		'bower_components/moment/min/moment-with-locales.js',
		'bower_components/underscore/underscore-min.js',

		'bower_components/angular-mocks/angular-mocks.js',

		'dist/lucca-ui.js',

		'tests/**/*.js'
	],

	preprocessors: {

	},

	ngHtml2JsPreprocessor: {
		prependPrefix: ''
	},

	ngJson2JsPreprocessor: {

		cacheIdFromPath: function(filepath) {

			// filepath = Assistant/test/mock/metadata.json
			var parts     = filepath.split('/');
			var module    = parts[0];                              // eg: Assistant
			var subModule = parts[parts.length - 1].split('.')[0]; // eg: metadata

			// Tried having <module>.Tests.<subModule> to follow pattern we use for Angular modules
			// But when test is running, we have "TypeError: Attempted to assign to readonly property."
			return module + '/Tests/' + subModule;
		}
	},

	// list of files / patterns to exclude
	exclude: [],

	// web server port
	port: 9876,

	// level of logging
	// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
	logLevel: config.LOG_INFO,

	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,
	// Continuous Integration mode
	// if true, it capture browsers, run tests and exit
	singleRun: false,


	plugins: [
		'karma-jasmine',
		'karma-phantomjs-launcher',
		'karma-junit-reporter',
		'karma-coverage',
		'karma-ng-html2js-preprocessor',
		'karma-ng-json2js-preprocessor'
	],
	// Start these browsers, currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari (only Mac)
	// - PhantomJS
	// - IE (only Windows)
	browsers: ['PhantomJS'],
	reporters: ['progress'],
	junitReporter: {
		outputFile: 'test-karma-admin-results.xml',
		suite: 'Lucca-ui'
	}
});
};
