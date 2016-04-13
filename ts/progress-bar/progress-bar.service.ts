module Lui.Service {
	"use strict";

//==========================================
// ---- inspired by https://github.com/VictorBjelkholm/ngProgress/blob/master/src/provider.js
// ==========================================
	export class ProgressBarService {
		public static IID: string = "progressBarService";
		public static $inject: string[] = ["$document", "$window", "$rootScope", "$timeout", "$interval"];
		public latencyThreshold = 200;
		private httpResquestListening: boolean = false;
		private $document: angular.IDocumentService;
		private $window: angular.IWindowService;
		private $rootScope: ng.IScope;
		private $timeout: ng.ITimeoutService;
		private $interval: ng.IIntervalService;
		private status: number = 0;
		private currentPromiseInterval: ng.IPromise<any>;
		private completeTimeout: ng.IPromise<any>;
		private parent: angular.IAugmentedJQuery = angular.element(document).find("body");
		private progressBarTemplate: string = '<div class="lui slim secondary progressing progress progress-bar"><div class="indicator" data-percentage="0" style="width: 0%;"></div></div>';
		private progressbarEl: angular.IAugmentedJQuery;
		private isStarted: boolean;

		constructor(
			$document: angular.IDocumentService,
			$window: angular.IWindowService,
			$rootScope: ng.IScope,
			$timeout: ng.ITimeoutService,
			$interval: ng.IIntervalService) {
			this.$document = $document;
			this.$window = $window;
			this.$rootScope = $rootScope;
			this.$timeout = $timeout;
			this.$interval = $interval;
		}

		public addProgressBar = (parent?: angular.IAugmentedJQuery) => {
			if (!parent) {
				parent = this.parent;
			}
			if (!!this.progressbarEl) {
				this.progressbarEl.remove();
			}
			this.progressbarEl = angular.element(this.progressBarTemplate);
			parent.append(this.progressbarEl);
		};

		public setColor = (color: string) => {
			this.progressbarEl.children().css("background", color);
		};

		public setHttpResquestListening = (httpResquestListening: boolean): void => {
			this.httpResquestListening = httpResquestListening;
			this.setStatus(0);
		};

		public isHttpResquestListening = (): boolean => {
			return this.httpResquestListening;
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
						this.setStatus(this.status + (0.15 * Math.pow(Math.sqrt(remaining), 1.5)));
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
			if (!!this.completeTimeout) {
				this.$timeout.cancel(this.completeTimeout);
			}
			this.completeTimeout = this.$timeout(() => {
				this.$interval.cancel(this.currentPromiseInterval);
				this.isStarted = false;
				this.httpResquestListening = false;
				this.setStatus(100);
				this.hide();
			}, 200);
		};

		public getDomElement = () => {
			return this.progressbarEl;
		};
	}

	angular.module("lui.services").service(ProgressBarService.IID, ProgressBarService);
}
