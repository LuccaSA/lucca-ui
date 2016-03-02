module.exports = function(grunt) {

	// I don't know if this is important
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	// Loads the different modules used by this gruntfile
	// release
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-angular-templates');

	// debug
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-tslint');

	// load the configs of all tasks defined under /config
	var configs = require('load-grunt-configs')(grunt);
	grunt.initConfig(configs);

	// use this tasks when you are developping
	grunt.registerTask('debug', ["dist", "ts:test", 'concurrent:debug']);
	// // use this one when you're coding e2e tests
	grunt.registerTask('e2e', ["dist", "ts:e2e", "connect", "protractor:singlerun", 'concurrent:e2e']);
	// this task updates all distributions - launch it once before each release
	grunt.registerTask('dist', ["ts:dist", "ngtemplates:dist", 'concat:spe', 'uglify:spe', 'concat:standard', 'uglify:standard', 'sass:dist']);
	// this updates the dists and tests it, creates karma coverage
	grunt.registerTask('test', ['dist', "ts:test", 'karma:debug', 'karma:coverage', 'protractor:singlerun', 'jshint']);


	// used for travis integration
	grunt.registerTask('travis-karma', ["ts:test", 'karma:travis']);
	grunt.registerTask('travis-protractor', ["ts:e2e", "connect", "protractor:saucelab"]);
};
