(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - moment
	**  - ui bootstrap datepicker
	**  - ui bootstrap popover
	**/

	angular.module('lui.directives')
	.directive('luidDaterange', ['moment', function(moment){
		function link(scope, element, attrs, ctrls){
			var ngModelCtrl = ctrls[1];
			var drCtrl = ctrls[0];

		}
		return{
			require:['luidDaterange','^ngModel'],
			controller:'luidDaterangeController',
			scope: {
				disabled:'=',
			},
			templateUrl:"lui/directives/luidDaterange.html",
			restrict:'EA',
			link:link
		};
	}])
	.controller('luidDaterangeController', ['$scope', 'moment', function($scope, $timeout, moment){

		// Popover display
		$scope.popoverOpened = false;
		$scope.togglePopover = function(){
			$scope.popoverOpened = !$scope.popoverOpened;
		};
	}]);
	angular.module("lui.templates.daterangepicker").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidDaterange.html",
			"<input ng-model='strFriendly' ng-disabled='disabled || popoverOpen' ng-click='togglePopover()'" + 
			"popover-template=\"'lui/directives/luidDaterangePopover.html'\"" + 
			"popover-trigger ='none' popover-is-open='popoverOpened'" + 
			"popover-class ='lui nguibs-popover'" + 
			">");
		$templateCache.put("lui/directives/luidDaterangePopover.html",
			"<div>test</div>" + 
			"");
	}]);
})();
