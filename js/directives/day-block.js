/* global angular */
(function(){
    'use strict';
    var DayBlockDirective = function () {
        return {
            template : 
            '<div class="day-block">'+
            '<div class="weekday">{{controller.date | amDateFormat: \'dddd\'}}'+
            '</div>'+
            '<div class="day">{{controller.date | amDateFormat:\'DD\'}}</div>'+
            '<div class="month">{{controller.date | amDateFormat: \'MMM\' | limitTo : 3}}'+
            '</div>'+
            '<div class="year">{{controller.date | amDateFormat: \'YYYY\'}}</div>'+
            '</div>,',

            scope : {
            date: '='
            },
            
            restrict : 'E',
            bindToController : true,
            controllerAs : 'controller',
            controller : 'DayBlockController'
        }
    }


    angular
    .module('lui.directives', [])
    .directive('luidDayBlock', DayBlockDirective)
    .controller('DayBlockController', function(){});
    
})()


