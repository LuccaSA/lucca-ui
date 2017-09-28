
module lui.tablegrid {
	"use strict";

	export interface ITree {
		node: IHeader;
		children: ITree[];
	}

	export interface IHeader {
		label: string;
		filterType?: FilterType;
		hidden?: boolean;
		width?: number;
		fixed?: boolean;
		colspan?: number;
		rowspan?: number;
		textAlign?: string;
		preserveLineBreaks?: boolean;
		getValue(object: any): string;
		getOrderByValue?(object: any): any;
		getFilterValue?(object: any): any;
	}

	export interface IBrowseResult {
		depth?: number;
		subChildren?: number;
		subDepth?: number;
		tree: ITree;
	}
	export enum FilterType {
		NONE = 0,
		TEXT = 1,
		SELECT = 2,
		MULTISELECT = 3,
	}
}
