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

		existFixedRow: boolean;
		header: TableGrid.Tree;
		filters: {header: TableGrid.Header, selectValues: string[], currentValues: string[]}[];
		scrollableRowDefinition: TableGrid.Header[];
		selectable: boolean;
		isSelectable: boolean;
		selected: { orderBy: TableGrid.Header, reverse: boolean };
		visibleRows: any[];

		stripHtml: (html: string) => string;
		updateFilteredRows: () => void;
		resizedHeaders: () => void;
		updateOrderedRows: (header: TableGrid.Header) => void;
		onMasterCheckBoxChange: () => void;
		onCheckBoxChange: () => void;
		refresh: () => void;
		updateViewAfterFiltering: () => void;
		updateViewAfterOrderBy: () => void;
		masterCheckBoxCssClass: string;
	}

}
