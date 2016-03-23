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

			let getLockedColumnsWidth = () => {
				let w: number = 0;
				// @TODO: Should use the lockedCols variables rather than searching for them each time
				for (let col of tables[1].querySelectorAll("tr:first-child td.locked")) {
					w += col.offsetWidth;
				}
				return w + 1; // Adds 1 pixel for border
			};


			// ==========================================
			// ---- DOM Elements
			// ==========================================
			let tablegrid: any = angular.element(element[0].querySelector(".lui.tablegrid"))[0]; // the directive's template container node

			let tables: any = tablegrid.querySelectorAll("table"); 			// Both tables
			let headers: any = tablegrid.querySelectorAll("thead"); 		// Both tables headers
			let bodies: any = tablegrid.querySelectorAll("tbody"); 			// Both table bodies

			let lockedColumns: any = tablegrid.querySelector(".locked.columns");
			let lockedColumnsSynced: any = lockedColumns.querySelector(".holder");

			let scrollableArea: any = tablegrid.querySelector(".scrollable.columns"); // scrollable area
			let scrollableAreaVS: any = scrollableArea.querySelector(".virtualscroll");

			// Other private variables
			let scrollbarThickness: number = getScrollbarThickness();
			let height = attrs.height ? attrs.height : LuidTableGrid.defaultHeight;
			let rowHeight = 33; // # MAGIC NUMBER
			let cellsPerPage = Math.round(height / rowHeight); //number of cells fitting in one page
			let numberOfCells = cellsPerPage * 3;
			let resizeTimer: any;
			let scrollTop = 0; //current scroll position
			scope.visibleRows = []; //current elements in DOM
			scope.canvasHeight = 0; //The total height of the canvas. It is calculated by multiplying the total records by rowHeight.


			// ==========================================
			// ---- Resize methods
			// ==========================================
			// Public
			scope.resizedHeaders = () => {
				tablegrid.style.paddingTop = headers[0].offsetHeight + "px";
			}
			// Private
			let resize = () => {
				console.log("resize");
				let tablegridWidth: number = 0;
				tablegridWidth = (scrollableArea.clientHeight < scope.canvasHeight) ? tablegrid.clientWidth - scrollbarThickness : tablegrid.clientWidth;

				// Vertical scrollbar
				for (let header of headers) {
					header.style.minWidth = tablegridWidth + "px";
				}
				for (let table of tables) {
					table.style.minWidth = headers[0].offsetWidth + "px";
				}

				// Horizontal scrollbar
				lockedColumnsSynced.style.height = (bodies[0].clientWidth > tablegridWidth) ? +height + headers[0].offsetHeight - scrollbarThickness + "px" : +height + headers[0].offsetHeight + "px";

				let lockedColumnsWidth: any = getLockedColumnsWidth();
				lockedColumns.style.width = lockedColumnsWidth + "px";
				scrollableArea.style.marginLeft = lockedColumnsWidth + "px";
				scrollableAreaVS.style.marginLeft = -lockedColumnsWidth + "px";

				scope.resizedHeaders();
			};

			// ==========================================
			// ---- Virtual scroll
			// ---- from http://twofuckingdevelopers.com/2014/11/angularjs-virtual-list-directive-tutorial/
			// ==========================================
			// Private event handler
			let vsOnScroll = (event: Event) => {
				scrollTop = scrollableArea.scrollTop;
				scope.updateVirtualScroll();
				scope.$apply();
			};
			// Public method
			scope.updateVirtualScroll = () => {
				console.log("update vs");

				let firstCell = Math.max(Math.floor(scrollTop / rowHeight) - cellsPerPage, 0);
				let cellsToCreate = Math.min(firstCell + numberOfCells, numberOfCells);
				scope.visibleRows = scope.filteredAndOrderedRows.slice(firstCell, firstCell + cellsToCreate);

				tables[0].style.marginTop = (headers[0].offsetHeight + firstCell * rowHeight) + "px";
				tables[1].style.marginTop = (firstCell * rowHeight) + "px";

				scope.canvasHeight = (scope.filteredAndOrderedRows.length - firstCell) * rowHeight;
			};

			// ==========================================
			// ---- Watchers
			// ==========================================
			// Watches collection changes
			scope.$watchCollection("datas", () => {
				if (!!scope.datas) {
					scope.filteredAndOrderedRows = scope.datas;
					this.$timeout(() => {
						// scope.updateVirtualScroll();
						scope.updateFilteredAndOrderedRows();
						resize();
					}, 100);
				}
			});
			// Watches for window resizes
			window.addEventListener("resize", (): void => {
				this.$timeout.cancel(resizeTimer);
				resizeTimer = this.$timeout(() => { resize(); }, 100);
			});
			// Watches for scrolling on the scrollable area of the tablegrid
			scrollableArea.addEventListener("scroll", (event: Event) => {
				// syncedHeader.scrollLeft = scrollableArea.scrollLeft;
				lockedColumnsSynced.scrollTop = scrollableArea.scrollTop;
				headers[1].style.left = -scrollableArea.scrollLeft + "px";
				vsOnScroll(event);
			});


			// ==========================================
			// ---- Initialisation
			// ==========================================
			let init = () => {
				scope.filteredAndOrderedRows = scope.datas;

				cellsPerPage = Math.round(height / rowHeight);
				numberOfCells = cellsPerPage * 3;

				this.$timeout(() => { resize(); scope.updateVirtualScroll(); }, 100);
			};

			init();
		};
	}

	angular.module("lui.directives")
		.directive(LuidTableGrid.IID, LuidTableGrid.Factory());

}
