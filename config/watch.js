'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			nospawn: true
		},
		less: {
			files: ['src/**/*.less'],
			tasks: ['less:dist'],
		},
		sass: {
			files: ['src2/**/*.scss', 'src2/*.sass'],
			tasks: ['sass']
		},
		demo: {
			files: ['demo/**/*.scss'],
			tasks: ['sass:demo'],
		},
		js: {
			files: ['js/**/*.js'],
			tasks: ['jshint'], // minify is put before jshint because if jshint finds an error, it will not launch any tasks after that so the minification was not done
		},
		e2ejs: {
			files: ['js/**/*.js'],
			tasks: ['dist-lucca', 'protractor:singlerun']
		},
		e2espec: {
			files: ['tests/e2e/**/*.spec.js'],
			tasks: ['protractor:singlerun']
		},
	};
}