/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export class LuidTableGridController {
		public static IID: string = "luidTableGridController";
		public static $inject: Array<string> = ["$filter", "$scope", "$translate"];

		constructor($filter: Lui.ILuiFilters, $scope: IDataGridScope, $translate: angular.translate.ITranslateService) {

			// private members
			let maxDepth = 0;

			// private methods
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

			let getTreeDepth = (tree: TableGrid.Tree): number => {
				let depth = 0;
				tree.children.forEach((child: TableGrid.Tree) => {
					depth = Math.max(depth, getTreeDepth(child));
				});
				return depth + 1;
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
					for (let i = 1; i <= diff; i++) {
						$scope.scrollableHeaderRows.push([]);
					}
				} else if (diff < 0) {
					for (let i = 1; i <= -diff; i++) {
						$scope.fixedHeaderRows.push([]);
					}
				}

				$scope.selected = { orderBy: null, reverse: false };

				$scope.leftFilters = [];
				$scope.rightFilters = [];
			};

			let updateFilteredAndOrderedRows = () => {
				let filteredAndOrderedRows = _.chain($scope.datas)
					.filter((row: any) => {
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
					})
					.sortBy((row: any) => {
						if ($scope.selected && $scope.selected.orderBy) {
							return $scope.selected.orderBy.getOrderByValue(row);
						} else {
							return $scope.datas.indexOf(row);
						}
					}).value();
				$scope.filteredAndOrderedRows = $scope.selected.reverse ? filteredAndOrderedRows.reverse() : filteredAndOrderedRows;
				$scope.updateVirtualScroll();
			};

			// orderBys and filterBys

			$scope.updateFilterBy = (header: TableGrid.Header, index: number) => {
				let value = header.fixed ? $scope.leftFilters[index].value : $scope.rightFilters[index].value;
				if (!header) { return; }
				if (!header.filterable) { return; }
				if (value === null || value === "") {
					header.fixed ? $scope.leftFilters[index] = { header: null, value: "" } : $scope.rightFilters[index] = { header: null, value: "" };
				}
				header.fixed ? $scope.leftFilters[index] = { header: header, value: value } : $scope.rightFilters[index] = { header: header, value: value };

				updateFilteredAndOrderedRows();
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

				updateFilteredAndOrderedRows();
			};

			// playing init
			init();
		}
	}

	angular.module("lui.directives")
		.controller(LuidTableGridController.IID, LuidTableGridController);

}