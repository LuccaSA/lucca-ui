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
	grunt.loadNpmTasks('grunt-contrib-less'); // loads less compiler
	grunt.loadNpmTasks('grunt-contrib-sass'); // loads less compiler
	grunt.loadNpmTasks('grunt-contrib-concat'); // loads the file concatener
	grunt.loadNpmTasks('grunt-contrib-uglify'); // loads the file minifier
	
	// load the configs of all tasks defined under /config
	var configs = require('load-grunt-configs')(grunt);
	grunt.initConfig(configs);



	/***********************
	*** CONTINUOUS TASKS ***
	***********************/
	// use this task when you're working on the js framework, it will launch the karma testus and launch jshint on each modif of a .js file
	grunt.registerTask('dev-js', ['concurrent:js']);
	// use this task when you're working on the less framework, it will transpile automatically on each modif of a .less file
	grunt.registerTask('dev-less', ['watch:less']);
	// use this task when you're working on the less framework, it will transpile automatically on each modif of a .less file
	grunt.registerTask('dev-sass', ['watch:sass']);
	// use this task when you're working on the less framework or the js one, will do both the tasks from above concurrently
	grunt.registerTask('dev', ['concurrent:dev']);
	// use this when you are working on the demo pages, it will do devjs and devless but also transpile transpile demo.min.css if any .less file under /src or /demo is changed
	grunt.registerTask('dev-demo', ['concurrent:demo']);
	// use this when you are working on the demo pages, it will do devjs and devless but also transpile transpile demo.min.css if any .less file under /src or /demo is changed
	grunt.registerTask('dev-e2e', ['concurrent:e2e']);



	/***********************
	*** SINGLE RUN TASKS ***
	***********************/
	// this task creates the standard distribution and launches all the tests (u & e2e) in a single run
	grunt.registerTask('dist', ['dist-lucca', 'dist-standard', 'dist-light', 'dist-ng12', 'dist-less']);

	// this task creates the standard distribution
	grunt.registerTask('dist-standard', ['concat:standard', 'uglify:standard']);
	// this task creates the distribution with the code needing only moment
	grunt.registerTask('dist-light', ['concat:light']);
	// this task creates the distribution with the code spe lucca 
	grunt.registerTask('dist-lucca', ['concat:spe']);
	// This task create the distribution compatible with angular 1.2 
	grunt.registerTask('dist-ng12', ['concat:ng12']);

	// This task create the distribution cof the less framework
	grunt.registerTask('dist-less', ['less:dist']);

	// this task creates the tested distributions and launches associated tests
	grunt.registerTask('test', ['jshint', 'dist-lucca', 'dist-standard', 'dist-ng12', 'karma:spe', 'karma:ng12', 'protractor:singlerun']);

};
