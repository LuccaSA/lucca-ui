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
			let datagrid: any = angular.element(element[0].querySelector(".lui.tablegrid"))[0]; // the directive's template container node
			let header: any = datagrid.querySelector(".header");
			let lockedTable: any = datagrid.querySelector(".body .locked.columns table"); // left table of the rows
			let scrollableArea: any = datagrid.querySelector(".body .scrollable"); // scrollable area
			let syncedBody: any = datagrid.querySelector(".body .locked.columns"); // scrollable area
			let syncedHeader: any = datagrid.querySelector(".header .scrollable.columns"); // scrollable area
			let scrollableTable: any = datagrid.querySelector(".body .scrollable.columns table"); // right part of the rows

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
			scope.canvasHeight = {}; //The total height of the canvas. It is calculated by multiplying the total records by rowHeight.

			let resize = () => {
				if (scrollableArea.clientHeight < parseFloat(scope.canvasHeight.height)) {
					header.style.marginRight = scrollbarThickness + "px";
				} else {
					header.style.marginRight = "0px";
				}

				if (scrollableArea.clientWidth < scrollableTable.offsetWidth) {
					syncedBody.style.marginBottom = scrollbarThickness + "px";
				} else {
					syncedBody.style.marginBottom = "0px";
				}
			};

			let vsOnScroll = (event: Event) => {
				scrollTop = scrollableArea.scrollTop;
				scope.updateVirtualScroll();
				scope.$apply();
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
				syncedBody.scrollTop = scrollableArea.scrollTop;
				vsOnScroll(event);
			});

			init();
		};
	}

	angular.module("lui.directives")
		.directive(LuidTableGrid.IID, LuidTableGrid.Factory());

}
