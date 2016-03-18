exports.config = {
	seleniumArgs: [],
	baseUrl: 'http://localhost:12345/tests/e2e/e2e.html', 

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
