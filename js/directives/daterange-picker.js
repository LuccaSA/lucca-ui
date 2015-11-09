(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - moment
	**  - ui bootstrap datepicker
	**  - ui bootstrap popover
	**/

	angular.module('lui.directives')
	.directive('luidDaterange', ['moment', '$filter', function(moment, $filter){
		function link(scope, element, attrs, ctrls){
			var ngModelCtrl = ctrls[1];
			var drCtrl = ctrls[0];
			scope.internal={};
			ngModelCtrl.$render = function(){
				scope.internal.startsOn = moment(ngModelCtrl.$viewValue.startsOn);
				scope.internal.endsOn = moment(ngModelCtrl.$viewValue.endsOn);
				if(scope.excludeEnd){
					scope.internal.endsOn = moment(scope.internal.endsOn).add(1,'d').toDate();
				}
				scope.internal.strFriendly = $filter("luifFriendlyRange")(scope.internal);
			};

			drCtrl.updateValue = function(startsOn, endsOn){
				if(scope.excludeEnd){
					ngModelCtrl.$setViewValue({startsOn: startsOn, endsOn: moment(endsOn).add(1,'day').toDate()});
				}else{
					ngModelCtrl.$setViewValue({startsOn: startsOn, endsOn: endsOn});
				}
			};
		}
		return{
			require:['luidDaterange','^ngModel'],
			controller:'luidDaterangeController',
			scope: {
				disabled:'=',

				excludeEnd:'=', // user will see "oct 1st - 31st" and the $viewvalue will be "oct 1st - nov 1st"
			},
			templateUrl:"lui/directives/luidDaterange.html",
			restrict:'EA',
			link:link
		};
	}])
	.controller('luidDaterangeController', ['$scope', 'moment', '$filter', function($scope, moment, $filter){
		var ctrl = this;

		$scope.periods = [
			{label:"LUIDDATERANGE_SINCE_YEAR_START", startsOn: moment().startOf('year').toDate(), endsOn: moment().startOf('d').toDate()},
			{label:"LUIDDATERANGE_LAST_MONTH", startsOn: moment().startOf('month').add(-1, 'months').toDate(), endsOn: moment().startOf('month').add(-1, 'd').toDate()},
			{label:"LUIDDATERANGE_THIS_MONTH", startsOn: moment().startOf('month').toDate(), endsOn: moment().endOf('month').toDate()},
		];

		$scope.internalUpdated = function(){
			if(moment($scope.internal.startsOn).diff($scope.internal.endsOn) > 0){
				$scope.internal.endsOn = moment($scope.internal.startsOn);
			}
			ctrl.updateValue($scope.internal.startsOn, $scope.internal.endsOn);
			$scope.internal.strFriendly = $filter("luifFriendlyRange")($scope.internal);
		};

		$scope.goToPeriod = function(period){
			$scope.internal.startsOn = period.startsOn;
			$scope.internal.endsOn = period.endsOn;
			$scope.internalUpdated();
		};

		// Popover display
		$scope.popoverOpened = false;
		$scope.togglePopover = function(){
			$scope.popoverOpened = !$scope.popoverOpened;
		};

		// datepickers stuff
		$scope.dayClass = function(date, mode){
			if(mode === "day" && moment(date).diff($scope.internal.startsOn) >=0 && moment(date).diff($scope.internal.endsOn) <= 0){
				return "in-between";
			}
		};

	}]);
	angular.module("lui.templates.daterangepicker").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidDaterange.html",
			"<input ng-model='internal.strFriendly' ng-disabled='disabled || popoverOpen' ng-click='togglePopover()'" + 
			"popover-template=\"'lui/directives/luidDaterangePopover.html'\"" + 
			"popover-trigger ='none' popover-is-open='popoverOpened'" + 
			"popover-class ='lui nguibs-popover'" + 
			">");
		$templateCache.put("lui/directives/luidDaterangePopover.html",
			"<div class='lui button' ng-repeat='period in periods' ng-click='goToPeriod(period)'>{{period.label | translate}}</div>" + 
			"<div class='lui primary button' ng-click='togglePopover()'>{{'LUIDDATERANGE_OK'|translate}}</div>" + 
			"<datepicker class='lui nguibs-datepicker' ng-model='internal.startsOn' show-weeks='false' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></datepicker>" + 
			"<datepicker class='lui nguibs-datepicker' ng-model='internal.endsOn' show-weeks='false' min-date='internal.startsOn' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></datepicker>" + 
			"");
	}]);
})();
