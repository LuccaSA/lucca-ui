
module Lui.Directives {

	"use strict";
	import DataColumn = Lui.Directives.TableGrid.DataColumn;

	export interface IDataGridScope extends angular.IScope {

		//Enum
		FilterTypeEnum: FilterTypeEnum;

		//Directive attributes
		header: TableGrid.HeaderTree;
		datas: any[];
		selectable: boolean;
		defaultOrder: string;

		//Properties
		allChecked: any;
		bodyRows: TableGrid.Header[][];
		columnDefinitions: TableGrid.Header[];
		existFixedRow: boolean;
		displayedRows: DataColumn[][];
		filters: { header: TableGrid.Header, selectValues: string[], currentValues: string[] }[];
		filteredAndOrderedDatasTrees: TableGrid.Tree[];
		datasTrees: TableGrid.Tree[];
		headerRows: TableGrid.Header[][];
		isSelectable: boolean;
		lockedWidth: number;
		masterCheckBoxCssClass: string;
		scrollableRowDefinition: TableGrid.Header[];
		columnSelected: { orderByColumnIndex: number, reverse: boolean };
		visibleRows: any[];

		//Methods
		initFilter: () => void;
		onCheckBoxChange: () => void;
		onMasterCheckBoxChange: () => void;
		getCustomRowsGroups: (rowsTrees: any[]) => TableGrid.DataColumn[][][];
		internalRowClick: (event: any, row: any) => void;
		onRowClick: (row: any) => void;
		orderBySelectedHeader: () => void;
		refresh: () => void;
		resizedHeaders: () => void;
		stripHtml: (html: string) => string;
		updateFilteredRows: () => void;
		updateOrderedRows: (columnIndex: number) => void;
		updateViewAfterFiltering: () => void;
		updateViewAfterOrderBy: () => void;
	}
}
