module Lui.Service {
	"use strict";
	class Log {
		public message: string;
		public details: string;
		constructor(message: string, details: string) {
			this.message = message;
			this.details = details;
		}
	}
	export interface INotifyConfig {
		parentTagIdClass: string;
		prefix: string;
		startTop: number;
		okLabel: string;
		cancelLabel: string;
		canDismissConfirm: boolean;
	}
	interface ILoadingIsolateScope extends ng.IScope {
		loading: boolean;
		success: boolean;
		failure: boolean;
		cancelled: boolean;
		percentage: number;
		calloutClass: string;
		canCancel: boolean;
		cancel: () => void;
		$close: () => void;
		showProgress: boolean;
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
		// public messageTemplate: string;
		public scope: ng.IScope;

		constructor(duration: number, templateUrl: string, message: string) {
		// constructor(duration: number, templateUrl: string, message: string, messageTemplate: string, scope: ng.IScope) {
			this.duration = duration;
			this.templateUrl = templateUrl;
			this.message = message;
			// this.messageTemplate = messageTemplate;
			// this.scope = scope;
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
	export class NotifyService {
		public static IID: string = "luisNotify";
		public static $inject: Array<string> = ["notify", "$q", "$log", "$rootScope", "$timeout", "$uibModal"];
		private $q: ng.IQService;
		private $log: ng.ILogService;
		private $rootScope: ng.IRootScopeService;
		private $timeout: ng.ITimeoutService;
		private $uibModal: ng.ui.bootstrap.IModalService;
		private cgNotify: any;
		private parentElt: ng.IAugmentedJQuery;
		private conf: INotifyConfig;

		constructor(notify: any, $q: angular.IQService, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService, $uibModal: ng.ui.bootstrap.IModalService) {
			this.cgNotify = notify;
			this.$q = $q;
			this.$log = $log;
			this.$rootScope = $rootScope;
			this.$timeout = $timeout;
			this.$uibModal = $uibModal;
			this.conf = <INotifyConfig>{};
		}

		public config(config: INotifyConfig): void {
			// sets the defaults
			this.conf.parentTagIdClass = config.parentTagIdClass || "body";
			this.conf.prefix = config.prefix || "lui";
			this.conf.startTop = config.startTop || 40;
			this.conf.okLabel = config.okLabel || "Ok";
			this.conf.cancelLabel = config.cancelLabel || "Cancel";
			this.conf.canDismissConfirm = config.canDismissConfirm;

			let byTag = document.getElementsByTagName(this.conf.parentTagIdClass);
			let byId = document.getElementById(this.conf.parentTagIdClass);
			let byClass = document.getElementsByClassName(this.conf.parentTagIdClass);
			if (!!byTag && byTag.length) {
				this.parentElt = angular.element(byTag[0]);
			} else if (!!byId) {
				this.parentElt = angular.element(byId);
			} else if (!!byClass && byClass.length) {
				this.parentElt = angular.element(byClass[0]);
			} else {
				this.$log.warn("luisNotify - could not find a suitable element for tag/id/class: " + this.conf.parentTagIdClass);
				return;
			}
			this.cgNotify.config({
				container: this.parentElt,
				startTop: this.conf.startTop,
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
			return this.openModal(alertTemplate, message, okLabel || this.conf.okLabel, cancelLabel || this.conf.cancelLabel, false);
		}
		public confirm(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean> {
			return this.openModal(confirmTemplate, message, okLabel || this.conf.okLabel, cancelLabel || this.conf.cancelLabel, !this.conf.canDismissConfirm);
		}
		// public loading(loadingPromise: ng.IPromise<string>, message?: string, showProgress: boolean = true, cancelFn?: () => void): void {
		// 	let isolateScope: ILoadingIsolateScope = <ILoadingIsolateScope>this.$rootScope.$new(true);
		// 	isolateScope.loading = true;
		// 	isolateScope.percentage = 0;
		// 	isolateScope.showProgress = showProgress;
		// 	isolateScope.calloutClass = "";

		// 	let cancelled: boolean = false;

		// 	let popup = this.cgNotify(new LoadingNotify(isolateScope, message));

		// 	let closePopup = (ms: number) => {
		// 		this.$timeout(() => {
		// 			popup.close();
		// 			isolateScope.$destroy();
		// 		}, ms);
		// 	};

		// 	if (!!cancelFn) {
		// 		isolateScope.canCancel = true;
		// 		isolateScope.cancel = () => {
		// 			cancelled = true;
		// 			this.$log.warn(new Log(message, "user cancelled"));
		// 			isolateScope.calloutClass += showProgress ? "" : "orange";
		// 			isolateScope.loading = false;
		// 			isolateScope.cancelled = true;
		// 			cancelFn();
		// 			closePopup(10000);
		// 		};
		// 	}

		// 	loadingPromise.then(() => {
		// 		if (!cancelled) {
		// 			isolateScope.percentage = 100;
		// 			isolateScope.calloutClass += showProgress ? "" : "primary";
		// 			isolateScope.loading = false;
		// 			isolateScope.success = true;
		// 			closePopup(5000);
		// 		}
		// 	}, (details: string) => {
		// 		if (!cancelled) {
		// 			isolateScope.calloutClass += "filling red";
		// 			isolateScope.loading = false;
		// 			isolateScope.failure = true;
		// 			this.$log.error(new Log(message, details));
		// 			closePopup(20000);
		// 		}
		// 	}, (percentage: number) => {
		// 		if (!cancelled) {
		// 			isolateScope.percentage = percentage;
		// 		}
		// 	});
		// }
		private openModal(templateUrl: string, message: string, okLabel: string, cancelLabel: string, preventDismiss: boolean): ng.IPromise<boolean> {
			return this.$uibModal.open(<IModalSettings>{
				templateUrl: templateUrl,
				controller: NotifyModalController.IID,
				appendTo: this.parentElt,
				size: "mobile",
				windowClass: this.conf.prefix,
				backdrop: true,
				backdropClass: this.conf.prefix,
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
	// should have been in the nguibs typings :(
	interface IModalSettings extends ng.ui.bootstrap.IModalSettings {
		appendTo: ng.IAugmentedJQuery;
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
	angular.module("lui.services").service(NotifyService.IID, NotifyService);
	angular.module("lui.services").controller(NotifyModalController.IID, NotifyModalController);
}
