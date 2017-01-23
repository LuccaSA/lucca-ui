(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - angular translate
	**  - underscore
	**/

	angular.module('lui.translate')
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
			if(mode === 'dictionary' && ngModelCtrl.$viewValue !== undefined){
				_.each(cultures, function(c){
					scope.$watch(function(){ return ngModelCtrl.$viewValue[c]; }, function(){ ngModelCtrl.$render(); });
				});
			}

			ngModelCtrl.$render = function(){
				scope.internal = parse(ngModelCtrl.$viewValue);
			};
			translateCtrl.updateViewValue = function(){
				switch(mode){
					case "dictionary":
						return updateDictionary(scope.internal);
					case "|":
					case "pipe":
						return updatePipe(scope.internal);
					case "[]":
					case "brackets":
						return updateBrackets(scope.internal);
				}
			};

			var parse = function(value){
				switch(mode){
					case "dictionary":
						return parseDictionary(value);
					case "|":
					case "pipe":
						return parsePipe(value);
					case "[]":
					case "brackets":
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
				if(!value){
					return {};
				}
				// value looks like this "en:some stuff|de:|nl:|fr:des bidules|it:|es:"
				var translations = value.split("|");
				var result = {};
				_.each(translations, function(t){
					var key = t.substring(0,2);
					var val = t.substring(3);
					result[key] = val;
				});
				return _.pick(result, cultures);
			};
			var updatePipe = function(value){
				var newVal = _.map(cultures, function(c){
					if(!!value[c]){
						return c + ":" + value[c];
					}
					return c + ":";
				}).join("|");
				ngModelCtrl.$setViewValue(newVal);
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
	angular.module("lui").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidTranslations.html",
			"<div class=\"lui dropdown {{size}} field\" ng-class=\"{open:focused || hovered}\" ng-mouseenter=\"hovered=true\" ng-mouseleave=\"hovered=false\">" +
			"	<div class=\"lui input\">" +
			"		<input type=\"text\" ng-model=\"internal[currentCulture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-change=\"update()\">" +
			"		<span class=\"unit\">{{currentCulture}}</span>" +
			"	</div>" +
			"	<div class=\"dropdown-menu\">" +
			"		<div class=\"lui {{size}} field\" ng-repeat=\"culture in cultures\" ng-if=\"culture !== currentCulture\">" +
			"			<div class=\"lui input\">" +
			"				<input type=\"text\" ng-model=\"internal[culture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-change=\"update()\">" +
			"				<span class=\"unit addon\">{{culture}}</span>" +
			"			</div>" +
			"		</div>" +
			// "		<hr>" +
			// "		<div class=\"lui button right pulled\" ng-click=\"close()\">Ok</div>" +
			"	</div>" +
			"</div>" +
		"");

	}]);
})();
