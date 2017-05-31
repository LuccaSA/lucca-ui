module lui.departmentpicker {
	"use strict";

	export const MAGIC_PAGING = 15;

	export class LuidDepartmentPickerController {
		public static IID: string = "luidDepartmentPickerController";
		public static $inject: Array<string> = ["$scope", "departmentPickerService"];

		private $scope: ILuidDepartmentPickerScope;
		private departmentPickerService: IDepartmentPickerService;

		private ngModelCtrl: ng.INgModelController;
		private departments: IDepartment[];

		constructor(
			$scope: ILuidDepartmentPickerScope,
			departmentPickerService: IDepartmentPickerService) {

			this.$scope = $scope;
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

			this.$scope.loadMore = (): void => {
				if (this.$scope.departmentsToDisplay.length < this.departments.length) {
					this.$scope.departmentsToDisplay = _.first(this.departments, this.$scope.departmentsToDisplay.length + MAGIC_PAGING);
					this.$scope.$apply();
				}
			};

			this.$scope.getLevel = (department: IDepartment): Array<{}> => {
				return new Array(department.level);
			};
		}

		private initDepartments(): void {
			this.$scope.departmentsToDisplay = [];
			this.departmentPickerService.getDepartments()
			.then((departments: IDepartment[]) => {
				this.departments = departments;
				this.$scope.departmentsToDisplay = _.first(this.departments, MAGIC_PAGING);
			});
		}

		private setViewValue(department: IDepartment): void {
			this.ngModelCtrl.$setViewValue(angular.copy(department));
		}
	}

	angular.module("lui").controller(LuidDepartmentPickerController.IID, LuidDepartmentPickerController);
}
