// A reference configuration file. - don't touch it except for baseUrl
exports.config = {
	seleniumArgs: [],
	baseUrl: 'http://localhost:9001/tests/e2e/e2e.html', // use a adifferent url in your protractor.conf.js.dev

	onPrepare: function() {
		browser.driver.get(exports.config.baseUrl);
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
