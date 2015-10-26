'use strict';

module.exports = function(grunt, options){
	var luiConfig = {
		bowerPath: 'bower_components',
		theme: {
			name: 'sample',
			path: 'themes'
		}
	};
	return {
		options:{
			// style: 'compressed',
			sourcemap: 'inline',
		},
		dist:{
			loadPath: [
				'scss',
				luiConfig.bowerPath,
				luiConfig.theme.path + '/' + luiConfig.theme.name
			]
		}
	};
};