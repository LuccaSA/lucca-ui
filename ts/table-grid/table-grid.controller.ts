
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

			//Order columnDefinitions
			let recursiveHeaderSortBy = (headerTree: TableGrid.HeaderTree) => {
				if (headerTree.children.length) {
					_.each(headerTree.children, (child) => {
						recursiveHeaderSortBy(child)
					});
				}
				headerTree.children = _.sortBy(headerTree.children, (childTree: TableGrid.HeaderTree) => { return childTree.node.position} );
			};

			recursiveHeaderSortBy($scope.header);

			$scope.isSelectable = angular.isDefined($scope.selectable);

			$scope.internalRowClick = (event: any, row: any) => {
				let currentNode = event.target;
				let otherClickEventFired = false;
				while (!otherClickEventFired && currentNode.nodeName !== event.currentTarget.nodeName) {
					otherClickEventFired = !!currentNode.href || currentNode.type === "checkbox";
					currentNode = currentNode.parentElement;
				}
				if (!otherClickEventFired) {
					$scope.onRowClick({ row: row });
				}
			};

			// private methods
			let browse = (result: TableGrid.BrowseResult): TableGrid.BrowseResult => {

				if (!result.tree.children.length) { result.subChildren++; };

				result.tree.children.forEach((child: TableGrid.HeaderTree) => {
					let subResult = browse({ depth: result.depth + 1, tree: child, subChildren: 0, subDepth: 0 });
					result.subChildren += subResult.subChildren;
					result.subDepth = Math.max(result.subDepth, subResult.subDepth);
				});

				if (result.tree.children.length) {
					result.subDepth++;
				} else {
					$scope.columnDefinitions.push(result.tree.node);
				}

				if (result.tree.node) {
					result.tree.node.colspan = result.subChildren;

					$scope.headerRows[result.depth] ? $scope.headerRows[result.depth].push(result.tree.node) : $scope.headerRows[result.depth] = [result.tree.node];
				}
				return result;
			};

			let getTreeDepth = (tree: TableGrid.HeaderTree): number => {
				let depth = 0;
				tree.children.forEach((child: TableGrid.HeaderTree) => {
					depth = Math.max(depth, getTreeDepth(child));
				});
				return depth + 1;
			};

			let init = () => {
				$scope.FilterTypeEnum = FilterTypeEnum;
				$scope.headerRows = [];
				$scope.bodyRows = [];
				$scope.columnDefinitions = [];
				$scope.allChecked = {value: false};

				maxDepth = getTreeDepth($scope.header);

				//Build columnDefinitions
				browse({ depth: 0, subChildren: 0, subDepth: 0, tree: $scope.header });

				$scope.existFixedRow = _.some($scope.columnDefinitions, (colDef: TableGrid.Header) => {
					return colDef.fixed;
				});

				$scope.columnSelected = { orderByColumnIndex: null, reverse: false };

				if (!!$scope.defaultOrder) {
					let firstChar = $scope.defaultOrder.substr(0, 1);
					if (firstChar === "-" || firstChar === "+") {
						$scope.defaultOrder = $scope.defaultOrder.substr(1);

						$scope.columnSelected.reverse = firstChar === "-" ? true : false;
					}
					let orderByHeader = _.find($scope.columnDefinitions, (header: TableGrid.Header) => {
						return header.label === $scope.defaultOrder;
					});
					$scope.columnSelected.orderByColumnIndex = !!orderByHeader ? orderByHeader.position : null;
				}

			};

			$scope.updateFilteredRows = () => {
				$scope.filteredAndOrderedDatasTrees = _.each($scope.datasTrees, (dataTree: TableGrid.Tree) => {
					let result = true;
					$scope.filters.forEach((filter: { header: TableGrid.Header, selectValues: string[], currentValues: string[] }) => {
						if (!!filter.currentValues[0]
								&& filter.currentValues[0] !== "") {
							let propValue = (dataTree.node. + "").toLowerCase();
							if (!!filter.header.getFilterValue) {
								propValue = filter.header.getFilterValue(row).toLowerCase();
							}
							let containsProp = _.some(filter.currentValues, (value: string) => {
								//For select filter types, if test value doesn't contain "|" character, we have to test exact value
								if (filter.header.filterType === FilterTypeEnum.SELECT || filter.header.filterType === FilterTypeEnum.MULTISELECT) {
									return propValue.indexOf("|") !== -1 ? propValue.split("|").indexOf(value.toLowerCase()) !== -1 : propValue === value.toLowerCase();
								} else {
									return $filter("luifStripAccents")(propValue).indexOf($filter("luifStripAccents")(value.toLowerCase())) !== -1;
								}
							});
							if (!containsProp) {
								result = false;
							}
						}
					});
					return result;
				});
				$scope.orderBySelectedHeader();
				$scope.updateViewAfterFiltering();
			};

			$scope.orderBySelectedHeader = () => {
				if ($scope.columnSelected && $scope.columnSelected.orderByColumnIndex) {
					$scope.filteredAndOrderedDatasTrees = recursiveRowsSortBy($scope.filteredAndOrderedDatasTrees);
				}
			};

			let recursiveRowsSortBy = (trees: TableGrid.Tree[]) => {
				//Each level of the tree match to a column
				if (_.some(trees[0].node.dataColumns, (dataColumn: TableGrid.DataColumn) => { return dataColumn.indexColumn === $scope.columnSelected.orderByColumnIndex })) {
					trees = _.sortBy(trees, (tree: TableGrid.Tree) => {
						let dataCell =_.find(tree.node.dataColumns, (dataColumn: TableGrid.DataColumn) => { return dataColumn.indexColumn === $scope.columnSelected.orderByColumnIndex });
						return (typeof dataCell.value === "string") ? dataCell.value.toLowerCase() : dataCell.value;
					});
					trees = $scope.columnSelected.reverse ? trees.reverse() : trees;
				} else {
					_.each(trees, (tree: TableGrid.Tree) => {
						//Sort each subTrees
						tree.children = recursiveRowsSortBy(tree.children)
					});
				}
				return trees;
			};

			$scope.updateOrderedRows = (columnIndex: number) => {
				if (columnIndex === $scope.columnSelected.orderByColumnIndex) {
					if ($scope.columnSelected.reverse) {
						$scope.columnSelected.orderByColumnIndex = null;
						$scope.columnSelected.reverse = false;
					} else {
						$scope.columnSelected.reverse = true;
					}
				} else {
					$scope.columnSelected.orderByColumnIndex = columnIndex;
					$scope.columnSelected.reverse = false;
				}

				$scope.orderBySelectedHeader();

				$scope.updateViewAfterOrderBy();
			};

			init();
		}

		private getNbLeaves = (dataTree: any): number => {
			let nbLeaves = 0;
			if (dataTree.children.length) {
				var self = this;
				_.each(dataTree.children, (child: any) => {
					nbLeaves += self.getNbLeaves(child);
				});
			} else {
				return nbLeaves = 1;
			}
			return nbLeaves;
		};
	}

	angular.module("lui.directives")
		.controller(LuidTableGridController.IID, LuidTableGridController);

}
