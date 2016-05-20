"use strict";
module.exports = function(grunt, options){
	return {
		tsdefinitions: {
			src: ".temp/lucca-ui-spe-ts.d.ts",
			dest: "dist/lucca-ui.d.ts",
		},
	};
}