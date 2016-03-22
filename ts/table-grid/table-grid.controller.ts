/// <reference path="../references.ts" />

module Lui.Directives {

	"use strict";

	export class FilterTypeEnum {
		public static NONE = "none";
		public static TEXT = "text";
		public static SELECT = "select";
		public static MULTISELECT = "multiselect";
	}

	export class LuidTableGridController {
		public static IID: string = "luidTableGridController";
		public static $inject: Array<string> = ["$filter", "$scope", "$translate"];

		constructor($filter: Lui.ILuiFilters, $scope: IDataGridScope, $translate: angular.translate.ITranslateService) {

			$scope.FilterTypeEnum = FilterTypeEnum;
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
					$scope.colDefinitions.push(result.tree.node);
				}

				if (result.tree.node) {
					result.tree.node.rowspan = maxDepth - result.depth - result.subDepth;
					result.tree.node.colspan = result.subChildren;
					if (!result.tree.children.length && result.tree.node.filterType == FilterTypeEnum.NONE) {
						result.tree.node.rowspan++;
					}

					$scope.headerRows[result.depth] ? $scope.headerRows[result.depth].push(result.tree.node) : $scope.headerRows[result.depth] = [result.tree.node];
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

			let initFilter = () => {
				$scope.filters = [];
				_.each($scope.datas, (row: any) => {
					_.each($scope.colDefinitions, (header: TableGrid.Header, index: number) => {
						if (!$scope.filters[index]) {
							$scope.filters[index] = { header: header, selectValues:[], currentValues: [] };
						}
						if (header.filterType === FilterTypeEnum.SELECT
								|| header.filterType === FilterTypeEnum.MULTISELECT) {
							let value = header.getValue(row);
							if (!!header.getFilterValue) {
								value = header.getFilterValue(row);
							}
							if (!_.contains($scope.filters[index].selectValues, value)) {
								$scope.filters[index].selectValues.push(value);
							}
						}
					});

				});
			};

			let init = () => {

				$scope.headerRows = [];
				$scope.bodyRows = [];
				$scope.colDefinitions = [];
				$scope.allChecked = {value: false};

				maxDepth = getTreeDepth($scope.header);

				browse({ depth: 0, subChildren: 0, subDepth: 0, tree: $scope.header });


				$scope.selected = { orderBy: null, reverse: false };

				initFilter();
			};

			$scope.updateFilteredAndOrderedRows = () => {
				let temp = _.chain($scope.datas)
					.filter((row: any) => {
						let result = true;
						$scope.filters.forEach((filter: { header: TableGrid.Header, selectValues: string[], currentValues: string[] }) => {
							if (filter.header
									&& !!filter.currentValues[0]
									&& filter.currentValues[0] !== "") {
								let prop = (filter.header.getValue(row) + "").toLowerCase();
								let containsProp = _.some(filter.currentValues, (value: string) => { return prop.indexOf(value.toLowerCase()) !== -1});
								if (!containsProp) {
									result = false;
								}
							}
						});
						return result;
					});
				if ($scope.selected && $scope.selected.orderBy) {
					temp = temp.sortBy((row: any) => {
						let orderByValue = $scope.selected.orderBy.getValue(row);
						if ( $scope.selected.orderBy.getOrderByValue != null){
							orderByValue = $scope.selected.orderBy.getOrderByValue(row);
						}
						return orderByValue;
					});
				}
				let filteredAndOrderedRows = temp.value();
				$scope.filteredAndOrderedRows = $scope.selected.reverse ? filteredAndOrderedRows.reverse() : filteredAndOrderedRows;

				$scope.updateVirtualScroll();
			};

			$scope.updateOrderBy = (header: TableGrid.Header) => {
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

				$scope.updateFilteredAndOrderedRows();
			};

			// strip html for display in title attribute
			$scope.stripHtml = (html) => {
				let tmp = document.createElement("DIV");
				tmp.innerHTML = html;
				return tmp.textContent || tmp.innerText || "";
			};

			$scope.onMasterCheckBoxChange = () => {
				if (_.some($scope.filteredAndOrderedRows, (row: any) => { return !row.isChecked; })) {
					_.each($scope.filteredAndOrderedRows, (row: any) => { row.isChecked = true; });
				} else {
					_.each($scope.filteredAndOrderedRows, (row: any) => { row.isChecked = false; });
				}
			};

			$scope.onCheckBoxChange = () => {
				if (_.some($scope.filteredAndOrderedRows, (row: any) => { return !row.isChecked; })) {
					$scope.allChecked.value = false;
				} else {
					$scope.allChecked.value = true;
				}
			};

			$scope.getCheckboxState = () => {
				let selectedCheckboxesCount = _.where($scope.filteredAndOrderedRows, { isChecked: true }).length;
				if (selectedCheckboxesCount === 0) {
					return "";
				}
				if (selectedCheckboxesCount === $scope.filteredAndOrderedRows.length) {
					return "checked";
				}
				if (selectedCheckboxesCount < $scope.filteredAndOrderedRows.length) {
					return "partial";
				}
				return "";
			};

			$scope.clearSelect = ($select: any, $index:number, $event: any) => {
				$event.stopPropagation();
				$select.selected = undefined;
				$scope.filters[$index].currentValues[0] = "";
				$scope.updateFilteredAndOrderedRows();
			};

			// playing init
			init();
		}
	}

	angular.module("lui.directives")
		.controller(LuidTableGridController.IID, LuidTableGridController);

}
