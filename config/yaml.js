'use strict';

module.exports = function(grunt, options){
	var _ = require('lodash'),
		theme = {};

	return {
		options:{
			disableDest: true,    // Grunt will not create a config.json as per the destination of the files object
			middleware: function(response, json, src, dest){
				theme = _.merge(theme, JSON.parse(json));
				json = JSON.stringify(theme, null, 4);
				grunt.file.write(dest, json, {encoding: grunt.file.defaultEncoding});
				grunt.log.writeln('Compiled ' + src.cyan + ' -> ' + dest.cyan);
			},

			customTypes: {
				'!theme mapping': function(values, yamlLoader) {
					var yamlFile = yamlLoader('./scss/themes/default/core/' + values.family + '/' + values.object + '.yml').theme.core[values.family][values.object];
					var props = values.property.split('.');
					var result = yamlFile;
					for (var i = 0; i < props.length; i++) {
						result = result[props[i]];
					}
					return result;
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
				{ 'scss/themes/default/theme.json': ['scss/themes/default/core/**/*.yml'] },
				// { 'scss/themes/default/references.json': ['scss/themes/default/core/references/**/*.yml'] },
				// { 'scss/themes/default/adjectives.json': ['scss/themes/default/core/adjectives/**/*.yml'] },
				// { 'scss/themes/default/elements.json': ['scss/themes/default/core/elements/**/*.yml'] },
			],
		}
	};
};
