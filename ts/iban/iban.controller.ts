module Lui.Directives {
	"use strict";

	export class LuidIbanController {
		public static IID: string = "luidIbanController";
		public static $inject: Array<string> = ["$scope"];
		private $scope: ILuidIbanScope;
		private ngModelCtrl: ng.INgModelController;

		constructor($scope: ILuidIbanScope) {
			this.$scope = $scope;
			this.setPatterns();
			this.initScope();
		}

		public setNgModelCtrl(ngModelCtrl: ng.INgModelController): void {
			this.ngModelCtrl = ngModelCtrl;
			this.ngModelCtrl.$render = (): void => {
				let iban = this.getViewValue();
				if (!!iban) {
					this.$scope.countryCode = iban.substring(0, 2);
					this.$scope.controlKey = iban.substring(2, 4);
					this.$scope.bban = iban.substring(4);
				} else {
					this.$scope.countryCode = "";
					this.$scope.controlKey = "";
					this.$scope.bban = "";
				}
			};
			(<ILuidIbanValidators>this.ngModelCtrl.$validators).iban = (): boolean => {
				if (!!this.ngModelCtrl.$viewValue) {
					return IBAN.isValid(ngModelCtrl.$viewValue);
				}
				return true;
			};
		}

		public setPatterns(): void {
			// https://fr.wikipedia.org/wiki/International_Bank_Account_Number
			// 2 letters (country code) + 2 digits (control key) + 11-30 characters (BBAN)
			this.$scope.countryCodePattern = "[a-zA-Z]{2}";
			this.$scope.controlKeyPattern = "\\d{2}";
			this.$scope.bbanPattern = "\\w{11,30}";
		}

		public initScope(): void {
			this.$scope.updateValue = (): void => {
				this.setViewValue(this.$scope.countryCode.toUpperCase() + this.$scope.controlKey.toUpperCase() + this.$scope.bban.toUpperCase());
			};

			this.$scope.pasteIban = (event: ClipboardEvent): void => {
				this.setViewValue(event.clipboardData.getData("text/plain"));
				this.ngModelCtrl.$render();
				(<HTMLInputElement>event.target).blur();
			};

			this.$scope.selectInput = (event: JQueryEventObject): void => {
				(<HTMLInputElement>event.target).select();
			};

			this.$scope.setTouched = () => {
				this.setTouched();
			};
		}

		private getViewValue(): string {
			return <string>this.ngModelCtrl.$viewValue;
		}

		private setViewValue(iban: string): void {
			this.ngModelCtrl.$setViewValue(iban);
			this.ngModelCtrl.$setTouched();
		}
		private setTouched(): void {
			this.ngModelCtrl.$setTouched();
		}
	}

	angular.module("lui.directives").controller(LuidIbanController.IID, LuidIbanController);
}
