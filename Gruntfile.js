module.exports = function(grunt) {

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
	grunt.loadNpmTasks('grunt-contrib-concat'); // loads the file concatener
	grunt.loadNpmTasks('grunt-contrib-uglify'); // loads the file minifier
	
	// load the configs of all tasks defined under /config
	var configs = require('load-grunt-configs')(grunt);
	grunt.initConfig(configs);
	
	// register some grunt tasks
	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('minifyjs', ['concat:dist','uglify']);
	grunt.registerTask('ng12', ['concat:ng12','karma:ng12']);

};
