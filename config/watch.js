'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			nospawn: true
		},
		sass: {
			files: ['scss/**/*.scss', 'scss/*.sass'],
			tasks: ['sass']
		},
		sassdemo: {
			files: ['demo/**/*.scss'],
			tasks: ['sass:demo'],
		},
		distdemo: {
			files: ['js/**/*.js'],
			tasks: ['dist-lucca'],
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
