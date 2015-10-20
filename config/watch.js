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
		demo: {
			files: ['demo/**/*.less'],
			tasks: ['less:demo'],
		},
		js: {
			files: ['js/**/*.js'],
			tasks: ['jshint'], // minify is put before jshint because if jshint finds an error, it will not launch any tasks after that so the minification was not done
		}
	};
}