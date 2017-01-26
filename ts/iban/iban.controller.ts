module lui.iban {
	"use strict";

	export class LuidIbanController {
		public static IID: string = "luidIbanController";
		public static $inject: Array<string> = ["$scope", "iban"];
		private $scope: ILuidIbanScope;
		private ngModelCtrl: ng.INgModelController;
		private countryInput: ng.IAugmentedJQuery;
		private controlInput: ng.IAugmentedJQuery;
		private bbanInput: ng.IAugmentedJQuery;

		private ibanChecker: IBANStatic;

		constructor($scope: ILuidIbanScope, iban: IBANStatic) {
			this.$scope = $scope;
			this.ibanChecker = iban;
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
					return this.ibanChecker.isValid(ngModelCtrl.$viewValue);
				}
				return true;
			};
		}

		public setInputs(elt: ng.IAugmentedJQuery): void {
			let inputs = elt.find("input");
			this.countryInput = angular.element(inputs[0]);
			this.controlInput = angular.element(inputs[1]);
			this.bbanInput = angular.element(inputs[2]);
		}

		private initScope(): void {
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

			this.$scope.controlKeyMappings = {
				8: () => { // backspace
					if (!this.$scope.controlKey) {
						this.focusCountryInput();
					}
				}
			};
			this.$scope.bbanMappings = {
				8: () => { // backspace
					if (!this.$scope.bban) {
						this.focusControlInput();
					}
				}
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

		private focusCountryInput(): void {
			this.countryInput[0].focus();
			this.countryInput[0]["selectionStart"] = this.countryInput[0]["selectionEnd"];
		}
		private focusControlInput(): void {
			this.controlInput[0].focus();
			this.controlInput[0]["selectionStart"] = this.controlInput[0]["selectionEnd"];
		}
	}

	angular.module("lui.iban").controller(LuidIbanController.IID, LuidIbanController);
}
