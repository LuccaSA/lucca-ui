/*
 * grunt-lui-build
 * https://github.com/luccaSA/grunt-lui-build
 *
 * Copyright (c) 2016 Benoît PAUGAM
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
	yaml = require('js-yaml'),
	_ = require('lodash');

module.exports = function(grunt) {
	var yamlSchema = null,
		strictOption = false,
		theme = {},

		customTypes: {
			'!theme mapping': function(values, yamlLoader) {
				var theme = luiTheme(values.family, values.objectName);
				var props = values.property.split('.');
				var result = theme;
				for (var i = 0; i < props.length; i++) {
					result = result[props[i]];
				}
				return result;
			},
			'!palette mapping': function(values, yamlLoader) {
				var palettes = luiTheme('references', 'palettes');
				var palette = palettes.colors[values.palette];
				return (values.property) ? // Was a specific property asked ?
					(values.manipulation) ? // Was a color manipulation asked ?
						palettes.manipulations[values.manipulation][0] + '(' + palette[values.property] + ', ' + palettes.manipulations[values.manipulation][1] + ')'
					: palette[values.property]
				: values.palette;
			},
			'!rem scalar': function(value, yamlLoader) {
				var rem = parseFloat(luiTheme('elements', 'typography')['body']['fontSize']);
				return (value * rem) + 'px';
			}
		}

	// Yaml file loader
	// @return
	function loadYamlFile(filepath, options)
	{
		var data = grunt.file.read(filepath, options);
		try {
			return yaml.safeLoad(data, {
				schema: yamlSchema,
				filename: filepath,
				strict: strictOption
			});
		} catch (e) {
			grunt.warn(e);
			return null;
		}
	}

	/*
	 * Retrieve theme variables from cached json or load it from file if need be
	 * @return Object
	 */
	function luiTheme(family, objectName, options)
	{
		if (theme[family][objectName])
			return theme[family][objectName];
		else
			return loadTheme(family, objectName, options);
		}
	}

	/*
	 * Load theme variables from file
	 * @return Object
	 */
	function loadTheme(family, objectName, options)
	{
		var relPath = '/' + family + '/' + objectName + '.yml',
			defaultThemeFilePath = options.defaultThemeBasePath + relPath;
			customThemeFilePath = options.customThemeBasePath ? options.customThemeFilePath + relPath : null,
			defaultTheme = loadYamlFile(defaultThemeFilePath, options),
			customTheme = (customThemeFilePath) ? loadYamlFile(customThemeFilePath, options) : {},
			result = _.merge(defaultTheme, customTheme);

		theme = _.merge(theme, result);
		return theme[family][objectName];
	}

	/*
	 * Creates the YAML schema with custom types
	 * @return YAMLSchema
	 */
	function createYamlSchema(customTypes) {
		var yamlTypes = [];

		_.each(customTypes, function(resolver, tagAndKindString) {
			var tagAndKind = tagAndKindString.split(/\s+/);

			var yamlType = new yaml.Type(tagAndKind[0], {
				loadKind: tagAndKind[1],
				loadResolver: function(state) {
					var result = resolver.call(this, state.result, loadYamlFile);

					if (_.isUndefined(result) || _.isFunction(result)) {
						return false;
					} else {
						state.result = result;
						return true;
					}
				}
			});

			yamlTypes.push(yamlType);
		});
		return yaml.Schema.create(yamlTypes);
	}

	grunt.registerMultiTask('lui-build-theme', 'Buld Lucca-UI theme json file', function()
	{
		var options = this.options(
			{
				defaultThemeBasePath: './scss/themes/default',
				customThemeBasePath: null,

				build: './scss/themes/default/build.json',

				// Ignored files regex
				ignored: null,

				// JSON formatting indentation
				space: 2
			}
		);
		yamlSchema = createYamlSchema(customTypes);

		_.each(this.files, function(file)
		{
			file.src.forEach(function(src)
			{
				if (grunt.file.isDir(src) || (options.ignored && path.basename(src).match(options.ignored)))
					return;

				result = loadYamlFile(src);
				var json = JSON.stringify(result, null, options.space);
			})
		});
	});
};
