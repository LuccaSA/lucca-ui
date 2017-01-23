
module lui.tablegrid {

	"use strict";

	export interface IDataGridScope extends angular.IScope {

		//Enum
		FilterTypeEnum: FilterTypeEnum;

		//Directive attributes
		header: Tree;
		datas: any[];
		selectable: boolean;
		defaultOrder: string;

		//Properties
		allChecked: any;
		bodyRows: Header[][];
		colDefinitions: Header[];
		existFixedRow: boolean;
		filters: {header: Header, selectValues: string[], currentValues: string[]}[];
		filteredAndOrderedRows: any[];
		headerRows: Header[][];
		isSelectable: boolean;
		lockedWidth: number;
		masterCheckBoxCssClass: string;
		scrollableRowDefinition: Header[];
		selected: { orderBy: Header, reverse: boolean };
		visibleRows: any[];

		//Methods
		initFilter: () => void;
		onCheckBoxChange: () => void;
		onMasterCheckBoxChange: () => void;
		internalRowClick: (event: any, row: any) => void;
		onRowClick: (row: any) => void;
		orderBySelectedHeader: () => void;
		refresh: () => void;
		resizedHeaders: () => void;
		stripHtml: (html: string) => string;
		updateFilteredRows: () => void;
		updateOrderedRows: (header: Header) => void;
		updateViewAfterFiltering: () => void;
		updateViewAfterOrderBy: () => void;
	}
}
