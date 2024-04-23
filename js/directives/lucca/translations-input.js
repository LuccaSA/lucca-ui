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
				var languagesToCodes = { en: 1033, de: 1031, es: 1034, fr: 1036, it: 1040, nl: 1043, pt: 2070 };

				/** List of all the available languages labels */
				var cultures = _.keys(languagesToCodes);
				scope.cultures = cultures;

				scope.currentCulture = $translate.preferredLanguage() || "en";

				var mode = !!attrs.mode ? attrs.mode : "dictionary";
				if (mode === "dictionary" && ngModelCtrl.$viewValue !== undefined) {
					_.each(cultures, function (culture) {
						scope.$watch(
							function () { return !!ngModelCtrl.$viewValue ? ngModelCtrl.$viewValue[culture] : ngModelCtrl.$viewValue; },
							function () { ngModelCtrl.$render(); }
						);
					});
				}

				ngModelCtrl.$render = function () {
					scope.internal = parse(ngModelCtrl.$viewValue);
					translateCtrl.updateTooltip();
				};

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

				translateCtrl.updateTooltip = function () {
					var tooltipText = "";
					if(!!!scope.internal) {
						scope.tooltipText = undefined;
						return;
					}
					for(var i = 0; i < scope.cultures.length; i++) {
						if(!!scope.internal[scope.cultures[i]]) {
							tooltipText += "["+scope.cultures[i].toUpperCase()+"] : "+ scope.internal[scope.cultures[i]] + "\n";
						}
					}
					scope.tooltipText = tooltipText;
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
					isDisabled: "=ngDisabled"
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
			$scope.update = function () { ctrl.updateViewValue(); ctrl.updateTooltip(); };

			/******************
			* FOCUS & BLUR    *
			******************/

			$scope.focusInput = function () {
				$scope.focused = true;
			};
			$scope.blurInput = function () {
				$scope.focused = false;
			};

			$scope.blurOnEnter = function($event) {
				$event.target.blur();
				$event.preventDefault();
			};
		}]);

	/**************************/
	/***** TEMPLATES      *****/
	/**************************/
	angular.module("lui").run(["$templateCache", function ($templateCache) {
		$templateCache.put("lui/directives/luidTranslations.html",
			"<div class=\"lui dropdown {{size}} field\" ng-class=\"{open:focused}\" tooltip-class=\"lui\" tooltip-placement=\"top\"  uib-tooltip=\"{{tooltipText}}\">" +
			"	<div class=\"lui input\">" +
			"		<input type=\"text\" ng-disabled=\"isDisabled\" ng-model=\"internal[currentCulture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-keypress=\"$event.keyCode === 13 && blurOnEnter($event)\" ng-change=\"update()\">" +
			"		<span class=\"unit\">{{currentCulture}}</span>" +
			"	</div>" +
			"	<div class=\"dropdown-menu\">" +
			"		<div class=\"lui {{size}} field\" ng-repeat=\"culture in cultures\" ng-if=\"culture !== currentCulture\">" +
			"			<div class=\"lui input\">" +
			"				<input type=\"text\" ng-disabled=\"isDisabled\" ng-model=\"internal[culture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-keypress=\"$event.keyCode === 13 && blurOnEnter($event)\" ng-change=\"update()\">" +
			"				<span class=\"unit addon\">{{culture}}</span>" +
			"			</div>" +
			"		</div>" +
			"	</div>" +
			"</div>" +
			"");
	}]);
})();
