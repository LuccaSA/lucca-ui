(function () {
	"use strict";

	/**
	 ** DEPENDENCIES
	 **  - angular translate
	 **  - underscore
	 **/

	angular.module("lui.translate")
		.directive("luidTranslations", ["$translate", "_", "$filter", "$timeout", function ($translate, _, $filter, $timeout) {
			function link(scope, element, attrs, ctrls) {
				var ngModelCtrl = ctrls[1];
				var translateCtrl = ctrls[0];

				/** Associations language/code */
				var languagesToCodes = { en: 1033, de: 1031, es: 1034, fr: 1036, it: 1040, nl: 2067 };
				/** Associations code/language */
				var codesToLanguages = { 1033: "en", 1031: "de", 1034: "es", 1036: "fr", 1040: "it", 2067: "nl" };
				/* Fallback language (sorted) */
				var fallbackLanguages = ["en", "fr", "de", "es", "it", "nl"];

				/** List of all the available languages labels */
				var cultures = _.keys(languagesToCodes);
				scope.cultures = cultures;

				scope.currentCulture = $translate.preferredLanguage() || fallbackLanguages[0];

				var mode = !!attrs.mode ? attrs.mode : "dictionary";
				if (mode === "dictionary" && ngModelCtrl.$viewValue !== undefined) {
					_.each(cultures, function (culture) {
						scope.$watch(
							function () { return !!ngModelCtrl.$viewValue ? ngModelCtrl.$viewValue[culture] : ngModelCtrl.$viewValue; },
							function () { ngModelCtrl.$render(); }
						);
					});
				}

				ngModelCtrl.$render = function () { scope.internal = parse(ngModelCtrl.$viewValue); };
				translateCtrl.updateViewValue = function () {
					switch (mode) {
						case "dictionary":
							return updateDictionary(scope.internal);
						case "|":
						case "pipe":
							return updatePipe(scope.internal);
						case "lucca":
							return updateLucca(scope.internal);
					}
				};

				var parse = function (value) {
					if (value === undefined) { return undefined; }
					switch (mode) {
						case "dictionary":
							return parseDictionary(value);
						case "|":
						case "pipe":
							return parsePipe(value);
						case "lucca":
							return parseLucca(value);
						default:
							return undefined;
					}
				};

				// Mode lucca
				var parseLucca = function (value) {
					return _.reduce(cultures, function (memo, culture) {
						var targetLabel = _.findWhere(value, { cultureCode: languagesToCodes[culture] });
						memo[culture] = !!targetLabel ? targetLabel.value : undefined;
						// We need to keep the original id
						memo[culture + "_id"] = !!targetLabel ? targetLabel.id : undefined;
						return memo;
					}, {});
				};
				var updateLucca = function (value) {
					var allEmpty = true;
					var viewValue = [];
					_.each(cultures, function (culture) {
						if (!!value[culture] && value[culture] !== "") {
							viewValue.push({ id: value[culture + "_id"], cultureCode: languagesToCodes[culture], value: value[culture] });
							allEmpty = false;
						}
					});
					ngModelCtrl.$setViewValue(allEmpty ? undefined : viewValue);
					scope.$parent.$eval(attrs.ngChange);
				};

				// Mode dictionary
				var parseDictionary = function (value) {
					return _.reduce(cultures, function (memo, culture) {
						memo[culture] = value[culture];
						return memo;
					}, {});
				};
				var updateDictionary = function (value) {
					var allEmpty = true;
					var viewValue = {};
					_.each(cultures, function (culture) {
						viewValue[culture] = value[culture];
						allEmpty &= value[culture] === undefined || value[culture] === "";
					});
					ngModelCtrl.$setViewValue(allEmpty ? undefined : viewValue);
					scope.$parent.$eval(attrs.ngChange); // needs to be called manually cuz the object ref of the $viewValue didn't change
				};

				// Mode pipe
				var parsePipe = function (value) {
					// value looks like this "en:some stuff|de:|nl:|fr:des bidules|it:|es:"
					var translations = value.split("|");
					var result = {};
					_.each(translations, function (t) {
						var key = t.substring(0, 2);
						var val = t.substring(3);
						result[key] = val;
					});
					return _.pick(result, cultures);
				};
				var updatePipe = function (value) {
					if (!_.find(cultures, function (culture) { return value[culture] !== undefined && value[culture] !== ""; })) {
						ngModelCtrl.$setViewValue(undefined);
					} else {
						var newVal = _.map(cultures, function (c) {
							if (!!value[c]) {
								return c + ":" + value[c];
							}
							return c + ":";
						}).join("|");
						ngModelCtrl.$setViewValue(newVal);
					}
				};
			}
			return {
				require: ['luidTranslations', '^ngModel'],
				controller: 'luidTranslationsController',
				scope: {
					mode: '@', // allowed values: "pipe" (or "|"), "dictionary", "lucca" (lucca proprietary format)
					size: "@", // the size of the input (short, long, x-long, fitting)
				},
				templateUrl: "lui/directives/luidTranslations.html",
				restrict: 'EA',
				link: link
			};
		}])
		.controller('luidTranslationsController', ['$scope', '$translate', '$timeout', function ($scope, $filter, $timeout) {
			var ctrl = this;
			/******************
			* UPDATE          *
			******************/
			$scope.update = function () { ctrl.updateViewValue(); };

			/******************
			* FOCUS & BLUR    *
			******************/
			var blurTimeout;
			$scope.focusInput = function () {
				if (!!blurTimeout) {
					$timeout.cancel(blurTimeout);
					blurTimeout = undefined;
				}
				$scope.focused = true;
			};
			$scope.blurInput = function () {
				blurTimeout = $timeout(function () {
					$scope.focused = false;
				}, 500);
			};

		}]);

	/**************************/
	/***** TEMPLATES      *****/
	/**************************/
	angular.module("lui").run(["$templateCache", function ($templateCache) {
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
			"	</div>" +
			"</div>" +
			"");
	}]);
})();
