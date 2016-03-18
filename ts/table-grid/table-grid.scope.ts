/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface IDataGridScope extends angular.IScope {
		allChecked: any;
		canvasHeight: number;
		datas: any[];
		filteredAndOrderedRows: any[];
		headerRows: TableGrid.Header[][];
		lockedWidth: number;
		bodyRows: TableGrid.Header[][];
		colDefinition: TableGrid.Header[];

		fixedRowDefinition: TableGrid.Header[];
		header: TableGrid.Tree;
		leftFilters: {header: TableGrid.Header, value: string}[];
		rightFilters: {header: TableGrid.Header, value: string}[];
		scrollableRowDefinition: TableGrid.Header[];
		selectable: boolean;
		selected: { orderBy: TableGrid.Header, reverse: boolean };
		visibleRows: any[];

		stripHtml: (html: string) => string;
		updateFilterBy: (header: TableGrid.Header, index: number) => void;
		updateFilteredAndOrderedRows: () => void;
		updateOrderBy: (header: TableGrid.Header) => void;
		updateVirtualScroll: () => void;
		onMasterCheckBoxChange: () => void;
		onCheckBoxChange: () => void;
		getCheckboxState: () => string;
		refresh: () => void;
	}

}
