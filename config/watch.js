'use strict';

module.exports = function(grunt, options){
	return {
		less: {
			files: ['src/**/*.less'],
			tasks: ['less'],
			options: {
				nospawn: true
			}
		},
		js: {
			files: ['js/**/*.js'],
			tasks: ['minifyjs','jshint'], // minify is put before jshint because if jshint finds an error, it will not launch any tasks after that so the minification was not done
			options: {
				nospawn: true
			}
		}
	};
}