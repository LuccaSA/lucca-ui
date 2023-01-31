module lui {
	"use strict";
	export interface IFile {
		id?: string;
		name?: string;
		href: string;
	}
}
module lui.imagepicker {
	"use strict";
	type ImageFormat = "image/jpeg" | "image/png";
	const imageFormats = {
		"image/jpeg": { extension: "jpg" },
		"image/png": { extension: "png" },
	};
	const defaultImageFormat: ImageFormat = "image/png";
	interface IImageCropperScope extends angular.IScope {
		image: string;
		imageFormat: ImageFormat;
		fileName: string;
		cropped: string;
		cancelLabel: string;
		croppingRatio: number;
		croppingDisabled: boolean;
		cancel(): void;
		crop(): void;
		donotcrop(): void;
		openCropper(): void;

		onCropped(cropped: string, fileName: string): void;
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
				let file = (evt.currentTarget as HTMLInputElement).files[0];
				let reader = new FileReader();
				/* tslint:disable */
				// see https://github.com/Microsoft/TypeScript/issues/4163
				reader.onload = (event: any) => {
				/* tslint:enable */
					scope.$apply(($scope) => {
						scope.image = event.target.result;
						scope.fileName = file.name;
						scope.imageFormat = Object.keys(imageFormats).indexOf(file.type) !== -1 ? file.type as ImageFormat : defaultImageFormat;
						if (!scope.croppingDisabled) {
							scope.openCropper();
						} else {
							scope.onCropped(scope.image, scope.fileName);
						}

						// Clear the value of the file input, otherwise it will not trigger ngChange when uploading a file with the same name
						if (element[0] != null) {
							(<any>element[0]).value = "";
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

		constructor($scope: IImageCropperScope, moment: moment.MomentStatic, $uibModal: angular.ui.bootstrap.IModalService, luisConfig: IConfig) {
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
						imageFormat: (): ImageFormat => {
							return $scope.imageFormat;
						},
						fileName: (): string => {
							return $scope.fileName;
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
				modalInstance.result.then(({image, cropped}: {image: string, cropped: boolean}) => {
					$scope.cropped = image;
					const tempFileName = cropped ? $scope.fileName.slice(0, $scope.fileName.lastIndexOf(".")) + "." + imageFormats[$scope.imageFormat].extension : $scope.fileName;
					$scope.onCropped(image, tempFileName);
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
		public static $inject: Array<string> = ["$scope", "$uibModalInstance", "moment", "image", "imageFormat", "croppingRatio", "cancelLabel"];

		constructor($scope: IImageCropperScope, $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, moment: moment.MomentStatic, image: string, imageFormat: ImageFormat, fileName: string, croppingRatio: number, cancelLabel: string) {
			let doClose: boolean = false;
			$scope.image = image;
			$scope.imageFormat = imageFormat;
			$scope.fileName = fileName;
			$scope.cancelLabel = cancelLabel;
			$scope.croppingRatio = croppingRatio;

			$scope.crop = () => {
				doClose = true;
				$uibModalInstance.close({image: $scope.cropped, cropped : true});
			};
			$scope.donotcrop = () => {
				doClose = true;
				$uibModalInstance.close({image: $scope.image, cropped : false});
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

	angular.module("lui.crop").directive(LuidImageCropper.IID, LuidImageCropper.Factory());
	angular.module("lui.crop").controller(LuidImageCropperController.IID, LuidImageCropperController);
	angular.module("lui.crop").controller(LuidImageCropperModalController.IID, LuidImageCropperModalController);
}
