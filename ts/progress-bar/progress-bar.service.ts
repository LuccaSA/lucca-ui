module Lui.Service {
	"use strict";

//==========================================
// ---- inspired by https://github.com/VictorBjelkholm/ngProgress/blob/master/src/provider.js
// ==========================================
	export class ProgressBarService {
		public static IID: string = "luisProgressBar";
		public static $inject: string[] = ["$document", "$window", "$timeout", "$interval", "$log"];
		public latencyThreshold = 200;
		private httpResquestListening: boolean = false;
		private httpRequestMethods: string[];
		private $document: angular.IDocumentService;
		private $window: angular.IWindowService;
		private $timeout: ng.ITimeoutService;
		private $interval: ng.IIntervalService;
		private $log: ng.ILogService;
		private status: number = 0;
		private currentPromiseInterval: ng.IPromise<any>;
		private completeTimeout: ng.IPromise<any>;
		private progressBarTemplate: string = '<div class="lui slim progressing progress progress-bar"><div class="indicator" data-percentage="0" style="width: 0%;"></div></div>';
		private progressbarEl: angular.IAugmentedJQuery;
		private isStarted: boolean;

		constructor(
			$document: angular.IDocumentService,
			$window: angular.IWindowService,
			$timeout: ng.ITimeoutService,
			$interval: ng.IIntervalService,
			$log: ng.ILogService) {
			this.$document = $document;
			this.$window = $window;
			this.$timeout = $timeout;
			this.$interval = $interval;
			this.$log = $log;
		}

		public addProgressBar = (parentTagIdClass: string = "body", palette: string = "primary") => {
			let parentElt: angular.IAugmentedJQuery;
			// angular.element(document).find("body")
			let byTag = document.getElementsByTagName(parentTagIdClass);
			let byId = document.getElementById(parentTagIdClass);
			let byClass = document.getElementsByClassName(parentTagIdClass);
			if (!!byTag && byTag.length) {
				parentElt = angular.element(byTag[0]);
			} else if (!!byId) {
				parentElt = angular.element(byId);
			} else if (!!byClass && byClass.length) {
				parentElt = angular.element(byClass[0]);
			} else {
				this.$log.warn("luisProgressBar - could not find a suitable element for tag/id/class: " + parentTagIdClass);
				return;
			}
			if (!!this.progressbarEl) {
				this.progressbarEl.remove();
			}
			this.progressbarEl = angular.element(this.progressBarTemplate);
			this.progressbarEl.addClass(palette);
			parentElt.append(this.progressbarEl);
		};

		public startListening = ( httpRequestMethods?: string[]): void => {
			this.httpResquestListening = true;
			if (!!httpRequestMethods) {
				this.httpRequestMethods = httpRequestMethods;
			} else {
				this.httpRequestMethods = ["GET"];
			}
			this.setStatus(0);
		};

		public stopListening = (): void => {
			this.httpResquestListening = false;
			this.setStatus(0);
		};

		public isHttpResquestListening = (): boolean => {
			return this.httpResquestListening;
		};

		public getHttpRequestMethods = (): string[] => {
			return this.httpRequestMethods;
		};

		public start = () => {
			if (!this.isStarted) {
				this.isStarted = true;
				this.$timeout.cancel(this.completeTimeout);
				this.$interval.cancel(this.currentPromiseInterval);
				this.show();
				this.currentPromiseInterval = this.$interval(() => {
					if (isNaN(this.status)) {
						this.$interval.cancel(this.currentPromiseInterval);
						this.setStatus(0);
						this.hide();
					} else {
						let remaining = 100 - this.status;
						if (remaining > 30) {
							this.setStatus(this.status + (0.5 * Math.sqrt(remaining)));
						} else {
							this.setStatus(this.status + (0.15 * Math.pow(1 - Math.sqrt(remaining), 2)));
						}
					}
				}, this.latencyThreshold);
			}
		};

		public hide = () => {
			this.$timeout(() => {
				if (!!this.progressbarEl) {
					this.progressbarEl.removeClass("in");
					this.progressbarEl.addClass("out");
					this.setStatus(0);
				}
			}, 300);
		};

		public show = () => {
			if (!!this.progressbarEl) {
				this.progressbarEl.removeClass("out");
				this.progressbarEl.addClass("in");
				this.setStatus(0);
			}
		};

		public setStatus = (status: number) => {
			this.status = status;
			if (!!this.progressbarEl) {
				this.progressbarEl.children().css("width", this.status + "%");
				this.progressbarEl.children().attr("data-percentage", this.status);
			}
		};

		public complete = () => {
			this.$interval.cancel(this.currentPromiseInterval);
			this.isStarted = false;
			this.httpResquestListening = false;
			this.setStatus(100);
			this.hide();
		};

		public getDomElement = () => {
			return this.progressbarEl;
		};
	}

	angular.module("lui.services").service(ProgressBarService.IID, ProgressBarService);
}
