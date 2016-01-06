/* global angular */
(function(){
	'use strict';
	var DayBlockDirective = function () {
		return {
			template : 
			'<div>'+

			'<div ng-style="controller.weekdayStyleOverride()" '+
			'ng-if = "controller.showDay" class="weekday">{{controller.date | luifMoment: \'dddd\'}}'+
			'</div>'+

			'<div ng-style="controller.dayStyleOverride()" ' +
			'class="day">{{controller.date | luifMoment:\'DD\'}}'+
			'</div>'+

			'<div ng-style="controller.monthStyleOverride()" ' +
			'class="month">{{controller.date | luifMoment: \'MMM\' | limitTo : 3}}'+
			'</div>'+

			'<div ng-style="controller.yearStyleOverride()" ' +
			'class="year">{{controller.date | luifMoment: \'YYYY\'}}'+
			'</div>'+

			'</div>',

			scope : {
				date: '=',
				showDay: '=',
				customForegroundColor: '=',
				customBackgroundColor: '='
			},

			restrict : 'E',
			bindToController : true,
			controllerAs : 'controller',
			controller : 'luidDayBlockController'
		};
	};


	angular
	.module('lui.directives')
	.directive('luidDayBlock', DayBlockDirective)
	.controller('luidDayBlockController', function(){
		var controller = this;

		controller.weekdayStyleOverride = function() {
			return { 
				color: controller.customForegroundColor, 
			};
		};
		controller.dayStyleOverride = function() {
			return { 
				"background-color": controller.customForegroundColor, 
				"border-color": controller.customForegroundColor, 
				"color": controller.customBackgroundColor, 
			};
		};
		controller.monthStyleOverride = function() {
			return { 
				"background-color": controller.customBackgroundColor, 
				"border-color": controller.customForegroundColor, 
				"color": controller.customForegroundColor, 
			};
		};
		controller.yearStyleOverride = function() {
			return { 
				"background-color": controller.customBackgroundColor, 
				"border-color": controller.customForegroundColor, 
				"color": controller.customForegroundColor, 
			};
		};


	});

})();


