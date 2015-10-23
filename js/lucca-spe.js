(function(){
	angular.module('luccaSpeApp',['lui', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ngMockE2E']);
	angular.module('luccaSpeApp')
	.controller("userPickerCtrl", ["$scope", "$httpBackend", '_', function($scope, $httpBackend, _) {
		var RESPONSE_0_users = {header:{},data:{items:[]}};
		/***** Without Former Employees *****/
		var RESPONSE_20_users = {header:{},data:{items:users}};
		var RESPONSE_10_users = {header:{},data:{items:_.last(users,10)}};
		var RESPONSE_5_users = {header:{}, data:{items:_.last(users,5)}};
		var RESPONSE_2_users = {header:{},data:{items:_.last(users,2)}};
		var RESPONSE_1_users = {header:{},data:{items:_.last(users,1)}};
		/***** With Former Employees *****/
		var RESPONSE_20_users_FE = {header:{}, data:{items:users_FE}};
		var RESPONSE_10_users_FE = {header:{}, data:{items:_.last(users_FE,10)}};
		var RESPONSE_5_users_FE = {header:{}, data:{items:_.last(users_FE,5)}};
		var RESPONSE_2_users_FE = {header:{}, data:{items:_.last(users_FE,2)}};
		var RESPONSE_1_users_FE = {header:{}, data:{items:_.last(users_FE,1)}};
		/***** With homonyms, no former employees *****/
		var RESPONSE_4_users_homonyms = {header:{}, data:{items:homonyms}};
		var RESPONSE_2_users_homonyms = {header:{}, data:{items:_.first(homonyms,2)}};
		var RESPONSE_homonyms_properties = {header:{},data:{items:[{id:421,firstName:"Lucien",lastName:"Bertin",department:{name:"BU Timmi/Lucca"},legalEntity:{name:"Lucca"},employeeNumber:"00068",mail:"no-reply@lucca.fr"},{id:450,firstName:"Lucien",lastName:"Bertin",department:{name:"Marketing"},legalEntity:{name:"Lucca"},employeeNumber:"00110",mail:"no-reply@lucca.fr"}]}};
		/***** With homonyms, former employees *****/
		var RESPONSE_5_users_homonyms_FE = {header:{}, data:{items:homonyms_FE}};
		var RESPONSE_3_users_homonyms_FE = {header:{}, data:{items:_.first(homonyms_FE,3)}};
		var RESPONSE_homonyms_properties_FE = {header:{},data:{items:[{id:421,firstName:"Lucien",lastName:"Bertin",department:{name:"BU Timmi/Lucca"},legalEntity:{name:"Lucca"},employeeNumber:"00068",mail:"no-reply@lucca.fr"},{id:449,firstName:"Lucien",lastName:"Bertin",department:{name:"Sales"},legalEntity:{name:"Lucca"},employeeNumber:"00099",mail:"no-reply@lucca.fr"},{id:450,firstName:"Lucien",lastName:"Bertin",department:{name:"Marketing"},legalEntity:{name:"Lucca"},employeeNumber:"00110",mail:"no-reply@lucca.fr"}]}};

		$scope.isChecked = false;
		$scope.getCnt = 0;
		$scope.apiCalls = [];
		$scope.myUser = {};

		/*****************************/
		/******    NO HOMONYMS   *****/
		/****** FORMER EMPLOYEES *****/
		/*****************************/
		$httpBackend.whenGET(/api\/v3\/users\/find\?formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_20_users_FE];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_10_users_FE];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_5_users_FE];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w{2,5}\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_2_users_FE];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w{5,9}\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_1_users_FE];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w{10,}\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_0_users];
		});

		/*******************************/
		/******    NO HOMONYMS     *****/
		/***** NO FORMER EMPLOYEES *****/
		/*******************************/
		$httpBackend.whenGET(/api\/v3\/users\/find\?formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_20_users];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_10_users];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_5_users];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w{2,5}\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_2_users];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w{5,9}\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_1_users];
		});
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=[b-z]\w{10,}\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_0_users];
		});

		/*******************************/
		/******      HOMONYMS      *****/
		/***** NO FORMER EMPLOYEES *****/
		/*******************************/
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=a\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_4_users_homonyms];
		});

		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=a.{1,4}\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_2_users_homonyms];
		});

		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=a.{5,}\&formerEmployees=false\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_0_users];
		});

		/****************************/
		/***** HOMONYMS DETAILS *****/
		/****************************/
		$httpBackend.whenGET(/api\/v3\/users\?id=450,421.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_homonyms_properties];
		});

		/****************************/
		/******    HOMONYMS     *****/
		/***** FORMER EMPLOYEES *****/
		/****************************/
		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=a\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_5_users_homonyms_FE];
		});

		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=a.{1,4}\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_3_users_homonyms_FE];
		});

		$httpBackend.whenGET(/api\/v3\/users\/find\?clue=a.{5,}\&formerEmployees=true\&.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_0_users];
		});

		/****************************/
		/***** HOMONYMS DETAILS *****/
		/****************************/
		$httpBackend.whenGET(/api\/v3\/users\?id=450,449,421.*/i).respond(function(method, url) {
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_homonyms_properties_FE];
		});
	}]);

	var users = [{"id":1,"firstName":"Guillaume","lastName":"Allain"},{"id":2,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":3,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":4,"firstName":"Clément","lastName":"Barbotin"},{"id":5,"firstName":"Lucien","lastName":"Bertin"},{"id":6,"firstName":"Jean-Baptiste","lastName":"Beuzelin"},{"id":7,"firstName":"Kevin","lastName":"Brochet"},{"id":8,"firstName":"Alex","lastName":"Carpentieri"},{"id":9,"firstName":"Bruno","lastName":"Catteau"},{"id":10,"firstName":"Orion","lastName":"Charlier"},{"id":11,"firstName":"Sandrine","lastName":"Conraux"},{"id":12,"firstName":"Tristan","lastName":"Couëtoux du Tertre"},{"id":13,"firstName":"Patrick","lastName":"Dai"},{"id":14,"firstName":"Larissa","lastName":"De Andrade Gaulia"},{"id":15,"firstName":"Christophe","lastName":"Demarle"},{"id":16,"firstName":"Manon","lastName":"Desbordes"},{"id":17,"firstName":"Nicolas","lastName":"Faugout"},{"id":18,"firstName":"Brice","lastName":"Francois"},{"id":19,"firstName":"Tristan","lastName":"Goguillot"},{"id":20,"firstName":"Julia","lastName":"Ivanets"}];
	var users_FE = [{"id":1,"firstName":"Guillaume","lastName":"Allain","dtContractEnd":null},{"id":2,"firstName":"Elsa","lastName":"Arrou-Vignod","dtContractEnd":null},{"id":3,"firstName":"Chloé","lastName":"Azibert Yekdah","dtContractEnd":null},{"id":4,"firstName":"Clément","lastName":"Barbotin","dtContractEnd":null},{"id":5,"firstName":"Saâd","lastName":"Benmansour","dtContractEnd":"2011-09-30T00:00:00"},{"id":6,"firstName":"ALEXANDRE","lastName":"BERTHON","dtContractEnd":"2015-08-07T00:00:00"},{"id":7,"firstName":"Lucien","lastName":"Bertin","dtContractEnd":null},{"id":8,"firstName":"Jean-Baptiste","lastName":"Beuzelin","dtContractEnd":null},{"id":9,"firstName":"Anne-Murielle","lastName":"Blanquet","dtContractEnd":"2015-04-30T00:00:00"},{"id":10,"firstName":"Estelle","lastName":"Bonet","dtContractEnd":"2012-04-30T00:00:00"},{"id":11,"firstName":"Aurélien","lastName":"Bottazini","dtContractEnd":"2007-03-31T00:00:00"},{"id":12,"firstName":"Kevin","lastName":"Brochet","dtContractEnd":"2017-08-31T00:00:00"},{"id":13,"firstName":"XAVIER","lastName":"CAMPENON","dtContractEnd":"2015-04-30T00:00:00"},{"id":14,"firstName":"Alex","lastName":"Carpentieri","dtContractEnd":null},{"id":15,"firstName":"Bruno","lastName":"Catteau","dtContractEnd":null},{"id":16,"firstName":"Onur","lastName":"Celebi","dtContractEnd":"2009-06-30T00:00:00"},{"id":17,"firstName":"Orion","lastName":"Charlier","dtContractEnd":null},{"id":18,"firstName":"ALAN","lastName":"CHAUCHET","dtContractEnd":"2015-09-01T00:00:00"},{"id":19,"firstName":"Sandrine","lastName":"Conraux","dtContractEnd":null},{"id":20,"firstName":"Rémy","lastName":"Coudercher","dtContractEnd":"2012-08-10T00:00:00"}];
	var homonyms = [{"id":450,"firstName":"Lucien","lastName":"Bertin"},{"id":421,"firstName":"Lucien","lastName":"Bertin"},{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin"},{"id":416,"firstName":"Benoit","lastName":"Paugam"}];
	var homonyms_FE = [{"id":450,"firstName":"Lucien","lastName":"Bertin","dtContractEnd":null},{"id":449,"firstName":"Lucien","lastName":"Bertin","dtContractEnd":"2015-10-16T00:00:00"},{"id":421,"firstName":"Lucien","lastName":"Bertin","dtContractEnd":null},{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin","dtContractEnd":null},{"id":416,"firstName":"Benoit","lastName":"Paugam","dtContractEnd":null}];
})();



