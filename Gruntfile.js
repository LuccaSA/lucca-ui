module.exports = function(grunt) {

	// I don't know if this is important
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	// Loads the different modules used by this gruntfile
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-concurrent'); // loads concurrent runner
	grunt.loadNpmTasks('grunt-contrib-watch'); // loads watch contrib
	grunt.loadNpmTasks('grunt-sass'); // loads sass compiler
	grunt.loadNpmTasks('grunt-contrib-concat'); // loads the file concatener
	grunt.loadNpmTasks('grunt-contrib-uglify'); // loads the file minifier

	// load the configs of all tasks defined under /config
	var configs = require('load-grunt-configs')(grunt);
	grunt.initConfig(configs);

	// use this tasks when you are developping
	grunt.registerTask('debug', ['concurrent:debug']);
	// use this one when you're coding e2e tests
	grunt.registerTask('e2e', ['concurrent:e2e']);
	// this task updates all distributions - launch it once before each release
	grunt.registerTask('dist', ['concat:spe', 'uglify:spe', 'concat:standard', 'uglify:standard', 'concat:ng12', 'uglify:ng12', 'sass:dist']);
	// this updates the dists and tests it, creates karma coverage
	grunt.registerTask('test', ['dist', 'karma:spe', 'karma:ng12', 'karma:coverage', 'protractor:singlerun', 'jshint']);
};
