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
		interface IImageUploaderScope extends angular.IScope {
		image: string;
		cropped: string;
		cancelLabel: string;

		cancel(): void;
		crop(): void;
		donotcrop(): void;
		onFinished(file: IFile): void;
		openCropper(): void;
	}
	export class LuidImageUploader implements angular.IDirective {
		public static IID = "luidImageUploader";
		public controller = LuidImageUploaderController.IID;
		public restrict = "AE";
		public scope = { onFinished: "&" };

		public static Factory(): angular.IDirectiveFactory {
			let directive = () => { return new LuidImageUploader(); };
			directive.$inject = [];
			return directive;
		};

		constructor() {
			// Constructor code here
		};

		public link: ng.IDirectiveLinkFn = (scope: IImageUploaderScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {

			let handleFileSelect = (evt) => {
				let file = evt.currentTarget.files[0];
				let reader = new FileReader();
				/* tslint:disable */
				// see https://github.com/Microsoft/TypeScript/issues/4163
				reader.onload = (event: any) => {
				/* tslint:enable */
					scope.$apply(($scope) => {
					scope.image = event.target.result;
					scope.openCropper();
					});
				};
				reader.readAsDataURL(file);
			};

			angular.element(element[0]).on("change", handleFileSelect);
		};
	}
	class LuidImageUploaderController {
		public static IID: string = "luidImageUploaderController";
		public static $inject: Array<string> = ["$scope", "moment", "$uibModal", "uploaderService", "luisConfig"];

		constructor($scope: IImageUploaderScope, moment: moment.MomentStatic, $uibModal: angular.ui.bootstrap.IModalService, uploaderService: Service.IUploaderService, luisConfig: Lui.IConfig) {
			$scope.image = "";
			$scope.cropped = "";

			$scope.openCropper = () => {
				let modalOptions: ng.ui.bootstrap.IModalSettings & { appendTo: ng.IAugmentedJQuery } = {
					templateUrl: "lui/templates/image-picker/image-uploader.modal.html",
					controller: LuidImageUploadedrModalController.IID,
					size: "desktop",
					windowClass: luisConfig.prefix,
					backdropClass: luisConfig.prefix,
					appendTo: luisConfig.parentElt,
					resolve: {
						image: (): string => {
							return $scope.image;
						},
						cancelLabel: (): string => {
							return luisConfig.cancelLabel;
						}
					},
				};
				let modalInstance = $uibModal.open(modalOptions);
				modalInstance.result.then((cropped: string) => {
					$scope.cropped = cropped;
					uploaderService.postDataURI(cropped).then((file: IFile) => {
						$scope.onFinished(file);
					}, () => { return; });
				}, () => { return; });
			};
		}
	}
	class LuidImageUploadedrModalController {
		public static IID: string = "luidImageUploadedrModalController";
		public static $inject: Array<string> = ["$scope", "$uibModalInstance", "moment", "image", "cancelLabel"];

		constructor($scope: IImageUploaderScope, $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, moment: moment.MomentStatic, image: string, cancelLabel: string) {
			$scope.image = image;
			$scope.cancelLabel = cancelLabel;

			$scope.crop = () => {
				$uibModalInstance.close($scope.cropped);
			};
			$scope.donotcrop = () => {
				$uibModalInstance.close($scope.image);
			};
			$scope.cancel = () => {
				$uibModalInstance.dismiss();
			};
		}
	}

	angular.module("lui.directives").directive(LuidImageUploader.IID, LuidImageUploader.Factory());
	angular.module("lui.directives").controller(LuidImageUploaderController.IID, LuidImageUploaderController);
	angular.module("lui.directives").controller(LuidImageUploadedrModalController.IID, LuidImageUploadedrModalController);
}
