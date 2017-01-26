module Lui.Directives.Test {
	"use strict";

	describe("luidUserPicker", () => {
		let $scope: ng.IScope;
		let $httpBackend: ng.IHttpBackendService;
		let $timeout: ng.ITimeoutService;
		let $compile: ng.ICompileService;
		let $q: ng.IQService;
		let service: Lui.Directives.IUserPickerService;

		beforeEach(inject((
			_$rootScope_: ng.IRootScopeService,
			_$compile_: ng.ICompileService,
			_$httpBackend_: ng.IHttpBackendService,
			_$timeout_: ng.ITimeoutService,
			_$q_: ng.IQService,
			userPickerService: Lui.Directives.IUserPickerService) => {

			$scope = _$rootScope_.$new();
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
			$compile = _$compile_;
			$q = _$q_;
			service = userPickerService;
		}));

		describe("it should do stuff", () => {
			it("should also do things", () => {
				// let scope = <ILuidUserPickerScope>$scope;
				// let controller = new LuidUserPickerController(scope, $q, service);

				// controller.setNgModelCtrl(ngModelCtrl, false);
			});
		});
	});
}