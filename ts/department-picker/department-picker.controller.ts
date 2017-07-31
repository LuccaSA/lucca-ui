module lui.departmentpicker {
	"use strict";

	export const MAGIC_PAGING = 15;

	export class LuidDepartmentPickerController {
		public static IID: string = "luidDepartmentPickerController";
		public static $inject: Array<string> = ["$scope", "$filter", "departmentPickerService"];

		private $scope: ILuidDepartmentPickerScope;
		private $filter: IDepartmentPickerFilters;
		private departmentPickerService: IDepartmentPickerService;

		private ngModelCtrl: ng.INgModelController;
		private departments: IDepartment[];

		constructor(
			$scope: ILuidDepartmentPickerScope,
			$filter: IDepartmentPickerFilters,
			departmentPickerService: IDepartmentPickerService) {

			this.$scope = $scope;
			this.$filter = $filter;
			this.departmentPickerService = departmentPickerService;

			this.initDepartments();
			this.initScope();
		}

		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			this.ngModelCtrl.$render = (): void => {
				if (!!this.ngModelCtrl.$modelValue) {
					this.$scope.internal.selectedDepartment = this.ngModelCtrl.$modelValue;
				}
			};
		}

		private initScope(): void {
			this.$scope.internal = { selectedDepartment: undefined };

			this.$scope.selectDepartment = (): void => {
				this.setViewValue(this.$scope.internal.selectedDepartment);
			};

			this.$scope.loadMore = (clue: string): void => {
				if (this.$scope.departmentsToDisplay.length < this.departments.length) {
					this.filterDepartments(clue);
					this.$scope.$apply();
				}
			};

			this.$scope.getLevel = (department: IDepartment): Array<{}> => {
				return new Array(department.level);
			};

			this.$scope.search = (clue: string): void => {
				this.$scope.departmentsToDisplay = []; // Reset list of departments to display
				this.$scope.$apply(); // HACK to scroll to the top of the list
				this.filterDepartments(clue);
			};
		}

		private initDepartments(): void {
			this.$scope.departmentsToDisplay = [];
			this.departmentPickerService.getDepartments()
			.then((departments: IDepartment[]) => {
				this.departments = departments;
				this.filterDepartments();
			});
		}

		private filterDepartments(clue: string = ""): void {
			let filteredDepartments = this.$filter("departmentFilter")(this.departments, clue);
			this.$scope.departmentsToDisplay = _.first(filteredDepartments, this.$scope.departmentsToDisplay.length + MAGIC_PAGING);
		}

		private setViewValue(department: IDepartment): void {
			this.ngModelCtrl.$setViewValue(angular.copy(department));
		}
	}

	angular.module("lui").controller(LuidDepartmentPickerController.IID, LuidDepartmentPickerController);
}
