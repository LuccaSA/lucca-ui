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

			// DOM elements
			let tablegrid: any = angular.element(element[0].querySelector(".lui.tablegrid"))[0]; // the directive's template container node

			let header: any = tablegrid.querySelector(".header"); // The table header
			let lockedTable: any = tablegrid.querySelector(".body .locked.columns table"); // left table of the rows
			let lockedCols: any = lockedTable.querySelectorAll("tr:first-child td.locked");
			let lockedBody: any = tablegrid.querySelector(".body .locked.columns"); // scrollable area

			let scrollableArea: any = tablegrid.querySelector(".body .scrollable"); // scrollable area
			let scrollableTable: any = tablegrid.querySelector(".body .scrollable.columns table"); // right part of the rows
			let syncedHeader: any = tablegrid.querySelector(".header .scrollable.columns"); // scrollable area


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

			// private variables
			let scrollbarThickness: number = getScrollbarThickness();
			let height = attrs.height ? attrs.height : LuidTableGrid.defaultHeight;
			let contentHeight = height;
			let rowHeight = 33; // # MAGIC NUMBER
			let cellsPerPage = Math.round(contentHeight / rowHeight); //number of cells fitting in one page
			let numberOfCells = cellsPerPage * 3;


			let scrollTop = 0; //current scroll position
			scope.visibleRows = []; //current elements in DOM
			scope.canvasHeight = 0; //The total height of the canvas. It is calculated by multiplying the total records by rowHeight.

			let getLockedColumnsWidth = () => {
				let w: number = 0;
				// @TODO: Should use the lockedCols variables rather than searching for them each time
				for (let col of lockedTable.querySelectorAll("tr:first-child td.locked")) {
					w += col.offsetWidth;
				}
				return w + 1; // Adds 1 pixel for border
			};

			let resize = () => {

				// Locked coluns width calculus
				// ====
				scope.lockedWidth = getLockedColumnsWidth();

				// Margin offset in case of vertical scrollbar
				// ====
				if (scrollableArea.clientHeight < scope.canvasHeight) {
					header.style.marginRight = scrollbarThickness + "px";
					lockedBody.style.marginRight = scrollbarThickness + "px";
				} else {
					header.style.marginRight = "0px";
					lockedBody.style.marginRight = "0px";
				}

				// Margin offset in case of horizontal scrollbar
				// ====
				if (scrollableArea.clientWidth + scope.lockedWidth < scrollableTable.clientWidth) {
					lockedBody.style.marginBottom = scrollbarThickness + "px";
				} else {
					lockedBody.style.marginBottom = "0px";
				}

				scope.$apply();
			};

			let vsOnScroll = (event: Event) => {
				scrollTop = scrollableArea.scrollTop;
				scope.updateVirtualScroll();
				scope.$apply();
			};

			scope.updateVirtualScroll = function(): void {

				scope.canvasHeight = scope.filteredAndOrderedRows.length * rowHeight;

				let firstCell = Math.max(Math.floor(scrollTop / rowHeight) - cellsPerPage, 0);
				let cellsToCreate = Math.min(firstCell + numberOfCells, numberOfCells);
				scope.visibleRows = scope.filteredAndOrderedRows.slice(firstCell, firstCell + cellsToCreate);

				lockedTable.style.top = firstCell * rowHeight + "px";
				scrollableTable.style.top = firstCell * rowHeight + "px";
			};

			scope.refresh = () => {
				scope.updateFilteredAndOrderedRows();
			};

			scope.$watchCollection("datas", () => {
				scope.filteredAndOrderedRows = scope.datas;
				scope.updateVirtualScroll();

				angular.element(document).ready(() => {
					scope.refresh();
				});
			});


			let init = () => {
				scope.filteredAndOrderedRows = scope.datas;

				cellsPerPage = Math.round(contentHeight / rowHeight);
				numberOfCells = cellsPerPage * 3;
				scope.updateVirtualScroll();

				this.$timeout(() => {
					resize();
				}, 100);
			};

			window.addEventListener("resize", (): void => {
				// This should be debounced
				// @TODO
				resize();
			});

			scrollableArea.addEventListener("scroll", (event: Event) => {
				syncedHeader.scrollLeft = scrollableArea.scrollLeft;
				lockedBody.scrollTop = scrollableArea.scrollTop;
				vsOnScroll(event);
			});

			init();
		};
	}

	angular.module("lui.directives")
		.directive(LuidTableGrid.IID, LuidTableGrid.Factory());

}
