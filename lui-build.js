'use strict';

// Dependencies
var path = require('path'),
	yaml = require('js-yaml'),
	_ = require('lodash');

// Variables
var yamlSchema = null,

	// Options defaults
	defaults = {
		customTypes = {
			'!theme mapping': function(values, yamlLoader) {
				var theme = luiTheme('core', values.family, values.object);
				var props = values.property.split('.');
				var result = theme;
				for (var i = 0; i < props.length; i++) {
					result = result[props[i]];
				}
				return result;
			},

			'!palette mapping': function(values, yamlLoader) {
				var palettes = luiTheme('core', 'references', 'palettes');

				var palette = palettes.colors[values.palette];
				return (values.property) ? // Was a specific property asked ?
					(values.manipulation) ? // Was a color manipulation asked ?
						palettes.manipulations[values.manipulation][0] + '(' + palette[values.property] + ', ' + palettes.manipulations[values.manipulation][1] + ')'
					: palette[values.property]
				: values.palette;
			},

			'!rem scalar': function(value, yamlLoader) {
				var rem = parseFloat(luiTheme('core', 'elements', 'typography')['body']['fontSize']),
					result = (value * rem) + 'px';
				return result;
			}
		}
	};


/**
 * Creates the YAML schema based on default and passed custom types.
 *
 * @param  {Object} options
 * @return {Object}
 */
function createYamlSchema(options) {
	var yamlTypes = [];
	_.each(options.customTypes, function(resolver, tagAndKindString) {
		var tagAndKind = tagAndKindString.split(/\s+/),
			yamlType = new yaml.Type(tagAndKind[0], {
				kind: tagAndKind[1],
				construct: function(data) {
					var result = resolver.call(this, data, loadYamlFile);
					if (_.isUndefined(result) || _.isFunction(result)) {
						return null;
					} else {
						return result;
					}
				}
			});
		yamlTypes.push(yamlType);
	});
	return yaml.Schema.create(yamlTypes);
}


/**
 * Loads a YAML file and parses it into an Object.
 *
 * @param  {String} filepath
 * @return {Object}
 */
function loadYamlFile(filepath, yamlSchema) {
	var data = grunt.file.read(filepath, options);

	try {
		return yaml.safeLoad(data, {
			schema: yamlSchema,
			filename: filepath,
			strict: strictOption
		});
	} catch (e) {
		console.error(e);
		return null;
	}
}


/**
 * Load theme variables from a YAML file.
 *
 * @param {}
 * @return {Object}
 */
function loadTheme(section, family, objectName, options) {
	var relPath = ['', section, family, objectName + '.yml'].join('/'),
		defaultThemeFilePath = basePath + options.defaultThemeBasePath + relPath,
		customThemeFilePath = options.customThemeBasePath ? basePath + options.customThemeFilePath + relPath : null,
		defaultTheme = loadYamlFile(defaultThemeFilePath, options),
		customTheme = (customThemeFilePath) ? loadYamlFile(customThemeFilePath, options) : {},
		result = _.merge(defaultTheme, customTheme);

	theme = _.merge(theme, result);

	return theme['theme'][section][family][objectName];
}


module.exports = {
	buildTheme: function(options) {

		// Build options
		this.options = _.merge(defaults, options);

		yamlSchema = createYamlSchema(options);
	}
}
