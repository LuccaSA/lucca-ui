module lui.departmentpicker {
	"use strict";

	class LuidDepartmentPicker implements angular.IDirective {
		public static IID: string = "luidDepartmentPicker";
		public restrict = "E";
		public templateUrl = "lui/templates/department-picker/department-picker.html";
		public require = ["^ngModel", LuidDepartmentPicker.IID];
		public scope = {
		};
		public controller: string = LuidDepartmentPickerController.IID;
		public static factory(): angular.IDirectiveFactory {
			return () => { return new LuidDepartmentPicker(); };
		}

		public link(
			scope: ILuidDepartmentPickerScope,
			element: angular.IAugmentedJQuery,
			attrs: angular.IAttributes,
			ctrls: [ng.INgModelController, LuidDepartmentPickerController]): void {
			let ngModelCtrl = ctrls[0];
			let departmentPickerCtrl = ctrls[1];
			departmentPickerCtrl.setNgModelCtrl(ngModelCtrl);

			scope.onDropdownToggle = (isOpen: boolean) => {
				if (isOpen) {
					element.addClass("ng-open");
				} else {
					element.removeClass("ng-open");
				}
			};
		}
	}
	angular.module("lui.translate").directive(LuidDepartmentPicker.IID, LuidDepartmentPicker.factory());
}
