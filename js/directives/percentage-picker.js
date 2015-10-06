(function () {
	'use strict';

	angular.module('lui.directives').directive('luidPercentage', ['moment', function (moment) {
		function link(scope, element, attrs, ctrls) {

			var ngModelCtrl = ctrls[1];
			var luidPercentageCtrl = ctrls[0];
			scope.pattern = /^([0-9]+)(\.([0-9]*)?)?$/i;
			if (!attrs.format) {
				scope.format = "0.XX";
			}else if(attrs.format !== "0.XX" && attrs.format !== "1.XX" && attrs.format !== "XX"){
				ngModelCtrl.$render = function () { scope.intPct = "unsupported format"; };
				return;
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$render = function () {
				if (this.$viewValue === undefined) {
					scope.intPct = undefined;
					return;
				}

				// must support the different formats here
				scope.intPct = scope.parse(parseFloat(this.$viewValue));
			};

			// call the ng-change
			ngModelCtrl.$viewChangeListeners.push(function () {
				scope.$eval(attrs.ngChange);
			});

			// bind to various events - here only keypress=enter
			luidPercentageCtrl.setupEvents(element.find('input'));
		}


		return {
			require: ['luidPercentage', '^ngModel'],
			controller: 'luidPercentageController',
			scope: {
				step: '=', // default = 5
				format: '@', // 'XX', '0.XX' or '1.XX', default 0.XX
				ngDisabled: '=',
				placeholder: '@'
			},
			restrict: 'EA',
			link: link,
			template: "<div class='lui short input with addon'><input class='lui right aligned' type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-model='intPct' ng-change='updateValue()' ng-blur='formatInputValue()'><i class='lui right addon'>%</i></div>"
		};
	}])
	.controller('luidPercentageController', ['$scope', 'moment', function ($scope, moment) {

		// public methods for update
		$scope.updateValue = function () {
			if ($scope.intPct === undefined) { return updateWithoutRender(undefined); } 

			// transform this duration into a string
			var newValue = format($scope.intPct);

			// update viewvalue
			updateWithoutRender(newValue);
		};
		var format = function (pct) {
			// should support deifferents formats
			switch($scope.format){
				case "XX":
					return pct;
				case "0.XX":
					return pct/100;
				case "1.XX":
					return pct/100 + 1;
			}
			return 0;
		};

		$scope.parse = function (intInput) {
			// should support deifferents formats
			switch($scope.format){
				case "XX":
					return intInput;
				case "0.XX":
					return Math.round(10000 * intInput) / 100;
				case "1.XX":
					return Math.round((intInput-1) * 10000) / 100;
			}
			return 0;
		};

		// private - updates of some kinds
		// incr value by `step` minutes
		var incr = function (step) {
			var newValue = format(parseFloat($scope.intPct) + step);
			update(newValue);
		};

		// sets viewValue and renders
		var update = function (newValue) {
			$scope.ngModelCtrl.$setViewValue(newValue);
			$scope.ngModelCtrl.$render();
		};
		var updateWithoutRender = function (newValue) {
			$scope.ngModelCtrl.$setViewValue(newValue);
		};

		// display stuff
		$scope.formatInputValue = function () {
			$scope.ngModelCtrl.$render();
		};

		// events - key 'enter'
		this.setupEvents = function (elt) {
			setupKeyEvents(elt);
			setupMousewheelEvents(elt);
		};

		var setupKeyEvents = function (elt) {
			var step = 5;
			if (!isNaN(parseInt($scope.step))) {
				step = parseInt($scope.step);
			}
			elt.bind('keydown', function (e) {
				if (e.which === 38) { // up
					e.preventDefault();
					incr(step);
					$scope.$apply();
				} else if (e.which === 40) { // down
					e.preventDefault();
					incr(-step);
					$scope.$apply();
				}
				if (e.which === 13) { // enter
					e.preventDefault();
					$scope.formatInputValue();
					$scope.$apply();
				}
			});
		};
		var setupMousewheelEvents = function (elt) {
			var step = 5;
			if (!isNaN(parseInt($scope.step))) {
				step = parseInt($scope.step);
			}
			var isScrollingUp = function (e) {
				if (e.originalEvent) {
					e = e.originalEvent;
				}
				//pick correct delta variable depending on event
				var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
				return (e.detail || delta > 0);
			};

			elt.bind('mousewheel wheel', function (e) {
				if (this === document.activeElement) {
					$scope.$apply(incr((isScrollingUp(e)) ? step : -step));
					e.preventDefault();
				}
			});
		};
	}]);
})();
