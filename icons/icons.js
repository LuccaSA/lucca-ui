(function(){
	'use strict';

	angular.module('demoApp')
	.controller('iconsCtrl', ['$scope', function($scope){
		$scope.contextSensIcons = [
			['plus', 'minus', 'check', 'cross', 'forbidden'],
			['thin plus', 'thin cross'],
			['error','warning','help', 'help outline', 'rejected', "completion pie", "flag"],
			["ellipsis", "list", "tree list", "mosaic", "nine tiles", "tiles", "org chart", "blocks", "filter", "fullscreen", "fullscreen exit"],
			['lock', 'unlock'],
		];

		$scope.contextInsensIcons = [
			['attachment', 'files', "email", "phone", "notification", "camera", "settings", "sliders", "gallery", "calendar", "key", "simple key", "history", "clock", "timer", "pin", "location", "comment", "branch", "analytics"],
			["edit", "edit frame", "edit mini", "customize", "download", "upload", "outside", "send", "search", "trash", "refresh", "printer"],
			["pristine imported item", "imported item", "synchronization"],
			["user", "add user", "remove user", "to user", "group", "roles"],
			["flash"],
			["bookmark", "add bookmark", "remove bookmark"],
			["watch", "unwatch"],
		];

		$scope.mouseIcons = [
			['drag', 'drag2'],
			['move','move horizontally','move vertically']
		];

		$scope.arrowIcons = [
			['north chevron','east chevron','south chevron','west chevron'],
			['north arrow','east arrow','south arrow','west arrow'],
			['thin north arrow','thin east arrow','thin south arrow','thin west arrow']
		];

		$scope.speIcons = [
			["breakfast", "coffee", "meal", "birthday", "lunch", "diner", "drink", "snack"],
			["car", "clean car", "taxi", "bus", "subway", "truck", "train", "plane"],
			["euro toll", "dollar toll", "parking", "milestone", "mileage", "gasoline"],
			["journey", "luggage", "hotel", "postage"],
			["euro", "dollar", "quantity", "piggy bank", "bank card", "pricetag", "payment", "import cb"],
			["heart", "broken heart", "star"],
			["computer", "computer mouse", "headphones", "database"],
			["tools", "iron", "jumping cc"],
		];
	}]);
})();
