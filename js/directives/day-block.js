/* global angular */
(function(){
    'use strict';
    var DayBlockDirective = function () {
        return {
            template : 
            '<div class="day-bloc">'+
            
            '<div ng-style = \'{'+
            'color: controller.firstColor'+
            '}\' '+
            'ng-if = "controller.showDay" class="weekday">{{controller.date | luifMoment: \'dddd\'}}'+
            '</div>'+
            
            '<div ng-style = \'{ '+
            'border: "1px solid " + controller.firstColor, '+
            '"background-color": controller.firstColor, '+
            '"color": controller.secondColor '+
            '}\' class="day">{{controller.date | luifMoment:\'DD\'}}'+
            '</div>'+
            
            '<div ng-style = \'{'+
            '"background-color": controller.secondColor, '+
            ' "border-left" : "1px solid " + controller.firstColor,'+
            ' "border-right" : "1px solid " + controller.firstColor, '+
            ' color: controller.firstColor '+
            '}\' class="month">{{controller.date | luifMoment: \'MMM\' | limitTo : 3}}'+
            '</div>'+
            
            '<div ng-style = \'{'+
            '"background-color": controller.secondColor, '+
            ' "border-left" : "1px solid " + controller.firstColor,'+
            ' "border-right" : "1px solid " + controller.firstColor, '+
            ' "border-bottom" : "1px solid " + controller.firstColor, '+
            ' color: controller.firstColor '+
            '}\'  class="year">{{controller.date | luifMoment: \'YYYY\'}}'+
            '</div>'+
            
            '</div>',

            scope : {
                date: '=',
                showDay: '=',
                firstColor: '=',
                secondColor: '='
            },
            
            restrict : 'E',
            bindToController : true,
            controllerAs : 'controller',
            controller : 'DayBlockController'
        };
    };


    angular
    .module('lui.directives')
    .directive('luidDayBlock', DayBlockDirective)
    .controller('DayBlockController', function(){
        console.log(this);
    });
    
})();


