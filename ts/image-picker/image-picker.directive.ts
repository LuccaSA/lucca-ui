module lui.imagepicker {
	"use strict";
	class LuidImagePicker implements angular.IDirective {
		public static IID: string = "luidImagePicker";
		public restrict = "E";
		public templateUrl = "lui/templates/image-picker/image-picker.html";
		public require = ["ngModel", LuidImagePicker.IID];
		public scope = {
			placeholderUrl: "@",
			croppingRatio: "=",
			croppingDisabled: "=",
			deleteEnabled: "=",
			hideEditHint: "=",
			isDisabled: "="
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
			imgPickerCtrl.setPlaceholder(scope.placeholderUrl);
			imgPickerCtrl.setPopoverTrigger(element, scope);
			imgPickerCtrl.setElements(element);
		}
	}

	interface IImagepickerScope extends ng.IScope, popover.IClickoutsideTriggerScope {
		pictureStyle: { "background-image": string };
		placeholderUrl: string;
		uploading: boolean;
		deleteEnabled: boolean;
		file: any;
		onCropped(cropped: string, fileName: string): void;
		onCancelled(): void;
		onClick(event: ng.IAngularEvent): void;
		onDelete(): void;
		onDeletion(): void;
		setTouched(): void;
		uploadNewImage($event: ng.IAngularEvent): void;
		togglePopover($event: ng.IAngularEvent): void;
		openPopover($event: ng.IAngularEvent): void;
	}


	class LuidImagePickerController {
		public static IID: string = "luidImagePickerController";
		public static $inject: Array<string> = ["$scope", "uploaderService", "$timeout"];
		private $scope: IImagepickerScope;
		private ngModelCtrl: ng.INgModelController;
		private placeholder: string;
		private popoverController: popover.IPopoverController;
		private inputElement: HTMLElement;

		constructor($scope: IImagepickerScope, uploaderService: IUploaderService, $timeout: ng.ITimeoutService) {
			this.$scope = $scope;
			$scope.setTouched = () => {
				this.ngModelCtrl.$setTouched();
			};

			$scope.uploadNewImage = ($event: ng.IAngularEvent): void => {
				// Necessary to wait for a new cycle and avoid $apply issues
				$timeout(() => {
					this.inputElement.click();
					this.closePopover();
				});
			};
			$scope.onCropped = (cropped, fileName) => {
				$scope.uploading = true;
				uploaderService.postDataURI(cropped, fileName)
				.then( (file: IFile): void => {
					$scope.uploading = false;
					this.setViewValue(file);
					this.$scope.pictureStyle = { "background-image": "url('" + file.href + "')" };
				}, (message: string): void => {
					this.ngModelCtrl.$setTouched();
					$scope.uploading = false;
				});
			};
			$scope.onCancelled = () => {
				$scope.file = undefined;
				this.ngModelCtrl.$setTouched();
			};
			$scope.onDelete = () => {
				this.setViewValue(undefined);
				$scope.file = undefined;
				this.$scope.pictureStyle = { "background-image": "url('" + this.placeholder + "')" };
				this.closePopover();
			};
		}
		// set stuff - is called in the linq function
		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			ngModelCtrl.$render = () => {
				this.$scope.file = this.getViewValue();
				if (!!this.$scope.file && !!this.$scope.file.href) {
					this.$scope.pictureStyle = { "background-image": "url('" + this.$scope.file.href + "')" };
				} else {
					this.$scope.pictureStyle = { "background-image": "url('" + this.placeholder + "')" };
				}
			};
		}
		public setPlaceholder(placeholder: string): void {
			this.placeholder = placeholder || "/static/common/images/placeholder-pp.png";
		}

		public setPopoverTrigger(elt: angular.IAugmentedJQuery, scope: IImagepickerScope): void {
			let onClosing = (): void => {
				this.closePopover();
			};
			this.popoverController = new popover.ClickoutsideTrigger(elt, scope, onClosing);
			scope.popover = { isOpen: false };
			scope.togglePopover = ($event: ng.IAngularEvent) => {
				$event.preventDefault();
				if (!!scope.file && !!scope.deleteEnabled) {
					this.togglePopover($event);
				} else {
					this.$scope.uploadNewImage($event);
				}
			};
		}

		public setElements(elt: angular.IAugmentedJQuery): void {
			this.inputElement = elt.find("input")[0];
		}
		private togglePopover($event: ng.IAngularEvent): void {
			if (this.$scope.popover.isOpen) {
				this.closePopover();
			} else {
				this.openPopover($event);
			}
		}

		private closePopover(): void {
			if (!!this.popoverController) {
				this.popoverController.close();
			}
		}

		private openPopover($event: ng.IAngularEvent): void {
			if (!!this.popoverController) {
				this.popoverController.open($event);
			}
		}

		private getViewValue(): IFile {
			return <IFile>this.ngModelCtrl.$viewValue;
		}
		private setViewValue(file: IFile): void {
			this.ngModelCtrl.$setTouched();
			this.ngModelCtrl.$setViewValue(file);
			this.$scope.file = file;
		}
	}

	angular.module("lui.crop").directive(LuidImagePicker.IID, LuidImagePicker.factory());
	angular.module("lui.crop").controller(LuidImagePickerController.IID, LuidImagePickerController);
}
