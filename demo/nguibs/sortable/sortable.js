(function(){
	'use strict';
	angular.module('demoApp')
	.controller('sortableCtrl', ['$scope', function ($scope) {
		$scope.sortableOptions = {
				containment: "#sortable-properties"
			};
		$scope.people = [];
		$scope.people[0] = {
				id: 0,
				name: "john cena",
				adress: "1234 avenue john cena",
				phone: "0123456789",
				mail: "john.cena@john.cena.com"
		};
		$scope.people[1] = {
			id: 1,
			name: "hubert robert",
			adress: "cette adresse est vraiment très très très très très très longue !",
			phone: "0607080910",
			mail: "hrobert@yahoo.fr"
		};
		$scope.people[2] = {
			id: 2,
			name: "George Monck",
			adress: "10 downing street",
			phone: "0123456789",
			mail: "g.monck@britishgovernment.co.uk"
		};
		$scope.people[3] = {
			id: 3,
			name: "Marie Pogz",
			adress: "4 place pigalle",
			phone: "0607080910",
			mail: "m.pogz@yopmail.com"
		};
		$scope.people[4] = {
			id: 4,
			name: "Obi Wan Kenobi",
			adress: "Jedi Temple, Coruscant",
			phone: "0123456789",
			mail: "owkenobi@theforce.com"
		};
	}]);
})();
