
module lui.tablegrid {

	"use strict";

	export interface IDataGridScope extends angular.IScope {

		//Enum
		FilterTypeEnum: { 
			NONE: FilterType,
			TEXT: FilterType,
			SELECT: FilterType,
			MULTISELECT: FilterType,
		};

		//Directive attributes
		header: ITree;
		datas: any[];
		selectable: boolean;
		defaultOrder: string;

		//Properties
		allChecked: any;
		bodyRows: IHeader[][];
		colDefinitions: IHeader[];
		existFixedRow: boolean;
		filters: {header: IHeader, selectValues: string[], currentValues: string[]}[];
		filteredAndOrderedRows: any[];
		headerRows: IHeader[][];
		isSelectable: boolean;
		lockedWidth: number;
		masterCheckBoxCssClass: string;
		scrollableRowDefinition: IHeader[];
		selected: { orderBy: IHeader, reverse: boolean };
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
		updateOrderedRows: (header: IHeader) => void;
		updateViewAfterFiltering: () => void;
		updateViewAfterOrderBy: () => void;
	}
}
