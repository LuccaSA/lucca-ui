(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - angular translate
	**  - underscore
	**/

	angular.module('lui.directives')
	.directive('luidTranslations', ['$translate', '_', '$filter', '$timeout', function($translate, _, $filter,  $timeout){
		function link(scope, element, attrs, ctrls){
			var ngModelCtrl = ctrls[1];
			var translateCtrl = ctrls[0];

			var cultures = ['en', 'de', 'es', 'fr', 'it', 'nl'];
			scope.cultures = cultures;
			// need the current culture to
			var currentCulture = $translate.preferredLanguage() || "en";
			scope.currentCulture = currentCulture;

			// default mode is dictionary
			var mode = 'dictionary';
			if(!!attrs.mode){
				mode = scope.mode;
			}
			if(mode === 'dictionary' && !!ngModelCtrl.$viewValue){
				_.each(cultures, function(c){
					$scope.$watch(function(){ return ngModelCtrl.$viewValue[c]; }, function(){ ngModelCtrl.$render(); });
				});
			}

			ngModelCtrl.$render = function(){
				scope.internal = parse(ngModelCtrl.$viewValue);
			};
			translateCtrl.updateViewValue = function(){
				switch(mode){
					case "dictionary":
						return updateDictionary(scope.internal);
					case "|", "pipe":
						return updatePipe(scope.internal);
					case "[]", "brackets":
						return updateBrackets(scope.internal);
				}
			};

			var parse = function(value){
				switch(mode){
					case "dictionary":
						return parseDictionary(value);
					case "|", "pipe":
						return parsePipe(value);
					case "[]", "brackets":
						return parseBrackets(value);
					default:
						return {};
				}
			};

			// mode dictionary
			var parseDictionary = function(value){
				return _.reduce(cultures, function(memo, c){
					memo[c] = value[c];
					return memo;
				}, {});
			};
			var updateDictionary = function(value){
				_.each(cultures, function(c){
					ngModelCtrl.$viewValue[c] = value[c];
				});
				ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
				scope.$parent.$eval(attrs.ngChange); // needs to be called manually cuz the object ref of the $viewValue didn't change
			};
			// mode pipe
			var parsePipe = function(value){
				return {};
			};
			// mode brackets
			var parseBrackets = function(value){
				return {};
			};

		}
		return{
			require:['luidTranslations','^ngModel'],
			controller:'luidTranslationsController',
			scope: {
				// disabled:'=',

				mode:'@', // allowed values: "|" "pipe", "[]" "brackets", "dictionary"

				size:"@", // the size of the input (short, long, x-long, fitting)
			},
			templateUrl:"lui/directives/luidTranslations.html",
			restrict:'EA',
			link:link
		};
	}])
	.controller('luidTranslationsController', ['$scope', '$translate', '$timeout', function($scope, $filter, $timeout){
		var ctrl = this;
		/******************
		* UPDATE          *
		******************/
		$scope.update = function(){
			ctrl.updateViewValue();
		};


		/******************
		* FOCUS & BLUR    *
		******************/
		var blurTimeout;
		$scope.focusInput = function(){
			if(!!blurTimeout){
				$timeout.cancel(blurTimeout);
				blurTimeout = undefined;
			}
			$scope.focused = true;
		};
		$scope.blurInput = function(){
			blurTimeout = $timeout(function(){
				$scope.focused = false;
			}, 500);
		};

	}]);


	/**************************/
	/***** TEMPLATEs      *****/
	/**************************/
	angular.module("lui.templates.translationsinput").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidTranslations.html",
			"<div class=\"luid-translations {{size}}\" ng-class=\"{open:focused || hovered}\" ng-mouseenter=\"hovered=true\" ng-mouseleave=\"hovered=false\">" +
			"	<div class=\"lui {{size}} input with addon\">" +
			"		<input type=\"text\" ng-model=\"internal[currentCulture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-change=\"update()\">" +
			"		<span class=\"lui right addon\">{{currentCulture}}</span>" +
			"	</div>" +
			"	<div class=\"lui luid-translations-dropdown\" ng-class=\"{hidden: !focused && !hovered}\">" +
			"		<div class=\"lui {{size}} input with addon\" ng-repeat=\"culture in cultures\" ng-if=\"culture !== currentCulture\">" +
			"			<input type=\"text\" ng-model=\"internal[culture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-change=\"update()\">" +
			"			<span class=\"lui right addon\">{{culture}}</span>" +
			"		</div>" +
			// "		<hr>" +
			// "		<div class=\"lui button right pulled\" ng-click=\"close()\">Ok</div>" +
			"	</div>" +
			"</div>" +
		"");

	}]);
})();
