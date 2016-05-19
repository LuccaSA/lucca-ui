'use strict';

module.exports = function(grunt, options){
	return {
		dist: {
			options: {
				base: process.cwd(),
				custom: null,
				build: 'scss/themes/default/build.json',
				dest: 'build/lucca-ui.build.scss'
			}
		}
	};
};
