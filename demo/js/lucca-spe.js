(function(){
	angular.module('luccaSpeApp',['lui', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ngMockE2E']);
	angular.module('luccaSpeApp')
	.controller('userPickerCtrl', ['$scope', '$httpBackend', '_', function($scope, $httpBackend, _){
		var RESPONSE_4_users = {header:{}, data:{items:_.first(users,4)}};
	// 	var RESPONSE_20_users;
		$scope.getCnt = 0;
		$scope.apiCalls = [];
		$httpBackend.whenGET(/api\/v3\/users\/find.*/).respond(function(method, url){
			$scope.apiCalls.push({id:$scope.getCnt++, url:url});
			return [200, RESPONSE_4_users];
		});
	}]);
	var users = [{"id":353,"firstName":"Guillaume","lastName":"Allain"},{"id":395,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":391,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":405,"firstName":"Clément","lastName":"Barbotin"},{"id":421,"firstName":"Lucien","lastName":"Bertin"},{"id":449,"firstName":"Lucien","lastName":"Bertin"},{"id":450,"firstName":"Lucien","lastName":"Bertin"},{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin"},{"id":417,"firstName":"Kevin","lastName":"Brochet"},{"id":448,"firstName":"Alex","lastName":"Carpentieri"},{"id":338,"firstName":"Bruno","lastName":"Catteau"},{"id":418,"firstName":"Orion","lastName":"Charlier"},{"id":387,"firstName":"Sandrine","lastName":"Conraux"},{"id":442,"firstName":"Tristan","lastName":"Couëtoux du Tertre"},{"id":382,"firstName":"Patrick","lastName":"Dai"},{"id":411,"firstName":"Larissa","lastName":"De Andrade Gaulia"},{"id":439,"firstName":"Christophe","lastName":"Demarle"},{"id":419,"firstName":"Manon","lastName":"Desbordes"},{"id":344,"firstName":"Nicolas","lastName":"Faugout"},{"id":410,"firstName":"Brice","lastName":"Francois"},{"id":383,"firstName":"Tristan","lastName":"Goguillot"},{"id":423,"firstName":"Julia","lastName":"Ivanets"},{"id":381,"firstName":"Jérôme","lastName":"Le Nouen"},{"id":377,"firstName":"Claire","lastName":"Le Parco"},{"id":403,"firstName":"Paul","lastName":"Louis"},{"id":412,"firstName":"Maxime","lastName":"Mangin"},{"id":360,"firstName":"Clotilde","lastName":"Martin-Lemerle"},{"id":400,"firstName":"Léa","lastName":"Mendes"},{"id":355,"firstName":"CECILE","lastName":"Meozzi da Costa"}];
})();



// {"items":[{"id":353,"firstName":"Guillaume","lastName":"Allain"},{"id":395,"firstName":"Elsa","lastName":"Arrou-Vignod"},{"id":391,"firstName":"Chloé","lastName":"Azibert Yekdah"},{"id":405,"firstName":"Clément","lastName":"Barbotin"},{"id":421,"firstName":"Lucien","lastName":"Bertin"},{"id":449,"firstName":"Lucien","lastName":"Bertin"},{"id":450,"firstName":"Lucien","lastName":"Bertin"},{"id":401,"firstName":"Jean-Baptiste","lastName":"Beuzelin"},{"id":417,"firstName":"Kevin","lastName":"Brochet"},{"id":448,"firstName":"Alex","lastName":"Carpentieri"},{"id":338,"firstName":"Bruno","lastName":"Catteau"},{"id":418,"firstName":"Orion","lastName":"Charlier"},{"id":387,"firstName":"Sandrine","lastName":"Conraux"},{"id":442,"firstName":"Tristan","lastName":"Couëtoux du Tertre"},{"id":382,"firstName":"Patrick","lastName":"Dai"},{"id":411,"firstName":"Larissa","lastName":"De Andrade Gaulia"},{"id":439,"firstName":"Christophe","lastName":"Demarle"},{"id":419,"firstName":"Manon","lastName":"Desbordes"},{"id":344,"firstName":"Nicolas","lastName":"Faugout"},{"id":410,"firstName":"Brice","lastName":"Francois"},{"id":383,"firstName":"Tristan","lastName":"Goguillot"},{"id":423,"firstName":"Julia","lastName":"Ivanets"},{"id":381,"firstName":"Jérôme","lastName":"Le Nouen"},{"id":377,"firstName":"Claire","lastName":"Le Parco"},{"id":403,"firstName":"Paul","lastName":"Louis"},{"id":412,"firstName":"Maxime","lastName":"Mangin"},{"id":360,"firstName":"Clotilde","lastName":"Martin-Lemerle"},{"id":400,"firstName":"Léa","lastName":"Mendes"},{"id":355,"firstName":"CECILE","lastName":"Meozzi da Costa"}]}}


