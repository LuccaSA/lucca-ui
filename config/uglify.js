'use strict';

module.exports = function(grunt, options){
	return {
		options: {
			// the banner is inserted at the top of the output
			banner: '/*! lucca-ui <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		},
		standard: {
			files: {
				'dist/lucca-ui.min.js': ['dist/lucca-ui.js']
			}
		}, 
		spe :{
			files: {
				'dist/custom/lucca-ui-spe.min.js': ['dist/custom/lucca-ui-spe.js']
			}
		},
	};
}