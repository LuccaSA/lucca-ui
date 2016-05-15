'use strict';

module.exports = function(grunt, options){
	return {
		options:{
			space: 4
		},
		dist:{
			files: [
				{ 'scss/themes/default/references.json': ['scss/themes/default/core/references/**/*.yml'] },
				{ 'scss/themes/default/adjectives.json': ['scss/themes/default/core/adjectives/**/*.yml'] },
				{ 'scss/themes/default/elements.json': ['scss/themes/default/core/elements/**/*.yml'] },
			],
		}
	};
};
