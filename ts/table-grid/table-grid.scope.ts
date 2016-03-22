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
		colDefinitions: TableGrid.Header[];
		FilterTypeEnum: FilterTypeEnum;

		fixedRowDefinition: TableGrid.Header[];
		header: TableGrid.Tree;
		filters: {header: TableGrid.Header, selectValues: string[], currentValues: string[]}[];
		scrollableRowDefinition: TableGrid.Header[];
		selectable: boolean;
		selected: { orderBy: TableGrid.Header, reverse: boolean };
		visibleRows: any[];

		clearSelect: ($select: any, $index: number, $event: any) => void;
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
