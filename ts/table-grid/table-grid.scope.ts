/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface IDataGridScope extends angular.IScope {

		//Enum
		FilterTypeEnum: FilterTypeEnum;

		//Directive attributes
		header: TableGrid.Tree;
		datas: any[];
		selectable: boolean;
		defaultOrder: string;

		//Properties
		allChecked: any;
		bodyRows: TableGrid.Header[][];
		canvasHeight: number;
		colDefinitions: TableGrid.Header[];
		existFixedRow: boolean;
		filters: {header: TableGrid.Header, selectValues: string[], currentValues: string[]}[];
		filteredAndOrderedRows: any[];
		headerRows: TableGrid.Header[][];
		isSelectable: boolean;
		lockedWidth: number;
		masterCheckBoxCssClass: string;
		scrollableRowDefinition: TableGrid.Header[];
		selected: { orderBy: TableGrid.Header, reverse: boolean };
		visibleRows: any[];

		//Methods
		initFilter: () => void;
		onCheckBoxChange: () => void;
		onMasterCheckBoxChange: () => void;
		orderBySelectedHeader: () => void;
		refresh: () => void;
		resizedHeaders: () => void;
		stripHtml: (html: string) => string;
		updateFilteredRows: () => void;
		updateOrderedRows: (header: TableGrid.Header) => void;
		updateViewAfterFiltering: () => void;
		updateViewAfterOrderBy: () => void;
	}
}
