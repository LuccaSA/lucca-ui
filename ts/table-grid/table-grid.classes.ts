
module Lui.Directives.TableGrid {
	"use strict";

	export class HeaderTree {
		public node: Header;
		public children: HeaderTree[];
	}

	export class Tree {
		public node: Node;
		public parent: Tree;
		public children: Tree[];
		public constructor(node: Node, parent: Tree) {
			this.node = node;
			this.parent = parent;
			this.children = [];
		}
	}

	export class Node {
		public key: string;
		public rowSpan: number;
		public dataColumns: DataColumn[];
	}

	export class Header {
		public label: string;
		public filterType: string;
		public hidden: boolean;
		public width: number;
		public fixed: boolean;
		public colspan: number;
		public textAlign: string;
		public position: number; // start from 1
		public grouped: boolean;
		public getValue: (object: any) => string;
		public getOrderByValue: (object: any) => any;
		public getFilterValue: (object: any) => any;
		public getGroupingKey: (object: any) => any;
	}

	export class DataColumn {
		public width: number;
		public fixed: boolean;
		public colspan: number;
		public rowspan: number;
		public textAlign: string;
		public value: string;
		public orderByValue: any;
		public filterValue: any;
		public indexColumn: number;
		public constructor(columnDefinition: TableGrid.HeaderTree, data: any) {
			this.width = columnDefinition.node.width;
			this.fixed = columnDefinition.node.fixed;
			this.colspan = columnDefinition.node.colspan;
			this.rowspan = 1;
			this.textAlign = columnDefinition.node.textAlign;
			this.value = columnDefinition.node.getValue(data);
			this.filterValue = !!columnDefinition.node.getFilterValue ? columnDefinition.node.getFilterValue(data) : columnDefinition.node.getValue(data);
			this.orderByValue = !!columnDefinition.node.getOrderByValue ? columnDefinition.node.getOrderByValue(data) : columnDefinition.node.getValue(data);
			this.indexColumn = columnDefinition.node.position;
		}
	}

	export class BrowseResult {
		public depth: number;
		public subChildren: number;
		public subDepth: number;
		public tree: HeaderTree;
	}
}
