module Lui {
	"use strict";
	export interface IFile {
		id?: string;
		name?: string;
		href: string;
	}
}
module Lui.Directives {
	"use strict";
	interface IImageCropperScope extends angular.IScope {
		image: string;
		cropped: string;
		cancelLabel: string;
		croppingRatio: number;
		croppingDisabled: boolean;
		cancel(): void;
		crop(): void;
		donotcrop(): void;
		openCropper(): void;

		onCropped(cropped: string): void;
		onCancelled(): void;
	}
	export class LuidImageCropper implements angular.IDirective {
		public static IID = "luidImageCropper";
		public controller = LuidImageCropperController.IID;
		public restrict = "AE";
		public scope = {
			onCropped: "=",
			onCancelled: "=",
			croppingRatio: "=",
			croppingDisabled: "=",
		};

		public static Factory(): angular.IDirectiveFactory {
			let directive = () => { return new LuidImageCropper(); };
			directive.$inject = [];
			return directive;
		};

		constructor() {
			// Constructor code here
		};

		public link: ng.IDirectiveLinkFn = (scope: IImageCropperScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {

			let handleFileSelect = (evt) => {
				let file = evt.currentTarget.files[0];
				let reader = new FileReader();
				/* tslint:disable */
				// see https://github.com/Microsoft/TypeScript/issues/4163
				reader.onload = (event: any) => {
				/* tslint:enable */
					scope.$apply(($scope) => {
						scope.image = event.target.result;
						if (!scope.croppingDisabled) {
							scope.openCropper();
						} else {
							scope.onCropped(scope.image);
						}
					});
				};
				reader.readAsDataURL(file);
			};

			angular.element(element[0]).on("change", handleFileSelect);
		};
	}
	class LuidImageCropperController {
		public static IID: string = "luidImageCropperController";
		public static $inject: Array<string> = ["$scope", "moment", "$uibModal", "luisConfig"];

		constructor($scope: IImageCropperScope, moment: moment.MomentStatic, $uibModal: angular.ui.bootstrap.IModalService, luisConfig: Lui.IConfig) {
			$scope.image = "";
			$scope.cropped = "";

			$scope.openCropper = () => {
				let modalOptions: ng.ui.bootstrap.IModalSettings = {
					templateUrl: "lui/templates/image-picker/image-cropper.modal.html",
					controller: LuidImageCropperModalController.IID,
					size: "desktop",
					resolve: {
						image: (): string => {
							return $scope.image;
						},
						croppingRatio: (): number => {
							return $scope.croppingRatio;
						},
						cancelLabel: (): string => {
							return luisConfig.cancelLabel;
						}
					},
				};
				let modalInstance = $uibModal.open(modalOptions);
				modalInstance.result.then((cropped: string) => {
					$scope.cropped = cropped;
					$scope.onCropped(cropped);
				}, () => {
					if (!!$scope.onCancelled) {
						$scope.onCancelled();
					}
				});
			};
		}
	}
	class LuidImageCropperModalController {
		public static IID: string = "luidImageCropperModalController";
		public static $inject: Array<string> = ["$scope", "$uibModalInstance", "moment", "image", "croppingRatio", "cancelLabel"];

		constructor($scope: IImageCropperScope, $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, moment: moment.MomentStatic, image: string, croppingRatio: number, cancelLabel: string) {
			let doClose: boolean = false;
			$scope.image = image;
			$scope.cancelLabel = cancelLabel;
			$scope.croppingRatio = croppingRatio;

			$scope.crop = () => {
				doClose = true;
				$uibModalInstance.close($scope.cropped);
			};
			$scope.donotcrop = () => {
				doClose = true;
				$uibModalInstance.close($scope.image);
			};
			$scope.cancel = () => {
				doClose = true;
				$uibModalInstance.dismiss();
			};
			$scope.$on("modal.closing", ($event: ng.IAngularEvent): void => {
				if (!doClose) {
					$event.preventDefault();
				}
			});
		}
	}

	angular.module("lui.directives").directive(LuidImageCropper.IID, LuidImageCropper.Factory());
	angular.module("lui.directives").controller(LuidImageCropperController.IID, LuidImageCropperController);
	angular.module("lui.directives").controller(LuidImageCropperModalController.IID, LuidImageCropperModalController);
}
					// uploaderService.postDataURI(cropped).then((file: IFile) => {
