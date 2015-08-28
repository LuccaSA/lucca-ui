(function () {
	'use strict';

	angular.module('lui.directives').directive('luidUserSelect', [function () {
		return {
			require: '^ngModel',
			scope: {
				users: '=', // users must have at least those fields : id, displayname
				placeholder: '@',
				onSelect:'&',
				onRemove:'&'
			},
			restrict: 'E',
			template:
			'<ui-select theme="bootstrap" on-select="onSelect()" on-remove="onRemove()">' + 
			'	<ui-select-match placeholder="{{placeholder}}">{{$select.selected.displayName}}</ui-select-match>' + 
			'	<ui-select-choices repeat="user in users | filter: $select.search">' + 
			'		<div ng-bind-html="user.displayName"></div>' + 
			'	</ui-select-choices>' + 
			'</ui-select>'
		};
	}]);
})();
