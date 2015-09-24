(function () {
	'use strict';

	angular.module('lui.directives').directive('luidSelect', [function () {
		return {
			require: '^ngModel',
			scope: {
				options: '=', 
				placeholder: '@',
				displayProp:'@',

				ngDisabled:'=',

				classes:'@', 

				onSelect:'&',
				onRemove:'&'
			},
			restrict: 'E',
			template:
			'<ui-select theme="bootstrap" on-select="onSelect()" on-remove="onRemove()" class="lui nguibs-ui-select {{classes}}" ng-disabled="ngDisabled">' + 
			'	<ui-select-match placeholder="{{placeholder}}">{{$select.selected[displayProp]}}</ui-select-match>' + 
			'	<ui-select-choices repeat="option in options | filter: $select.search">' + 
			'		<div ng-bind-html="option[displayProp] | highlight: $select.search"></div>' + 
			'	</ui-select-choices>' + 
			'</ui-select>'
		};
	}]);
})();
