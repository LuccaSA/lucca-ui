(function(){
	'use strict';
	function replaceAll(string, find, replace) {
		// http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
		// lets not reinvent the wheel
		if(!string){ return ''; }
		function escapeRegExp(string) {
			return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
		}
		return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}
	angular.module('lui.filters')
	.filter('luifPlaceholder', function () {
		return function (_input, _placeholder) {
			return !!_input ? _input : _placeholder;
		};
	})
	.filter('luifDefaultCode', function () {
		// uppercased and with '_' instead of ' '
		return function (_input) {
			return replaceAll(_input, ' ', '_').toUpperCase();
		};
	})
	.filter('luifStartFrom', function () {
		//pagination filter
		return function (_input, start) {
			start = +start; //parse to int
			return _input.slice(start);
		};
	})
	.filter('luifNumber', ['$sce', '$filter', function($sce, $filter) {
		return function(_input, _precision) {
			var separator = $filter("number")(1.1,1)[1];
			var precision = _precision || 2;

			var text = $filter("number")(_input, precision);

			var details = text.split(separator);
			if ( parseInt(details[1]) === 0) {
				return $sce.trustAsHtml(details[0] + "<span style=\"opacity:0\">" + separator + details[1] + "</span>");
			}
			return $sce.trustAsHtml(details[0] + separator + details[1]);
		};
	}]);
})();