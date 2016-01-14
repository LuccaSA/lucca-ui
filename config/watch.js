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
			files: ['scss/**/*.scss', 'scss/*.sass', 'demo/**/*.scss'],
			tasks: ['sass:demo'],
		},
		js: {
			files: ['js/**/*.js'],
			tasks: ['dist', 'jshint'],
		},
		e2ejs: {
			files: ['js/**/*.js'],
			tasks: ['dist', 'protractor:singlerun']
		},
		e2espec: {
			files: ['tests/e2e/**/*.spec.js'],
			tasks: ['protractor:singlerun']
		},
	};
}
