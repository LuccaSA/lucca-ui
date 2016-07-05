module Lui {
	"use strict";
	export interface IConfig {
		parentTagIdClass?: string;
		parentElt?: ng.IAugmentedJQuery;
		prefix?: string;
		startTop?: number;
		okLabel?: string;
		cancelLabel?: string;
		canDismissConfirm?: boolean;
		cropLabel?: string;
		noCropLabel?: string;
	}
}
module Lui.Service {
	"use strict";
	export interface IConfigProvider {
		setConfig(config: IConfig): void;
	}
	class LuipConfig implements IConfigProvider {
		public static $inject: Array<string> = ["$uibModalProvider"];
		public $get = ["$log", ($log: ng.ILogService): Config => {
			return new Config(this.config, $log);
		}];
		private config: IConfig = {};
		private $uibModalProvider: ng.ui.bootstrap.IModalProvider;
		constructor($uibModalProvider: ng.ui.bootstrap.IModalProvider) {
			this.$uibModalProvider = $uibModalProvider;
		}
		public setConfig(config: IConfig): void {
			this.config = config;
			let conf = new Config(this.config);
			this.configureNguibs(conf);
		}
		private configureNguibs(config: IConfig): void {
			this.$uibModalProvider.options = <ng.ui.bootstrap.IModalSettings & { appendTo: ng.IAugmentedJQuery }>{
				windowClass: config.prefix,
				backdropClass: config.prefix,
				animation: true,
				backdrop: true,
				appendTo: config.parentElt,
				size: "large",
			}
		}
	}
	class Config implements IConfig {
		public parentTagIdClass: string;
		public parentElt: ng.IAugmentedJQuery;
		public prefix: string;
		public startTop: number;
		public okLabel: string;
		public cancelLabel: string;
		public canDismissConfirm: boolean;
		constructor(conf: IConfig, $log?: ng.ILogService, cgNotify?: any) {
			_.extend(this, conf);
			// find the parent element where we'll append all modals
			if (!this.parentElt && !!this.parentTagIdClass) {
				let parentTagIdClass = this.parentTagIdClass || "body";
				let byTag = document.getElementsByTagName(parentTagIdClass);
				let byId = document.getElementById(parentTagIdClass);
				let byClass = document.getElementsByClassName(parentTagIdClass);
				if (!!byTag && byTag.length) {
					this.parentElt = angular.element(byTag[0]);
				} else if (!!byId) {
					this.parentElt = angular.element(byId);
				} else if (!!byClass && byClass.length) {
					this.parentElt = angular.element(byClass[0]);
				} else if (!!$log) {
					$log.warn("luisConfig - could not find a suitable element for tag/id/class: " + parentTagIdClass);
				}
			}
			// default values
			this.prefix = this.prefix || "lui";
			this.startTop = this.startTop || 40;
			this.okLabel = this.okLabel || "Ok";
			this.cancelLabel = this.cancelLabel || "Cancel";
			this.canDismissConfirm = this.canDismissConfirm;
		}
	}
	angular.module("lui.services").provider("luisConfig", LuipConfig);
}
