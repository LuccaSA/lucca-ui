(function(){
	'use strict';
	angular.module('demoApp')
	.controller('tablegridCtrl', ['$scope', function ($scope) {
		$scope.people = [];
		_.each(_.range(5000), function (index) {
			$scope.people[0 + 5 * index] = {
				id: 0 + 5 * index,
				name: "john cena",
				adress: "1234 avenue john cena",
				phone: "0123456789",
				mail: "john.cena@john.cena.com"
			};
			$scope.people[1 + 5 * index] = {
				id: 1 + 5 * index,
				name: "hubert robert",
				adress: "cette adresse est vraiment très très très très très très longue !",
				phone: "0607080910",
				mail: "hrobert@yahoo.fr"
			};
			$scope.people[2 + 5 * index] = {
				id: 2 + 5 * index,
				name: "George Monck",
				adress: "10 downing street",
				phone: "0123456789",
				mail: "g.monck@britishgovernment.co.uk"
			};
			$scope.people[3 + 5 * index] = {
				id: 3 + 5 * index,
				name: "Marie Pogz",
				adress: "4 place pigalle",
				phone: "0607080910",
				mail: "m.pogz@yopmail.com"
			};
			$scope.people[4 + 5 * index] = {
				id: 4 + 5 * index,
				name: "Obi Wan Kenobi",
				adress: "Jedi Temple, Coruscant",
				phone: "0123456789",
				mail: "owkenobi@theforce.com"
			};
		});

		$scope.people2 = [];
		_.each(_.range(5), function (index) {
			$scope.people2[0 + 5 * index] = {
				id: 0 + 5 * index,
				name: "john cena",
				adress: "1234 avenue john cena",
				phone: "0123456789",
				mail: "john.cena@john.cena.com"
			};
			$scope.people2[1 + 5 * index] = {
				id: 1 + 5 * index,
				name: "hubert robert",
				adress: "cette adresse est vraiment très très très très très très longue !",
				phone: "0607080910",
				mail: "hrobert@yahoo.fr"
			};
			$scope.people2[2 + 5 * index] = {
				id: 2 + 5 * index,
				name: "George Monck",
				adress: "10 downing street",
				phone: "0123456789",
				mail: "g.monck@britishgovernment.co.uk"
			};
			$scope.people2[3 + 5 * index] = {
				id: 3 + 5 * index,
				name: "Marie Pogz",
				adress: "4 place pigalle",
				phone: "0607080910",
				mail: "m.pogz@yopmail.com"
			};
			$scope.people2[4 + 5 * index] = {
				id: 4 + 5 * index,
				name: "Obi Wan Kenobi",
				adress: "Jedi Temple, Coruscant",
				phone: "0123456789",
				mail: "owkenobi@theforce.com"
			};
		});

		$scope.headerTree = {
			node: null,
			children: [
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.TEXT,
					fixed: true,
					label: "id",
					width: 20,
					getValue: function (someone) { return someone.id; },
					getOrderByValue: function (someone) { return someone.id; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "right",
				},
				children: [],
			},
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.SELECT,
					fixed: false,
					label: "name",
					width: 20,
					getFilterValue: function (someone) { return someone.name; },
					getValue: function (someone) { return "<span>" + someone.name + "</span>"; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "left",
				},
				children: [],
			},
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.TEXT,
					fixed: false,
					label: "adress",
					width: 20,
					getValue: function (someone) { return someone.adress; },
					getOrderByValue: function (someone) { return someone.adress; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "left",
				},
				children: [],
			},
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.TEXT,
					fixed: false,
					label: "contacts",
					width: 20,
					getValue: function (someone) { return; },
					getOrderByValue: function (someone) { return; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "right",
				},
				children: [
				{
					node: {
						filterType: lui.tablegrid.FilterTypeEnum.MULTISELECT,
						fixed: false,
						label: "phone",
						width: 20,
						getValue: function (someone) { return someone.phone; },
						getOrderByValue: function (someone) { return someone.phone; },
						colspan: null,
						hidden: false,
						rowspan: null,
						textAlign: "right",
					},
					children: [],
				},
				{
					node: {
						filterType: lui.tablegrid.FilterTypeEnum.TEXT,
						fixed: false,
						label: "mail",
						width: 20,
						getValue: function (someone) { return someone.mail; },
						getOrderByValue: function (someone) { return someone.mail; },
						colspan: null,
						hidden: false,
						rowspan: null,
						textAlign: "center",
					},
					children: [],
				},
				],
			},
			]
		};

		$scope.headerTree2 = {
			node: null,
			children: [
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.TEXT,
					fixed: false,
					label: "id",
					width: 20,
					getValue: function (someone) { return someone.id; },
					getOrderByValue: function (someone) { return someone.id; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "right",
				},
				children: [],
			},
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.SELECT,
					fixed: false,
					label: "name",
					width: 20,
					getFilterValue: function (someone) { return someone.name; },
					getValue: function (someone) { return "<span>" + someone.name + "</span>"; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "left",
				},
				children: [],
			},
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.TEXT,
					fixed: false,
					label: "adress",
					width: 20,
					getValue: function (someone) { return someone.adress; },
					getOrderByValue: function (someone) { return someone.adress; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "left",
				},
				children: [],
			},
			{
				node: {
					filterType: lui.tablegrid.FilterTypeEnum.TEXT,
					fixed: false,
					label: "mail",
					width: 20,
					getValue: function (someone) { return someone.mail; },
					getOrderByValue: function (someone) { return someone.mail; },
					colspan: null,
					hidden: false,
					rowspan: null,
					textAlign: "center",
				},
				children: [],
			},
			]
		};

		$scope.alertRow = function(row) {
			alert(JSON.stringify(row));
		}

		$scope.numberOfRow = function(data) {
			return _.filter(data, function(d) {
				return d._luiTableGridRow.isInFilteredDataset;
			}).length;
		}
	}]);
})();
