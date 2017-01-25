
module Lui.Directives {

	"use strict";

	export interface ILuidTableGridAttributes extends ng.IAttributes {
		height: string;
		heightType: string;
		selectable: boolean;
	}

	export class LuidTableGridHeightType {
		public static GLOBAL = "global";
		public static BODY = "body";
		public static isTypeExisting(type: string): Boolean {
			return type === LuidTableGridHeightType.GLOBAL || type === LuidTableGridHeightType.BODY;
		}
	}

	export class LuidTableGrid implements angular.IDirective {

		public static defaultHeight = 20;
		public static IID = "luidTableGrid";
		public controller = "luidTableGridController";
		public restrict = "AE";
		public scope = { header: "=", height: "@", datas: "=*", selectable: "@", defaultOrder: "@", onRowClick: "&", heightType: "@" };
		public templateUrl = "lui/templates/table-grid/table-grid.html";
		private $timeout: ng.ITimeoutService;
		private keySeparator = "@|";

		public static Factory(): angular.IDirectiveFactory {
			let directive = ($timeout: ng.ITimeoutService) => { return new LuidTableGrid($timeout); };
			directive.$inject = ["$timeout"];
			return directive;
		}

		constructor($timeout: ng.ITimeoutService) { this.$timeout = $timeout; };

		public link: ng.IDirectiveLinkFn = (scope: IDataGridScope, element: ng.IAugmentedJQuery, attrs: ILuidTableGridAttributes): void => {

			this.$timeout(() => {
				// ==========================================
				// ---- DOM Elements
				// ==========================================

				let tablegrid: any = angular.element(element[0].querySelector(".lui.tablegrid"))[0]; // the directive's template container node

				let tables: any = tablegrid.querySelectorAll("table"); 			// Both tables
				let headers: any = tablegrid.querySelectorAll("thead"); 		// Both tables headers
				let bodies: any = tablegrid.querySelectorAll("tbody"); 			// Both table bodies

				let lockedColumns: any = tablegrid.querySelector(".locked.columns");
				let lockedColumnsVS: any = (!!lockedColumns) ? lockedColumns.querySelector(".holder .virtualscroll") : undefined;
				let lockedColumnsSynced: any = lockedColumns ? lockedColumns.querySelector(".holder") : undefined;

				let scrollableArea: any = tablegrid.querySelector(".scrollable.columns"); // scrollable area
				let scrollableAreaVS: any = scrollableArea.querySelector(".virtualscroll");

				let MINROWSCOUNTFORVS = 200; //MAGIC NUMBER

				attrs.selectable = angular.isDefined(attrs.selectable);

				let getRootNodes = (dataTree: any): any[] => {
					let rootNodes = [];
					if (dataTree.children.length) {
						var self = this;
						_.each(dataTree.children, (child: any) => {
							rootNodes.push(child);
						});
					}
					return rootNodes;
				};

				// ==========================================
				// ---- Helpers (methods)
				// ==========================================
				// http://stackoverflow.com/questions/34426134/how-to-get-the-width-of-the-browsers-scrollbars-and-add-it-to-the-width-of-the-w
				let getScrollbarThickness = () => {
					let inner: any = document.createElement("p");
					inner.style.width = "100%";
					inner.style.height = "200px";

					let outer: any = document.createElement("div");
					outer.style.position = "absolute";
					outer.style.top = "0px";
					outer.style.left = "0px";
					outer.style.visibility = "hidden";
					outer.style.width = "200px";
					outer.style.height = "150px";
					outer.style.overflow = "hidden";
					outer.appendChild(inner);

					document.body.appendChild(outer);
					let w1: number = inner.offsetWidth;
					outer.style.overflow = "scroll";
					let w2: number = inner.offsetWidth;

					if (w1 === w2) {
						w2 = outer.clientWidth;
					}

					document.body.removeChild(outer);

					return (w1 - w2);
				};

				// ==========================================
				// ---- Other private variables
				// ==========================================
				let scrollbarThickness: number = getScrollbarThickness();
				let height: number = attrs.height ? parseFloat(attrs.height) : LuidTableGrid.defaultHeight;
				let headerHeightType = LuidTableGridHeightType.isTypeExisting(attrs.heightType) ? attrs.heightType : LuidTableGridHeightType.BODY;
				let ROWHEIGHTMIN = 32; // # MAGIC NUMBER
				let rowsPerPage = Math.round(height / ROWHEIGHTMIN);
				let numberOfRows = rowsPerPage * 3;
				let resizeTimer: any;
				let lastScrollTop = 0; //last scroll position, to determine the scroll direction
				scope.visibleRows = []; //current elements in DOM
				let currentMarginTop: number = 0;

				let headerHeight = Math.max(headers[0].offsetHeight, (!!headers[1] ? headers[1].offsetHeight : 0));

				let getLockedColumnsWidth = () => {
					if (!tables[1]) {
						return 0;
					}
					let w: number = 0;
					// @TODO: Should use the lockedCols variables rather than searching for them each time
					for (let col of headers[1].querySelectorAll("tr:first-child th.locked")) {
						w += col.offsetWidth;
					}
					return w + 1; // Adds 1 pixel for border
				};

				let updateHeight = () => {
					headerHeight = Math.max(headers[0].offsetHeight, (!!headers[1] ? headers[1].offsetHeight : 0));
					let scrollableAreaHeight = height;
					scrollableAreaHeight -= headerHeightType === LuidTableGridHeightType.GLOBAL ? headerHeight : 0;
					scrollableArea.style.maxHeight = scrollableAreaHeight + "px";
					tablegrid.style.paddingTop = headerHeight + "px";
					if (!!tables[1]) {
						tables[1].style.marginTop = (headerHeight + currentMarginTop) + "px";
					}
					if (canvasHeight < height) {
						scrollableAreaVS.style.height = tables[0].clientHeight + "px";
						if (!!lockedColumnsVS) {
							lockedColumnsVS.style.height = tables[0].clientHeight + "px";
						}
					}
				};

				let canvasHeight;
				let updateWidth = () => {
					let tablegridWidth: number = 0;
					tablegridWidth = (Math.max(scrollableArea.clientHeight, height) < Math.max(canvasHeight, scrollableAreaVS.clientHeight)) ? tablegrid.clientWidth - scrollbarThickness : tablegrid.clientWidth;

					// Vertical scrollbar
					for (let header of headers) {
						header.style.minWidth = tablegridWidth + "px";
					}
					for (let table of tables) {
						table.style.minWidth = headers[0].offsetWidth + "px";
					}

					let lockedColumnsWidth: any = getLockedColumnsWidth();
					if (lockedColumnsWidth) {
						//it's necessary to do this height compute in width method because of the dependance between twice.
						lockedColumnsSynced.style.maxHeight = (bodies[0].clientWidth > tablegridWidth) ? + height + headerHeight - scrollbarThickness + "px" : + height + headerHeight + "px";
						lockedColumns.style.width = lockedColumnsWidth + "px";
						scrollableArea.style.marginLeft = lockedColumnsWidth + "px";
						scrollableAreaVS.style.marginLeft = -lockedColumnsWidth + "px";
					}
				};

				// ==========================================
				// ---- Resize methods
				// ==========================================
				// Private
				let resize = () => {
					updateHeight();
					updateWidth();
				};

				let setCanvasHeight = (startNumRowIn: number) => {
					canvasHeight = (scope.filteredAndOrderedDatasTrees.length - startNumRowIn) * ROWHEIGHTMIN;
					if (canvasHeight > height) {
						scrollableAreaVS.style.height = canvasHeight + "px";
						if (!!lockedColumnsVS) {
							lockedColumnsVS.style.height = canvasHeight + "px";
						}
					} else {
						scrollableAreaVS.style.height = height + "px";
						if (!!lockedColumnsVS) {
							lockedColumnsVS.style.height = height + "px";
						}
					}
				};

				// ==========================================
				// ---- Virtual scroll
				// ---- from http://twofuckingdevelopers.com/2014/11/angularjs-virtual-list-directive-tutorial/
				// ==========================================

				let updateVisibleRows = () => {
					// Do not use virtual scroll if number of rows are less than
					if (scope.displayedRows.length <= MINROWSCOUNTFORVS) {
						scope.visibleRows = scope.displayedRows;
						setCanvasHeight(0);
						return;
					}
					let isScrollDown = lastScrollTop < scrollableArea.scrollTop;
					let isLastRowDrawn = _.last(scope.visibleRows) === _.last(scope.displayedRows);

					if (isScrollDown && isLastRowDrawn) {
						return;
					}

					let startNumRow = Math.floor(scrollableArea.scrollTop / ROWHEIGHTMIN);
					let cellsToCreate = Math.min(startNumRow + numberOfRows, numberOfRows);
					currentMarginTop = startNumRow * ROWHEIGHTMIN;
					scope.visibleRows = scope.displayedRows.slice(startNumRow, startNumRow + cellsToCreate);
					if (scope.existFixedRow || attrs.selectable) {
						tables[1].style.marginTop = (headerHeight + currentMarginTop) + "px";
					}
					tables[0].style.marginTop = currentMarginTop + "px";

					scrollableAreaVS.style.marginTop = currentMarginTop + "px";

					setCanvasHeight(startNumRow);
				};

				// ==========================================
				// ---- Group data to get a tree of datas
				// ==========================================

				let fillFilter = (index: number, columnHeader: TableGrid.Header, data: any) => {
					if (!scope.filters[index]) {
						scope.filters[index] = { header: columnHeader, selectValues: [], currentValues: [] };
					}
					if (columnHeader.filterType === FilterTypeEnum.SELECT
						|| columnHeader.filterType === FilterTypeEnum.MULTISELECT) {
						let value = columnHeader.getValue(data);
						if (!!columnHeader.getFilterValue) {
							value = columnHeader.getFilterValue(data);
						}

						let valuesToCheck = value.split("|");
						_.each(valuesToCheck, (val: string) => {
							if (!_.contains(scope.filters[index].selectValues, val)) {
								scope.filters[index].selectValues.push(val);
							}
						});
					}
				};

				//Group data into list of tree and fill filters
				let groupDatas = (orderedColDefinitions: TableGrid.HeaderTree[]): TableGrid.Tree[] => {
					let dataTrees: TableGrid.Tree[] = [];
					let groupingKeyMap: any = {};
					scope.filters = [];
					_.each(scope.datas, (data: any) => {
						let needGrouping: boolean = true;
						//Get only root column definitions
						//Children are ordered by position
						let currentDataTree;
						_.each(scope.header.children, (columnDefinition: TableGrid.HeaderTree, columnIndex: number) => {
							fillFilter(columnIndex, columnDefinition.node, data);
							needGrouping = needGrouping && !!columnDefinition.node.grouped;
							//Find the matching rowAsTree
							let newDataTree = new TableGrid.Tree(getNodeValue(columnDefinition, currentDataTree, data), currentDataTree);
							if (needGrouping) {
								let groupingKey = getNodeKey(columnDefinition.node.getValue(data).toString(), currentDataTree, newDataTree.node.dataColumns);
								newDataTree.node.key = groupingKey;
								if (_.has(groupingKeyMap, groupingKey)) {
									currentDataTree = groupingKeyMap[groupingKey];
									return;
								} else {
									groupingKeyMap[groupingKey] = newDataTree;
								}
							}
							if (!!currentDataTree) {
								currentDataTree.children.push(newDataTree);
								if (currentDataTree.children.length > 1) {
									incrementRowSpan(currentDataTree);
								}
								currentDataTree = newDataTree;
							} else {
								currentDataTree = newDataTree;
								dataTrees.push(currentDataTree);
							}
						});
					});
					return dataTrees;
				};

				let incrementRowSpan = (dataTree: TableGrid.Tree) => {
					_.each(dataTree.node.dataColumns, (dataColumn: TableGrid.DataColumn) => {
						dataColumn.rowspan += 1;
					});
					if (!!dataTree.parent) {
						incrementRowSpan(dataTree.parent);
					}
				};

				let getNodeKey = (nodeValue: string, parentTree: TableGrid.Tree, dataColumns: TableGrid.DataColumn[]) => {
					let nodeKey = "";
					if (dataColumns.length) {
						_.each(dataColumns, (dataColumn: TableGrid.DataColumn) => {
							nodeKey += dataColumn.value;
						});
					}
					return (!!parentTree ? parentTree.node.key + this.keySeparator : "") + nodeKey;
				};

				let getNodeValue = (columnDefinition: TableGrid.HeaderTree, parentTree: TableGrid.Tree, data: any): TableGrid.Node => {
					let nodeValue: TableGrid.Node = {
						key: undefined,
						rowSpan: 1,
						dataColumns: getDataColumns(columnDefinition, data)
					};
					if (!nodeValue.dataColumns.length) {
						nodeValue.dataColumns.push(new TableGrid.DataColumn(columnDefinition, data));
					}
					return nodeValue;
				};

				let getDataColumns = (columnDefinition: TableGrid.HeaderTree, data: any): TableGrid.DataColumn[] => {
					let dataColumns: TableGrid.DataColumn[] = [];
					_.each(columnDefinition.children, (columnChild: TableGrid.HeaderTree) => {
						if (columnChild.children.length) {
							dataColumns = dataColumns.concat(getDataColumns(columnChild, data));
						} else {
							dataColumns.push(new TableGrid.DataColumn(columnChild, data));
						}
					});
					return dataColumns;
				};

				let getTableRowsFromTrees = (rowsTrees: any[]): TableGrid.DataColumn[][] => {
					let tableRows: TableGrid.DataColumn[][] = [];
					_.each(rowsTrees, (rowsTree: any) => {
						tableRows = tableRows.concat(getTableRowsFromTree(rowsTree));
					});
					return tableRows;
				};

				let getTableRowsFromTree = (rowsTree: TableGrid.Tree, currentRow: TableGrid.DataColumn[] = []): TableGrid.DataColumn[][] => {
					let tableRows: TableGrid.DataColumn[][] = [];
					currentRow = currentRow.concat(rowsTree.node.dataColumns);
					_.each(rowsTree.children, (child) => {
						tableRows = tableRows.concat(getTableRowsFromTree(child, currentRow));
						currentRow = [];
					});
					if (currentRow.length) {
						tableRows.push(currentRow);
					}
					return tableRows;
				};

				scope.updateViewAfterOrderBy = () => {
					scope.displayedRows = getTableRowsFromTrees(scope.filteredAndOrderedDatasTrees);
					updateVisibleRows();
					this.$timeout(() => {
						updateHeight();
					}, 0);
				};

				scope.updateViewAfterFiltering = () => {
					scrollableArea.scrollTop = 0;
					tables[0].style.marginTop = "0px";
					scrollableAreaVS.style.marginTop = "0px";
					if (scope.existFixedRow || attrs.selectable) {
						lockedColumnsSynced.scrollTop = 0;
						tables[1].style.marginTop = "0px";
					}
					scope.displayedRows = getTableRowsFromTrees(scope.filteredAndOrderedDatasTrees);
					updateVisibleRows();
					this.$timeout(() => {
						resize();
					}, 0);
				};

				// ==========================================
				// ---- Watchers
				// ==========================================
				// Watches collection changes
				scope.$watchCollection("datas", () => {
					if (!!scope.datas) {
						scope.datasTrees = groupDatas(scope.header.children);
						scope.filteredAndOrderedDatasTrees = scope.datasTrees;
						scope.orderBySelectedHeader();
						scope.updateViewAfterFiltering();

					}
				});
				// Watches for window resizes
				window.addEventListener("resize", (): void => {
					this.$timeout.cancel(resizeTimer);
					resizeTimer = this.$timeout(() => { resize(); }, 100);
				});

				// Watches for scrolling on the scrollable area of the tablegrid
				scrollableArea.addEventListener("scroll", (event: Event) => {
					if (scope.existFixedRow || attrs.selectable) {
						lockedColumnsSynced.scrollTop = scrollableArea.scrollTop;
					}
					headers[0].style.left = -scrollableArea.scrollLeft + "px";
					if (scope.visibleRows.length !== scope.displayedRows.length) {
						updateVisibleRows();
						scope.$digest();
					}
					lastScrollTop = scrollableArea.scrollTop;
				});
			}, 0);
		};
	}

	angular.module("lui.directives")
		.directive(LuidTableGrid.IID, LuidTableGrid.Factory());

}
