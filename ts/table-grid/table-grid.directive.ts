/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export interface ILuidTableGridAttributes extends ng.IAttributes {
		height: number;
	}

	export class LuidTableGrid implements angular.IDirective {

		public static defaultHeight = 20;
		public static IID = "luidTableGrid";
		public controller = "luidTableGridController";
		public restrict = "AE";
		public scope = { header: "=", height: "@", datas: "=" };
		public templateUrl = "lui/templates/table-grid/table-grid.html";
		private $timeout: ng.ITimeoutService;

		public static Factory(): angular.IDirectiveFactory {
			let directive = ($timeout: ng.ITimeoutService) => { return new LuidTableGrid($timeout); };
			directive.$inject = ["$timeout"];
			return directive;
		}

		constructor($timeout: ng.ITimeoutService) { this.$timeout = $timeout; };

		public link: ng.IDirectiveLinkFn = (scope: IDataGridScope, element: ng.IAugmentedJQuery, attrs: ILuidTableGridAttributes): void => {

			//virtual scroll from http://twofuckingdevelopers.com/2014/11/angularjs-virtual-list-directive-tutorial/

				this.$timeout(() => {

					// dom elements
					let datagrid: any = document.querySelector(".lui.tablegrid"); // the directive
					let datagridContent = datagrid.querySelector(".content"); // the rows
					let datagridHeader = datagrid.querySelector(".header"); // the header
					let lockedContent: any = datagrid.querySelector(".content .locked.columns"); // left part of the rows
					let lockedCanvas: any = lockedContent.querySelector(".canvas"); // left virtual container
					let lockedHeader: any = datagrid.querySelector(".header .locked.columns"); // left part of the header
					let lockedTable: any = lockedContent.querySelector("table"); // left table of the rows
					let scrollableContent: any = datagrid.querySelector(".scrollable"); // right part of the rows
					let scrollableHeader: any = datagridHeader.querySelector(".columns:not(.locked)"); // right part of header
					let scrollableTable: any = scrollableContent.querySelector("table"); // right part of the rows

					// private variables
					let cellsPerPage = 0; //number of cells fitting in one page
					let height = attrs.height ? attrs.height : LuidTableGrid.defaultHeight;
					let numberOfCells = 0; //Number of virtualized cells (basicaly 10 + cellPerPage + 10 except if you're at top or bottom)
					let rowHeight = 31;

					let scrollbarThickness = scrollableContent.offsetWidth - scrollableContent.clientWidth;
					scrollbarThickness = scrollbarThickness ? scrollbarThickness : 20;
					let contentHeight = height - scrollbarThickness;

					let scrollTop = 0; //current scroll position
					scope.visibleRows = []; //current elements in DOM
					scope.canvasHeight = {}; //The total height of the canvas. It is calculated by multiplying the total records by rowHeight.

					// private methods
					let resizeHeight = () => {
						datagridContent.style.maxHeight  = height + "px";
						lockedContent.style.maxHeight  = height - scrollbarThickness + "px";
						scrollableContent.style.maxHeight  = height + "px";
					};

					let resizeWidth = () => {
						scrollableContent.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth + "px";
						scrollableHeader.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth - scrollbarThickness + "px";
					};

					let vsOnScroll = (event: Event) => {
						scrollTop = scrollableContent.scrollTop;
						scope.updateVirtualScroll();
						scope.$apply();
					};

					let wheelHorizontaly = (length: number) => {
						scrollableHeader.scrollLeft += length;
						scrollableContent.scrollLeft += length;
					};

					let wheelVerticaly = (length: number) => {
						lockedContent.scrollTop += length;
						scrollableContent.scrollTop += length;
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

					scope.updateVirtualScroll = function(): void {

						scope.canvasHeight = {
							height: scope.filteredAndOrderedRows.length * rowHeight + "px",
						};

						let firstCell = Math.max(Math.floor(scrollTop / rowHeight) - cellsPerPage, 0);
						let cellsToCreate = Math.min(firstCell + numberOfCells, numberOfCells);
						scope.visibleRows = scope.filteredAndOrderedRows.slice(firstCell, firstCell + cellsToCreate);

						lockedTable.style.top = firstCell * rowHeight + "px";
						scrollableTable.style.top = firstCell * rowHeight + "px";
					};

					let init = () => {

						scope.filteredAndOrderedRows = scope.datas;
						lockedCanvas.style.width = _.reduce(scope.fixedRowDefinition, (memo: number, num: TableGrid.Header) => { return memo + num.width; }, 0) + "em";

						resizeHeight();
						resizeWidth();
						resizeWidth();

						cellsPerPage = Math.round(contentHeight / rowHeight);
						numberOfCells = cellsPerPage * 3;
						scope.updateVirtualScroll();
					};

					datagridHeader.addEventListener("wheel", (event: Event): void => {
						wheel(event);
					});

					lockedContent.addEventListener("wheel", (event: Event): void => {
						wheel(event);
						vsOnScroll(event);
					});

					scrollableContent.addEventListener("scroll", (event: Event) => {
						scrollableHeader.scrollLeft = scrollableContent.scrollLeft;
						lockedContent.scrollTop = scrollableContent.scrollTop;
						vsOnScroll(event);
					});

					window.addEventListener("resize", (): void => {
						resizeWidth();
					});

					init();
				}, 500);
			};
	}

	angular.module("lui.directives")
		.directive(LuidTableGrid.IID, LuidTableGrid.Factory());

}
