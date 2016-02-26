/// <reference path="../references.ts" />

module Lui.Directives.TableGrid {
	"use strict";

	export class Tree {
		public node: Header;
		public children: Tree[];
	}

	export class Header {
		public label: string;
		public filterable: boolean;
		public hidden: boolean;
		public width: number;
		public fixed: boolean;
		public colspan: number;
		public rowspan: number;
		public textAlign: string;
		public getValue: (object: any) => string;
		public getOrderByValue: (object: any) => any;
	}

	export class BrowseResult {
		public depth: number;
		public subChildren: number;
		public subDepth: number;
		public tree: Tree;
	}
}
