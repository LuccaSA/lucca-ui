(function(){
	'use strict';

	angular.module('demoApp')
	.controller('formlyCtrl', ['$scope', function($scope){
		$scope.model = {
			text1: "lol",
		};
		$scope.fields = [
			{
				key: "text1",
				type: "text",
				templateOptions: {
					label: 'label',
				},
			},
			{
				key: "text2",
				type: "text",
				templateOptions: {
					label: 'label',
				},
			},
		]
	}]);
})();