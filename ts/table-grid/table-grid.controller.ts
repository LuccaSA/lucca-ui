
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
		public static $inject: Array<string> = ["$filter", "$scope", "$translate", "$timeout"];

		constructor($filter: Lui.ILuiFilters, $scope: IDataGridScope, $translate: angular.translate.ITranslateService, $timeout: ng.ITimeoutService) {

			// private members
			let maxDepth = 0;

			$scope.isSelectable = angular.isDefined($scope.selectable);

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
					if (!result.tree.children.length && result.tree.node.filterType === FilterTypeEnum.NONE) {
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

			$scope.initFilter = () => {
				$scope.filters = [];

				_.each($scope.colDefinitions, (header: TableGrid.Header, index: number) => {
					_.each($scope.datas, (row: any) => {
						if (!$scope.filters[index]) {
							$scope.filters[index] = { header: header, selectValues: [], currentValues: [] };
						}
						if (header.filterType === FilterTypeEnum.SELECT
								|| header.filterType === FilterTypeEnum.MULTISELECT) {
							let value = header.getValue(row);
							if (!!header.getFilterValue) {
								value = header.getFilterValue(row);
							}

							let valuesToCheck = value.split("|");
							_.each(valuesToCheck, (val: string) => {
								if (!_.contains($scope.filters[index].selectValues, val)) {
									$scope.filters[index].selectValues.push(val);
								}
							});
						}
					});
					$scope.filters[index].selectValues = _.sortBy($scope.filters[index].selectValues, (val) => { return !!val ? val.toLowerCase() : ""});
				});
			};

			let init = () => {
				$scope.FilterTypeEnum = FilterTypeEnum;
				$scope.headerRows = [];
				$scope.bodyRows = [];
				$scope.colDefinitions = [];
				$scope.allChecked = {value: false};

				maxDepth = getTreeDepth($scope.header);

				browse({ depth: 0, subChildren: 0, subDepth: 0, tree: $scope.header });

				$scope.existFixedRow = _.some($scope.colDefinitions, (colDef: TableGrid.Header) => {
					return colDef.fixed;
				});

				$scope.selected = { orderBy: null, reverse: false };

				if (!!$scope.defaultOrder) {
					let firstChar = $scope.defaultOrder.substr(0, 1);
					if (firstChar === "-" || firstChar === "+") {
						$scope.defaultOrder = $scope.defaultOrder.substr(1);

						$scope.selected.reverse = firstChar === "-" ? true : false;
					}
					let orderByHeader = _.find($scope.colDefinitions, (header: TableGrid.Header) => {
						return header.label === $scope.defaultOrder;
					});
					$scope.selected.orderBy = !!orderByHeader ? orderByHeader : null;
				}

			};

			let getCheckboxState = () => {
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

			$scope.updateFilteredRows = () => {
				//Management of checkboxes if tablegrid is selectable
				if ($scope.isSelectable) {
					$scope.allChecked.value = false;
					_.each($scope.filteredAndOrderedRows, (row: any) => {
						row.isChecked = false;
					});
					$scope.masterCheckBoxCssClass = getCheckboxState();
				}

				let temp = _.chain($scope.datas)
					.filter((row: any) => {
						let result = true;
						$scope.filters.forEach((filter: { header: TableGrid.Header, selectValues: string[], currentValues: string[] }) => {
							if (filter.header
									&& !!filter.currentValues[0]
									&& filter.currentValues[0] !== "") {
								let propValue = (filter.header.getValue(row) + "").toLowerCase();
								if (!!filter.header.getFilterValue) {
									propValue = filter.header.getFilterValue(row).toLowerCase();
								}
								let containsProp = _.some(filter.currentValues, (value: string) => {
									//For select filter types, if test value doesn't contain "|" character, we have to test exact value
									if ( (filter.header.filterType === FilterTypeEnum.SELECT || filter.header.filterType === FilterTypeEnum.MULTISELECT)
											&& (propValue.indexOf("|") === -1) ) {
										return propValue === value.toLowerCase();
									}else {
										return propValue.split("|").indexOf(value.toLowerCase()) !== -1;
									}
								});
								if (!containsProp) {
									result = false;
								}
							}
						});
						return result;
					});
				$scope.filteredAndOrderedRows = temp.value();

				$scope.updateViewAfterFiltering();
			};

			$scope.orderBySelectedHeader = () => {
				if ($scope.selected && $scope.selected.orderBy) {
					$scope.filteredAndOrderedRows = _.sortBy($scope.filteredAndOrderedRows, (row: any) => {
						let orderByValue = $scope.selected.orderBy.getValue(row);
						if ( $scope.selected.orderBy.getOrderByValue != null) {
							orderByValue = $scope.selected.orderBy.getOrderByValue(row);
						}
						return orderByValue;
					});
				}
				$scope.filteredAndOrderedRows = $scope.selected.reverse ? $scope.filteredAndOrderedRows.reverse() : $scope.filteredAndOrderedRows;
			};

			$scope.updateOrderedRows = (header: TableGrid.Header) => {
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

				$scope.orderBySelectedHeader();

				$scope.updateViewAfterOrderBy();
			};

			$scope.onMasterCheckBoxChange = () => {
				if (_.some($scope.filteredAndOrderedRows, (row: any) => { return !row.isChecked; })) {
					if ($scope.masterCheckBoxCssClass === "partial") {
						_.each($scope.filteredAndOrderedRows, (row: any) => { row.isChecked = false; });
					} else {
						_.each($scope.filteredAndOrderedRows, (row: any) => { row.isChecked = true; });
					}
				} else {
					_.each($scope.filteredAndOrderedRows, (row: any) => { row.isChecked = false; });
				}
				$scope.masterCheckBoxCssClass = getCheckboxState();
			};

			$scope.onCheckBoxChange = () => {
				$scope.masterCheckBoxCssClass = getCheckboxState();
				if (!$scope.masterCheckBoxCssClass) {
					$scope.allChecked.value = false;
				}
				if (_.some($scope.filteredAndOrderedRows, (row: any) => { return row.isChecked; })) {
					$scope.allChecked.value = true;
				}
			};

			init();
		}
	}

	angular.module("lui.directives")
		.controller(LuidTableGridController.IID, LuidTableGridController);

}
