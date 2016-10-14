(function(){
	'use strict';

	angular.module('demoApp')
	.controller('progressbarCtrl', ['$scope', '$http', 'luisProgressBar', function($scope, $http, luisProgressBar){
		$scope.palettes = ["primary", "secondary", "grey", "light", "red", "orange", "yellow", "green"];
		$scope.currentPalette = "light";
		$scope.changeColor = function(palette) {
			$scope.currentPalette = palette;
			luisProgressBar.addProgressBar(palette);
		};
		$scope.fastListen = function(){
			luisProgressBar.startListening();
			$http.get("/bogus-progress");
		};
		$scope.slowListen = function(){
			luisProgressBar.startListening();
			$http.get("http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=l");
		};
	}]);
})();
