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
		public scope = { header: "=", height: "@", datas: "=*", selectable: "@" };
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
					let lockedMiddle: any = lockedHeader.querySelector(".middle");
					let lockedTable: any = lockedContent.querySelector("table"); // left table of the rows
					let scrollableContent: any = datagrid.querySelector(".scrollable"); // right part of the rows
					let scrollableHeader: any = datagridHeader.querySelector(".columns:not(.locked)"); // right part of header
					let scrollableTable: any = scrollableContent.querySelector("table"); // right part of the rows

					let lockedWidth = _.reduce(scope.fixedRowDefinition, (memo: number, num: TableGrid.Header) => { return memo + num.width; }, scope.selectable ? 3 : 0) + "em";
					lockedCanvas.style.width = lockedWidth;
					lockedMiddle.style.width = lockedWidth;

					// private variables
					let height = attrs.height ? attrs.height : LuidTableGrid.defaultHeight;
					let defaultScrollbarThickness = 17;
					let verticalScrollbarThickness = scrollableContent.offsetWidth - scrollableContent.clientWidth;
					let horizontalScrollbarThickness = scrollableContent.offsetHeight - scrollableContent.clientHeight;
					let contentHeight = height - horizontalScrollbarThickness;

					let rowHeight = 33; // # MAGIC NUMBER
					let cellsPerPage = Math.round(contentHeight / rowHeight); //number of cells fitting in one page
					let numberOfCells = cellsPerPage * 3;

					let scrollTop = 0; //current scroll position
					scope.visibleRows = []; //current elements in DOM
					scope.canvasHeight = {}; //The total height of the canvas. It is calculated by multiplying the total records by rowHeight.

					// private methods
					let resizeHeight = () => {
						horizontalScrollbarThickness = scrollableContent.offsetHeight - scrollableContent.clientHeight;
						datagridContent.style.maxHeight  = height + "px";
						lockedContent.style.maxHeight  = height - horizontalScrollbarThickness + "px";
						scrollableContent.style.maxHeight  = height + "px";

						//let lockedHeaderMaxHeight = _.max(lockedHeader.getElementsByTagName("td"), (element: HTMLElement) => {return element.offsetHeight}).offsetHeight;
						//let lockedContentMaxHeight = _.max(lockedTable.getElementsByTagName("td"), (element: HTMLElement) => {return element.offsetHeight}).offsetHeight;
						//let scrollableHeaderMaxHeight = _.max(scrollableHeader.getElementsByTagName("td"), (element: HTMLElement) => {return element.offsetHeight}).offsetHeight;
						//let scrollableContentMaxHeight = _.max(scrollableTable.getElementsByTagName("td"), (element: HTMLElement) => {return element.offsetHeight}).offsetHeight;
						//
						//console.log(lockedHeaderMaxHeight + " - " + lockedContentMaxHeight + " - " + scrollableHeaderMaxHeight + " - " + scrollableContentMaxHeight);
					};

					let resizeWidth = () => {
						verticalScrollbarThickness = scrollableContent.offsetWidth - scrollableContent.clientWidth;
						if (verticalScrollbarThickness) {
							scrollableContent.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth - verticalScrollbarThickness + "px";
							scrollableHeader.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth -  2 * verticalScrollbarThickness + "px";
						}else {
							scrollableContent.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth - 2 * defaultScrollbarThickness + "px";
							scrollableHeader.style.width = datagrid.offsetWidth - lockedHeader.offsetWidth -  2 * defaultScrollbarThickness + "px";
						}
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

					scope.refresh = () => {
						scope.updateFilteredAndOrderedRows();
						scope.updateVirtualScroll();

						resizeHeight();
						angular.element(document).ready(() => {
							resizeWidth();
							angular.element(document).ready(() => {
								resizeHeight();
							});
						});
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

					scope.$watchCollection("datas", () => {
						scope.filteredAndOrderedRows = scope.datas;
						scope.updateVirtualScroll();

						angular.element(document).ready(() => {
							scope.refresh();
						});
					});

				}, 0);
			};
	}

	angular.module("lui.directives")
		.directive(LuidTableGrid.IID, LuidTableGrid.Factory());

}
