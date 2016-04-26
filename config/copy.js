"use strict";
module.exports = function(grunt, options){
	return {
		tsdefinitions: {
			src: ".temp/lucca-ui-ts.d.ts",
			dest: "dist/lucca-ui.d.ts",
		},
	};
}