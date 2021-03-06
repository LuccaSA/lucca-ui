module lui {
	"use strict";
	export interface INotifyService {
		error(message: string, details?: string): void;
		warning(message: string, details?: string): void;
		success(message: string, details?: string): void;
		alert(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
		confirm(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
		loading(loadingPromise: ng.IPromise<string>, message?: string, cancelFn?: () => void): void;
	}
}
module lui.notify {
	"use strict";
	class Log {
		public message: string;
		public details: string;
		constructor(message: string, details: string) {
			this.message = message;
			this.details = details;
		}
	}
	interface ILoadingIsolateScope extends ng.IScope {
		loading: boolean;
		calloutClass: string;
		canCancel: boolean;
		cancel: () => void;
		$close: () => void;
		message: string;
	}

	let errorTemplate = "lui/templates/notify-service/error.html";
	let warningTemplate = "lui/templates/notify-service/warning.html";
	let successTemplate = "lui/templates/notify-service/success.html";
	let loadingTemplate = "lui/templates/notify-service/loading.html";
	let alertTemplate = "lui/templates/notify-service/alert.html";
	let confirmTemplate = "lui/templates/notify-service/confirm.html";

	abstract class ANotify {
		public duration: number;
		public templateUrl: string;
		public message: string;
		public scope: ng.IScope;

		constructor(duration: number, templateUrl: string, message: string) {
			this.duration = duration;
			this.templateUrl = templateUrl;
			this.message = message;
		}
	}
	class ErrorNotify extends ANotify {
		constructor(message: string) {
			super(20000, errorTemplate, message);
		}
	}
	class WarningNotify extends ANotify {
		constructor(message: string) {
			super(10000, warningTemplate, message);
		}
	}
	class SuccessNotify extends ANotify {
		constructor(message: string) {
			super(5000, successTemplate, message);
		}
	}
	class LoadingNotify extends ANotify {
		constructor(scope: ng.IScope, message?: string) {
			super(86400000, loadingTemplate, message);
			this.scope = scope;
		}
	}
	export class NotifyService implements INotifyService {
		public static IID: string = "luisNotify";
		public static $inject: Array<string> = ["notify", "$q", "$log", "$rootScope", "$timeout", "$uibModal", "luisConfig"];
		private $q: ng.IQService;
		private $log: ng.ILogService;
		private $rootScope: ng.IRootScopeService;
		private $timeout: ng.ITimeoutService;
		private $uibModal: ng.ui.bootstrap.IModalService;
		private cgNotify: any;
		// private parentElt: ng.IAugmentedJQuery;
		private luisConfig: IConfig;

		constructor(notify: any, $q: angular.IQService, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService, $uibModal: ng.ui.bootstrap.IModalService, luisConfig: IConfig) {
			this.cgNotify = notify;
			this.$q = $q;
			this.$log = $log;
			this.$rootScope = $rootScope;
			this.$timeout = $timeout;
			this.$uibModal = $uibModal;
			this.luisConfig = luisConfig;

			this.cgNotify.config({
				container: this.luisConfig.parentElt,
				startTop: this.luisConfig.startTop,
			});
		}

		public error(message: string, details?: string): void {
			this.$log.error(new Log(message, details));
			this.cgNotify(new ErrorNotify(message));
		}
		public warning(message: string, details?: string): void {
			this.$log.warn(new Log(message, details));
			this.cgNotify(new WarningNotify(message));
		}
		public success(message: string, details?: string): void {
			this.$log.log(new Log(message, details));
			this.cgNotify(new SuccessNotify(message));
		}
		public alert(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean> {
			return this.openModal(alertTemplate, message, okLabel || this.luisConfig.okLabel, cancelLabel || this.luisConfig.cancelLabel, false);
		}
		public confirm(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean> {
			return this.openModal(confirmTemplate, message, okLabel || this.luisConfig.okLabel, cancelLabel || this.luisConfig.cancelLabel, !this.luisConfig.canDismissConfirm);
		}
		public loading(loadingPromise: ng.IPromise<string>, message?: string, cancelFn?: () => void): void {
			let isolateScope: ILoadingIsolateScope = <ILoadingIsolateScope>this.$rootScope.$new(true);
			isolateScope.loading = true;
			isolateScope.calloutClass = "light";
			isolateScope.message = message;

			let popup = this.cgNotify(new LoadingNotify(isolateScope, message));

			let closePopup = (ms: number) => {
				this.$timeout(() => {
					popup.close();
					isolateScope.$destroy();
				}, ms);
			};

			if (!!cancelFn) {
				isolateScope.canCancel = true;
				isolateScope.cancel = () => {
					this.$log.warn(new Log(message, "user cancelled"));
					cancelFn();
					closePopup(0);
				};
			}

			loadingPromise.then((newMessage: string) => {
				isolateScope.message = newMessage;
				isolateScope.calloutClass = "green";
				isolateScope.loading = false;
				closePopup(5000);
			}, (newMessage: string) => {
				isolateScope.message = newMessage;
				isolateScope.calloutClass = "red";
				isolateScope.loading = false;
				this.$log.error(new Log(message, ""));
				closePopup(20000);
			}, (newMessage: string) => {
				isolateScope.message = newMessage;
			});
		}
		private openModal(templateUrl: string, message: string, okLabel: string, cancelLabel: string, preventDismiss: boolean): ng.IPromise<boolean> {
			return this.$uibModal.open({
				templateUrl: templateUrl,
				controller: NotifyModalController.IID,
				size: "mobile",
				resolve: {
					message: (): string => {
						return message;
					},
					okLabel: (): string => {
						return okLabel;
					},
					cancelLabel: (): string => {
						return cancelLabel;
					},
					preventDismiss: (): boolean => {
						return preventDismiss;
					},
				}
			}).result;
		}
	}
	interface INotifyModalScope extends ng.IScope {
		message: string;
		okLabel: string;
		cancelLabel: string;
		ok: () => void;
		cancel: () => void;
	}

	class NotifyModalController {
		public static IID: string = "notifyModalController";
		public static $inject: string[] = ["$scope", "$uibModalInstance", "message", "okLabel", "cancelLabel", "preventDismiss"];
		private doClose: boolean;
		constructor(
			$scope: INotifyModalScope,
			$uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
			message: string,
			okLabel: string,
			cancelLabel: string,
			preventDismiss: boolean
		) {

			$scope.message = message;
			$scope.okLabel = okLabel;
			$scope.cancelLabel = cancelLabel;

			$scope.ok = () => {
				this.doClose = true;
				$uibModalInstance.close(true);
			};
			$scope.cancel = () => {
				this.doClose = true;
				$uibModalInstance.close(false);
			};
			if (preventDismiss) {
				$scope.$on("modal.closing", ($event: ng.IAngularEvent): void => {
					if (!this.doClose) {
						$event.preventDefault();
					}
				});
			}
		}
	}
	angular.module("lui.notify").service(NotifyService.IID, NotifyService);
	angular.module("lui.notify").controller(NotifyModalController.IID, NotifyModalController);
}
