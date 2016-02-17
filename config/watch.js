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
			tasks: ['dist', 'karma:debug', 'jshint'],
		},
		jsspec: {
			files: ['tests/spec/**/*.js'],
			tasks: ['karma:debug'],
		},
		e2ejs: {
			files: ['js/**/*.js'],
			tasks: ['dist', 'protractor:singlerun']
		},
		e2espec: {
			files: ['tests/e2e/**/*.spec.js'],
			tasks: ['protractor:singlerun']
		},
		ts: {
			files: ["ts/**/*.ts", "!ts/**/*.spec.ts"],
			tasks: ["dist", "ts:tests", "karma:debug", "tslint"]
		},
		tsspec: {
			files: ["ts/**/*.spec.ts"],
			tasks: ["ts:test", "karma:debug"]
		},
		html: {
			files: ["ts/**/*.html"],
			tasks: ["dist"]
		}
	};
}
