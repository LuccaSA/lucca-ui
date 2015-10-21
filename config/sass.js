'use strict';

module.exports = function(grunt, options){
	var luiConfig = {
		bowerPath: 'bower_components',
		theme: {
			name: 'lucca',
			path: '/src2'
		}
	};
	return {
		options:{
			// style: 'compressed',
			sourcemap: 'inline',
		},
		dist:{
			loadPath: [
				'src2',
				luiConfig.bowerPath,
				luiConfig.theme.path + '/' + luiConfig.theme.name,
				'themes/lucca'
			]
		}
	};
};