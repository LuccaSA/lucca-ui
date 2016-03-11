/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface IDataGridScope extends angular.IScope {
		canvasHeight: any;
		datas: any[];
		filteredAndOrderedRows: any[];
		fixedHeaderRows: TableGrid.Header[][];
		fixedRowDefinition: TableGrid.Header[];
		header: TableGrid.Tree;
		leftFilters: {header: TableGrid.Header, value: string}[];
		rightFilters: {header: TableGrid.Header, value: string}[];
		scrollableHeaderRows: TableGrid.Header[][];
		scrollableRowDefinition: TableGrid.Header[];
		selected: { orderBy: TableGrid.Header, reverse: boolean };
		visibleRows: any[];
		selectable: boolean;
		allChecked: any;

		stripHtml(html: string): string;
		updateFilterBy(header: TableGrid.Header, index: number): void;
		updateOrderBy(header: TableGrid.Header): void;
		updateVirtualScroll(): void;
		onMasterCheckBoxChange(): void;
		onCheckBoxChange(): void;
	}

}
