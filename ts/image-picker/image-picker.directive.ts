module Lui.Directives {
	"use strict";
	class LuidImagePicker implements angular.IDirective {
		public static IID: string = "luidImagePicker";
		public restrict = "E";
		public templateUrl = "lui/templates/image-picker/image-picker.html";
		public require = ["ngModel", LuidImagePicker.IID];
		public scope = {
			placeholder: "@",
		};
		public controller: string = LuidImagePickerController.IID;
		public static factory(): angular.IDirectiveFactory {
			let directive = () => {
				return new LuidImagePicker();
			};
			return directive;
		}
		public link(scope: IImagepickerScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrls: any[]): void {
			let ngModelCtrl = <ng.INgModelController>ctrls[0];
			let imgPickerCtrl = <LuidImagePickerController>ctrls[1];
			imgPickerCtrl.setNgModelCtrl(ngModelCtrl);
			imgPickerCtrl.setPlaceholder(scope.placeholder);
		}
	}

	interface IImagepickerScope extends ng.IScope {
		pictureStyle: { "background-image": string };
		placeholder: string;
		uploading: boolean;
		onCropped(cropped: string): void;
	}


	class LuidImagePickerController {
		public static IID: string = "luidImagePickerController";
		public static $inject: Array<string> = ["$scope"];
		private $scope: IImagepickerScope;
		private ngModelCtrl: ng.INgModelController;
		private placeholder: string;

		constructor($scope: IImagepickerScope) {
			this.$scope = $scope;
			$scope.onCropped = (cropped) => {
				$scope.uploading = true;
			};
		}
		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				let vv = this.getViewValue();
				if (!!vv && !!vv.href) {
					this.$scope.pictureStyle = { "background-image": "url('" + vv.href + "')" };
				} else {
					this.$scope.pictureStyle = { "background-image": "url('" + this.placeholder + "')" };
				}
			};
		}
		public setPlaceholder(placehoilder: string): void {
			this.placeholder = placehoilder || "/static/common/images/placeholder-pp.png";
		}

		private getViewValue(): IFile {
			return <IFile>this.ngModelCtrl.$viewValue;
		}
	}

	angular.module("lui.directives").directive(LuidImagePicker.IID, LuidImagePicker.factory());
	angular.module("lui.directives").controller(LuidImagePickerController.IID, LuidImagePickerController);
}
