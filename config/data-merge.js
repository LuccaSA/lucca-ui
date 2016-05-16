'use strict';

module.exports = function(grunt, options){
	return {
		options:{
			space: 4,
			customTypes: {
				'!theme mapping': function(values, yamlLoader) {
					var yamlFile = yamlLoader('./scss/themes/default/core/' + values.family + '/' + values.object + '.yml');
					return yamlFile.theme.core[values.family][values.object][values.property];
				},
				'!palette mapping': function(values, yamlLoader) {
					var palettes = yamlLoader('./scss/themes/default/core/references/palettes.yml').theme.core.references.palettes;
					var palette = palettes.colors[values.palette];
					return (values.property) ? // Was a specific property asked ?
						(values.manipulation) ? // Was a color manipulation asked ?
							palettes.manipulations[values.manipulation][0] + '(' + palette[values.property] + ', ' + palettes.manipulations[values.manipulation][1] + ')'
						: palette[values.property]
					: values.palette;
				},
				'!rem scalar': function(value, yamlLoader) {
					var rem = parseFloat(yamlLoader('./scss/themes/default/core/elements/typography.yml').theme.core.elements.typography.body.fontSize);
					return (value * rem) + 'px';
				}
			},

		},
		dist:{
			files: [
				// { 'scss/themes/default/theme.json': ['scss/themes/default/core/elements/divider.yml','scss/themes/default/core/elements/block.yml'] },
				{ 'scss/themes/default/theme.json': ['scss/themes/default/core/**/*.yml'] },
				// { 'scss/themes/default/references.json': ['scss/themes/default/core/references/**/*.yml'] },
				// { 'scss/themes/default/adjectives.json': ['scss/themes/default/core/adjectives/**/*.yml'] },
				// { 'scss/themes/default/elements.json': ['scss/themes/default/core/elements/**/*.yml'] },
			],
		}
	};
};
