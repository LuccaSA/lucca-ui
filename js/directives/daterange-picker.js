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
				var parsed = parse(ngModelCtrl.$viewValue);
				scope.internal.startsOn = parsed.startsOn;
				scope.internal.endsOn = parsed.endsOn;
				scope.internal.strFriendly = $filter("luifFriendlyRange")(scope.internal);
			};

			drCtrl.updateValue = function(startsOn, endsOn){
				var newValue = ngModelCtrl.$viewValue;
				var formatted = format(startsOn,endsOn);
				newValue[Object.keys(formatted)[0]] = formatted[Object.keys(formatted)[0]];
				newValue[Object.keys(formatted)[1]] = formatted[Object.keys(formatted)[1]];
				ngModelCtrl.$setViewValue(newValue);
			};
			var format = function(startsOn, endsOn){
				var mstart = moment(startsOn);
				var mend = moment(endsOn);
				if(scope.excludeEnd){
					mend.add(1, 'd');
				}
				var startProperty = scope.startProperty || 'startsOn';
				var endProperty = scope.endProperty || 'endsOn';
				var result = {};
				switch(scope.format || "moment"){
					case "moment":
						result[startProperty] = mstart;
						result[endProperty] = mend;
						break;
					case "date":
						result[startProperty] = mstart.toDate();
						result[endProperty] = mend.toDate();
						break;
					default:
						result[startProperty] = mstart.format(scope.format);
						result[endProperty] = mend.format(scope.format);
				}
				return result;
			};
			var parse = function(viewValue){
				var startProperty = scope.startProperty || 'startsOn';
				var endProperty = scope.endProperty || 'endsOn';
				var mstart, mend;
				switch(scope.format || "moment"){
					case "moment":
					case "date":
						mstart = moment(viewValue[startProperty]);
						mend = moment(viewValue[endProperty]);
						break;
					default:
						mstart = moment(viewValue[startProperty], scope.format);
						mend = moment(viewValue[endProperty], scope.format);
				}
				if(scope.excludeEnd){
					mend.add(-1, 'd');
				}
				return { startsOn: mstart.toDate(), endsOn:mend.toDate() };
			};
		}
		return{
			require:['luidDaterange','^ngModel'],
			controller:'luidDaterangeController',
			scope: {
				disabled:'=',

				format:'@', // if you want to bind to moments, dates or a string with a specific format
				startProperty: '@',
				endProperty: '@',

				popoverPlacement:'@',

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
			{label:"LUIDDATERANGE_THIS_MONTH", startsOn: moment().startOf('month').toDate(), endsOn: moment().startOf('month').add(1, "month").add(-1, "day").toDate()},
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
			var className = "";
			if(mode === "day" && moment(date).diff($scope.internal.startsOn) ===0) {
				className = "start";
			}
			if(mode === "day" && moment(date).diff($scope.internal.endsOn) ===0){
				className += "end";
			}
			if(mode === "day" && moment(date).isAfter($scope.internal.startsOn) && moment(date).isBefore($scope.internal.endsOn)) {
				className += "in-between";
			}
			return className;
		};

	}]);


	/**************************/
	/***** TEMPLATEs      *****/
	/**************************/
	angular.module("lui.templates.daterangepicker").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidDaterange.html",
			"<input ng-model='internal.strFriendly' ng-disabled='disabled || popoverOpen' ng-click='togglePopover()'" +
			"popover-template=\"'lui/directives/luidDaterangePopover.html'\"" +
			"popover-placement=\"{{popoverPlacement}}\"" +
			"popover-trigger ='none' popover-is-open='popoverOpened'" +
			"popover-class ='lui daterange popover'" +
			">");
		$templateCache.put("lui/directives/luidDaterangePopover.html",
			"<div class=\"lui clear\">" +
			"	<div class=\"lui vertical pills shortcuts menu\">" +
			"		<a class='lui item' ng-repeat='period in periods' ng-click='goToPeriod(period)'>{{period.label | translate}}</a>" +
			"	</div>" +
			"	<datepicker class='lui datepicker' ng-model='internal.startsOn' show-weeks='false' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></datepicker>" +
			"	<datepicker class='lui datepicker' ng-model='internal.endsOn' show-weeks='false' min-date='internal.startsOn' custom-class='dayClass(date, mode)' ng-change='internalUpdated()'></datepicker>" +
			"</div>" +
			"<footer>" +
			"	<a class='lui right pulled primary button' ng-click='togglePopover()'>{{'LUIDDATERANGE_OK'|translate}}</a>" +
			"</footer>" +
			"");
	}]);

	/**************************/
	/***** TRANSLATIONS   *****/
	/**************************/
	angular.module('lui.translates.daterangepicker').config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('en', {
			"LUIDDATERANGE_SINCE_YEAR_START":"Since year start",
			"LUIDDATERANGE_LAST_MONTH":"Last month",
			"LUIDDATERANGE_THIS_MONTH":"Current month",
			"LUIDDATERANGE_OK":"Ok"
		});
		$translateProvider.translations('de', {

		});
		$translateProvider.translations('es', {

		});
		$translateProvider.translations('fr', {
			"LUIDDATERANGE_SINCE_YEAR_START":"Depuis le debut de l'année",
			"LUIDDATERANGE_LAST_MONTH":"Mois dernier",
			"LUIDDATERANGE_THIS_MONTH":"Mois en cours",
			"LUIDDATERANGE_OK":"Ok"
		});
		$translateProvider.translations('it', {

		});
		$translateProvider.translations('nl', {

		});
	}]);
})();
