/// <reference path='../references.ts' />
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
		public static $inject: Array<string> = ["notify", "$q", "$log", "$rootScope", "$timeout"];
		private $q: ng.IQService;
		private $log: ng.ILogService;
		private $rootScope: ng.IRootScopeService;
		private $timeout: ng.ITimeoutService;
		private cgNotify: any;

		constructor(notify: any, $q: angular.IQService, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService) {
			this.cgNotify = notify;
			this.$q = $q;
			this.$log = $log;
			this.$rootScope = $rootScope;
			this.$timeout = $timeout;
		}

		public error(message: string, details: string): void {
			this.$log.error(new Log(message, details));
			this.cgNotify(new ErrorNotify(message));
		}
		public warning(message: string, details: string): void {
			this.$log.warn(new Log(message, details));
			this.cgNotify(new WarningNotify(message));
		}
		public success(message: string, details: string): void {
			this.$log.log(new Log(message, details));
			this.cgNotify(new SuccessNotify(message));
		}
		public loading(loadingPromise: ng.IPromise<string>, message?: string, showProgress: boolean = true, cancelFn?: () => void): void {
			let isolateScope: ILoadingIsolateScope = <ILoadingIsolateScope>this.$rootScope.$new(true);
			isolateScope.loading = true;
			isolateScope.percentage = 0;
			isolateScope.showProgress = showProgress;
			isolateScope.calloutClass = "";

			let cancelled: boolean = false;

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
					cancelled = true;
					this.$log.warn(new Log(message, "user cancelled"));
					isolateScope.calloutClass += showProgress ? "" : "orange";
					isolateScope.loading = false;
					isolateScope.cancelled = true;
					cancelFn();
					closePopup(10000);
				};
			}

			loadingPromise.then(() => {
				if (!cancelled) {
					isolateScope.percentage = 100;
					isolateScope.calloutClass += showProgress ? "" : "primary";
					isolateScope.loading = false;
					isolateScope.success = true;
					closePopup(5000);
				}
			}, (details: string) => {
				if (!cancelled) {
					isolateScope.calloutClass += "filling red";
					isolateScope.loading = false;
					isolateScope.failure = true;
					this.$log.error(new Log(message, details));
					closePopup(20000);
				}
			}, (percentage: number) => {
				if (!cancelled) {
					isolateScope.percentage = percentage;
				}
			});
		}

	}
	angular.module("lui.services").service(NotifyService.IID, NotifyService);
	angular.module("lui.translates.notify").config(["$translateProvider", function($translateProvider) {
		$translateProvider.translations('en', {
			"NOTIFY_SUCCESS": "Success",
			"NOTIFY_WARNING": "Warning",
			"NOTIFY_ERROR": "Error",
			"NOTIFY_LOADING": "Loading..."
		});
		$translateProvider.translations("de", {

		});
		$translateProvider.translations("es", {

		});
		$translateProvider.translations("fr", {
			"NOTIFY_SUCCESS": "Succès",
			"NOTIFY_WARNING": "Attention",
			"NOTIFY_ERROR": "Erreur",
			"NOTIFY_LOADING": "En cours..."
		});
		$translateProvider.translations("it", {

		});
		$translateProvider.translations("nl", {

		});
	}]);

}
