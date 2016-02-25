/// <reference path="../references.ts" />

module Lui.Directives.TableGrid {
	"use strict";

	export class Tree {
		public node: Header;
		public children: Tree[];
	}

	export class Header {
		public label: string;
		public filterable: boolean;
		public hidden: boolean;
		public width: number;
		public fixed: boolean;
		public colspan: number;
		public rowspan: number;
		public textAlign: string;
		public getValue: (object: any) => string;
		public getOrderByValue: (object: any) => any;
	}

	export class BrowseResult {
		public depth: number;
		public subChildren: number;
		public subDepth: number;
		public tree: Tree;
	}
}
module Lui.Directives {

	"use strict";

	export interface ILuidTableGridAttributes extends ng.IAttributes {
		height: number;
	}
	let defaultHeight = 20;

	export class LuidTableGrid implements angular.IDirective {
		public static IID = "luidTableGrid";
		public controller = "luidTableGridController";
		public scope = { header: "=", height: "@", datas: "=" };
		public restrict = "AE";
		public templateUrl = "lui/templates/table-grid/table-grid.html";
		public link: ng.IDirectiveLinkFn = (scope: IDataGridScope, element: ng.IAugmentedJQuery, attrs: ILuidTableGridAttributes): void => {

			//virtual scroll from http://twofuckingdevelopers.com/2014/11/angularjs-virtual-list-directive-tutorial/

				this.$timeout(() => {

					// dom elements
					let datagrid: any = document.querySelector(".lui.tablegrid");

					let datagridHeader = datagrid.querySelector(".header");
					let scrollableHeader: any = datagridHeader.querySelector(".columns:not(.locked)");

					let datagridContent = datagrid.querySelector(".content");
					let lockedHeader: any = datagrid.querySelector(".header .locked.columns");
					let lockedContent: any = datagrid.querySelector(".content .locked.columns");
					let lockedTable: any = lockedContent.querySelector("table");
					let scrollableContent: any = datagrid.querySelector(".scrollable");
					let scrollableTable: any = scrollableContent.querySelector("table");

					// global variables

					let scrollTop = 0; //current scroll position
					scope.visibleRows = []; //current elements in DOM
					let cellsPerPage = 0; //number of cells fitting in one page
					let numberOfCells = 0; //Number of virtualized cells (basicaly 10 + cellPerPage + 10 except if you're at top or bottom)
					scope.canvasHeight = {}; //The total height of the canvas. It is calculated by multiplying the total records by rowHeight.

					let height = attrs.height ? attrs.height : defaultHeight;
					let rowHeight = 31;
					let scrollbarThickness = scrollableContent.offsetWidth - scrollableContent.clientWidth;
					scrollbarThickness = scrollbarThickness ? scrollbarThickness : 20;
					let contentHeight = height - scrollbarThickness;

					let resizeWidth = () => {
						scrollableContent.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth + "px";
						scrollableHeader.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth - scrollbarThickness + "px";
					};

					let resizeHeight = () => {
						datagridContent.style.maxHeight  = height + "px";
						lockedContent.style.maxHeight  = height - scrollbarThickness + "px";
						scrollableContent.style.maxHeight  = height + "px";
					};

					let wheelVerticaly = (length: number) => {
						lockedContent.scrollTop += length;
						scrollableContent.scrollTop += length;
					};

					let wheelHorizontaly = (length: number) => {
						scrollableHeader.scrollLeft += length;
						scrollableContent.scrollLeft += length;
					};

					let wheel = (event: any) => {
						switch (event.deltaMode) {
							case 0:
								wheelHorizontaly(event.deltaX);
								wheelVerticaly(event.deltaY);
								break;
							case 1:
								let fontSize = parseFloat(window.getComputedStyle(datagrid, null).fontSize);
								wheelHorizontaly(event.deltaX * fontSize);
								wheelVerticaly(event.deltaY * fontSize);
								break;
							default:
								break;
						}
					};

					let updateVirtualScroll = function(): void {
						let firstCell = Math.max(Math.floor(scrollTop / rowHeight) - cellsPerPage, 0);
						let cellsToCreate = Math.min(firstCell + numberOfCells, numberOfCells);
						scope.visibleRows = scope.datas.slice(firstCell, firstCell + cellsToCreate);

						lockedTable.style.top = firstCell * rowHeight + "px";
						scrollableTable.style.top = firstCell * rowHeight + "px";
						// for (let i = 0; i < scope.visibleRows.length; i++) {
						// 	scope.visibleRows[i].styles = {
						// 		"top": ((firstCell + i) * rowHeight) + "px",
						// 		"height": rowHeight + "px"
						// 	};
						// }
					};

					let vsOnScroll = (event: Event) => {
						scrollTop = scrollableContent.scrollTop;
						updateVirtualScroll();
						scope.$apply();
					};

					window.addEventListener("resize", (): void => {
						resizeWidth();
					});

					lockedContent.addEventListener("wheel", (event: Event): void => {
						wheel(event);
						vsOnScroll(event);
					});

					datagridHeader.addEventListener("wheel", (event: Event): void => {
						wheel(event);
					});

					scrollableContent.addEventListener("scroll", (event: Event) => {
						scrollableHeader.scrollLeft = scrollableContent.scrollLeft;
						lockedContent.scrollTop = scrollableContent.scrollTop;
						vsOnScroll(event);
					});

					let init = () => {
						resizeHeight();
						resizeWidth();
						resizeWidth();

						cellsPerPage = Math.round(contentHeight / rowHeight);
						numberOfCells = cellsPerPage + 10;
						scope.canvasHeight = {
							height: scope.datas.length * rowHeight + "px",
						};

						updateVirtualScroll();
					};

					init();
				}, 500);
			};

		constructor(private $timeout: ng.ITimeoutService) { return; };

		public static Factory(): angular.IDirectiveFactory {
			let directive = ($timeout: ng.ITimeoutService) => { return new LuidTableGrid($timeout); };
			directive.$inject = ["$timeout"];
			return directive;
		}
	}

	export interface IDataGridScope extends angular.IScope {
		datas: any[];
		visibleRows: any[];
		canvasHeight: any;
		leftFilters: {header: TableGrid.Header, value: string}[];
		rightFilters: {header: TableGrid.Header, value: string}[];
		fixedHeaderRows: TableGrid.Header[][];
		fixedRowDefinition: TableGrid.Header[];
		scrollableHeaderRows: TableGrid.Header[][];
		scrollableRowDefinition: TableGrid.Header[];
		selected: { orderBy: TableGrid.Header, reverse: boolean };
		header: TableGrid.Tree;

		customFilterBy(row: any): boolean;
		customOrderBy(row: any): string;
		updateFilterBy(header: TableGrid.Header, index: number): void;
		updateOrderBy(header: TableGrid.Header): void;
	}

	export class LuidTableGridController {
		public static IID: string = "luidTableGridController";
		public static $inject: Array<string> = ["$filter", "$scope", "$translate"];
		private $filter: Lui.ILuiFilters;
		private $scope: IDataGridScope;
		private $translate: angular.translate.ITranslateService;

		constructor($filter: Lui.ILuiFilters, $scope: IDataGridScope, $translate: angular.translate.ITranslateService) {
			this.$filter = $filter;
			this.$scope = $scope;
			this.$translate = $translate;

			let maxDepth = 0;
			let getTreeDepth = (tree: TableGrid.Tree): number => {
				let depth = 0;
				tree.children.forEach((child: TableGrid.Tree) => {
					depth = Math.max(depth, getTreeDepth(child));
				});
				return depth + 1;
			};

			let browse = (result: TableGrid.BrowseResult): TableGrid.BrowseResult => {

				if (!result.tree.children.length) { result.subChildren++; };

				result.tree.children.forEach((child: TableGrid.Tree) => {
					let subResult = browse({ depth: result.depth + 1, tree: child, subChildren: 0, subDepth: 0 });
					result.subChildren += subResult.subChildren;
					result.subDepth = Math.max(result.subDepth, subResult.subDepth);
				});

				if (result.tree.children.length) {
					result.subDepth++;
				} else {
					if (result.tree.node.fixed) {
						$scope.fixedRowDefinition.push(result.tree.node);
					} else {
						$scope.scrollableRowDefinition.push(result.tree.node);
					}
				}

				if (result.tree.node) {
					result.tree.node.rowspan = maxDepth - result.depth - result.subDepth;
					result.tree.node.colspan = result.subChildren;
					if (!result.tree.children.length && !result.tree.node.filterable) {
						result.tree.node.rowspan++;
					}

					if (result.tree.node.fixed) {
						$scope.fixedHeaderRows[result.depth] ? $scope.fixedHeaderRows[result.depth].push(result.tree.node) : $scope.fixedHeaderRows[result.depth] = [result.tree.node];
					} else {
						$scope.scrollableHeaderRows[result.depth] ? $scope.scrollableHeaderRows[result.depth].push(result.tree.node) : $scope.scrollableHeaderRows[result.depth] = [result.tree.node];
					}
				}
				return result;
			};

			let init = () => {

				$scope.fixedHeaderRows = [];
				$scope.fixedRowDefinition = [];
				$scope.scrollableHeaderRows = [];
				$scope.scrollableRowDefinition = [];

				maxDepth = getTreeDepth($scope.header);

				browse({ depth: 0, subChildren: 0, subDepth: 0, tree: $scope.header });

				let diff = $scope.fixedHeaderRows.length - $scope.scrollableHeaderRows.length;
				if (diff > 0) {
					// fixed Header is bigger than scrollable header
					for (let i = 1; i <= diff; i++) {
						$scope.scrollableHeaderRows.push([]);
					}
				} else if (diff < 0) {
					// scrollable Header is bigger than fixed header
					for (let i = 1; i <= -diff; i++) {
						$scope.fixedHeaderRows.push([]);
					}
				}

				$scope.selected = { orderBy: null, reverse: false };

				$scope.leftFilters = [];
				$scope.rightFilters = [];
			};

			$scope.updateOrderBy = (header: TableGrid.Header) => {
				if (header.getOrderByValue != null) {
					if (header === $scope.selected.orderBy) {
						if ($scope.selected.reverse) {
							$scope.selected.orderBy = null;
							$scope.selected.reverse = false;
						} else {
							$scope.selected.reverse = true;
						}
					} else {
						$scope.selected.orderBy = header;
						$scope.selected.reverse = false;
					}
				}
			};

			$scope.customOrderBy = (row: any) => {
				if ($scope.selected && $scope.selected.orderBy) {
					return $scope.selected.orderBy.getOrderByValue(row);
				} else {
					return $scope.datas.indexOf(row).toString();
				}
			};

			$scope.updateFilterBy = (header: TableGrid.Header, index: number) => {
				let value = header.fixed ? $scope.leftFilters[index].value : $scope.rightFilters[index].value;
				if (!header) { return; }
				if (!header.filterable) { return; }
				if (value === null || value === "") {
						header.fixed ? $scope.leftFilters[index] = {header: null, value: ""} : $scope.rightFilters[index] = {header: null, value: ""};
				}
				header.fixed ? $scope.leftFilters[index] = { header: header, value: value } : $scope.rightFilters[index] = { header: header, value: value };
			};

			$scope.customFilterBy = (row: any) => {
				let result = true;
				let filters = $scope.leftFilters.concat($scope.rightFilters);
				filters.forEach((filter: { header: TableGrid.Header, value: string }) => {
					if (filter.header && filter.value && filter.value !== "") {
						let prop = (filter.header.getValue(row) + "").toLowerCase();
						if (prop.indexOf(filter.value.toLowerCase()) === -1) {
							result = false;
						}
					}
				});
				return result;
			};

			init();
		}
	}

	angular.module("lui.directives")
	.controller(LuidTableGridController.IID, LuidTableGridController)
	.directive(LuidTableGrid.IID, LuidTableGrid.Factory());
}
