// A reference configuration file. - don't touch it except for baseUrl
exports.config = {
	seleniumArgs: [],
	baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '9001') + '/tests/e2e/e2e.html',
	sauceUser: process.env.SAUCE_USERNAME,
	sauceKey: process.env.SAUCE_ACCESS_KEY,

	onPrepare: function() {
		browser.driver.get(exports.config.baseUrl);
	},
	capabilities: {
		'browserName': 'chrome',
		'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
		'build': process.env.TRAVIS_BUILD_NUMBER,
		'name': 'lucca-ui e2e tests'
	},
	jasmineNodeOpts: {
		// onComplete will be called just before the driver quits.
		onComplete: null,
		// If true, display spec names.
		isVerbose: false,
		// If true, print colors to the terminal.
		showColors: true,
		// If true, include stack traces in failures.
		includeStackTrace: true,
		// Default time to wait in ms before a test fails.
		defaultTimeoutInterval: 100000
	}
};
