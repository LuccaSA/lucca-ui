module lui.apiselect {
	"use strict";
	let MAGIC_PAGING = 25;
	class ApiSelect implements angular.IDirective {
		public static IID = "luidApiSelect";
		public restrict = "AE";
		public templateUrl = "lui/templates/formly/inputs/api-select.html";
		public scope = {
			api: "=",
			filter: "=",
			orderBy: "=",
			placeholder: "@",
			allowClear: "="
		};
		public controller = ApiSelectController.IID;

		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new ApiSelect();
			};
			return directive;
		}

		public link(scope: IApiSelectScope, element: angular.IAugmentedJQuery): void {
			scope.onDropdownToggle = (isOpen: boolean) => {
				if (isOpen) {
					element.addClass("ng-open");
				} else {
					element.removeClass("ng-open");
				}
			};
		}
	}
	class ApiSelectMultiple implements angular.IDirective {
		public static IID = "luidApiSelectMultiple";
		public restrict = "AE";
		public templateUrl = "lui/templates/formly/inputs/api-select-multiple.html";
		public scope = {
			api: "=",
			filter: "=",
			orderBy: "=",
			placeholder: "@"
		};
		public controller = ApiSelectController.IID;

		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new ApiSelectMultiple();
			};
			return directive;
		}

		public link(scope: IApiSelectScope, element: angular.IAugmentedJQuery): void {
			scope.onDropdownToggle = (isOpen: boolean) => {
				if (isOpen) {
					element.addClass("ng-open");
				} else {
					element.removeClass("ng-open");
				}
			};
		}
	}

	interface IApiSelectScope extends ng.IScope {
		api: string;
		filter: string;
		orderBy: string;
		choices: (IStandardApiResource & { loading?: boolean })[];

		onDropdownToggle(isOpen: boolean): void;
		refresh(clue: string): void;
		loadMore(clue: string): void;
	}
	class ApiSelectController {
		public static IID: string = "luidApiSelectController";
		public static $inject: Array<string> = [
			"$scope",
			"$timeout",
			"luisStandardApiService",
		];
		private offset: number = 0;
		constructor(
			$scope: IApiSelectScope,
			$timeout: ng.ITimeoutService,
			service: StandardApiService
		) {
			let delayedReset;
			function resetResults(): void {
				if (!!delayedReset) {
					$timeout.cancel(delayedReset);
				}
				delayedReset = $timeout(() => {
					$scope.refresh("");
					delayedReset = undefined;
				}, 250);
			}
			$scope.$watch("filter", () => {
				resetResults();
			});
			$scope.$watch("api", () => {
				resetResults();
			});
			$scope.$watch("order", () => {
				resetResults();
			});
			$scope.refresh = (clue: string) => {
				this.offset = 0;
				let paging = `0,${MAGIC_PAGING}`;
				service.get(clue, $scope.api, $scope.filter, paging, $scope.orderBy)
				.then((choices) => {
					$scope.choices = choices;
					this.offset = $scope.choices.length;
				});
			};
			let loadingPromise;
			$scope.loadMore = (clue: string) => {
				if (!loadingPromise) {
					let paging = `${this.offset},${this.offset + MAGIC_PAGING}`;
					$scope.choices.push({ id: 0, loading: true, name: "" });
					loadingPromise = service.get(clue, $scope.api, $scope.filter, paging, $scope.orderBy)
					.then((nextChoices: IStandardApiResource[]) => {
						// Some issues with _.chain().uniq typings...
						$scope.choices = _.uniq(
							_.chain($scope.choices)
							.reject(c => c.loading)
							.union(nextChoices)
							.value()
						);
						this.offset = $scope.choices.length;
						loadingPromise = undefined;
					}, () => {
						loadingPromise = undefined;
					});
				}
			};
		}
	}
	angular.module("lui").controller(ApiSelectController.IID, ApiSelectController);
	angular.module("lui").directive(ApiSelect.IID, ApiSelect.factory());
	angular.module("lui").directive(ApiSelectMultiple.IID, ApiSelectMultiple.factory());
}
