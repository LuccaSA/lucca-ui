module.exports = function(grunt) {

	// I don't know if this is important
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	// Loads the different modules used by this gruntfile
	// release
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-angular-templates');

	// debug
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-tslint');

	// load the configs of all tasks defined under /config
	var configs = require('load-grunt-configs')(grunt);
	grunt.initConfig(configs);

	// this task updates all distributions - launch it once before each release
	grunt.registerTask('dist', ["clean:dist", "ts:dist", "ngtemplates:dist", 'concat:standard', 'uglify:standard', 'sass:dist', "copy:tsdefinitions", "copy:demolibs"]);

	// use this tasks when you are developping
	grunt.registerTask('debug', ["dist", "sass:demo", "clean:tests", "ts:test", "connect:server", "concurrent:debug"]);
	// // use this one when you're coding e2e tests
	grunt.registerTask('e2e', ["dist", "ts:e2e", "connect", "protractor:singlerun", "concurrent:e2e"]);
	// this updates the dists and tests it, creates karma coverage
	grunt.registerTask('test', ["dist", "clean:tests", "ts:test", 'karma:debug', 'karma:coverage', "connect:server", "protractor:singlerun", "jshint"]);

	// default task
	grunt.registerTask('default', ['debug']);


	// used for travis integration
	grunt.registerTask('travis-karma', ["ts:test", 'karma:travis']);
	// grunt.registerTask('travis-protractor', ["ts:e2e", "connect", "protractor:saucelab"]);
	grunt.registerTask('jenkins-karma', ["ts:test", "karma:coverage"]);
	grunt.registerTask('jenkins-protractor', ["ts:e2e", "connect", "protractor:singlerun"]);
};
