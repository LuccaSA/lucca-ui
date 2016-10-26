(function(){
	'use strict';
	angular.module('demoApp')
	.controller('popoverCtrl', ['$scope', function($scope){
		$scope.popoverHtml="<b>Bold stuff</b> and a <span class='lui label'>lui label</span>";
	}]);
})();
