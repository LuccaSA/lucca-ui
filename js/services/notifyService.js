(function(){
	'use strict';
	angular.module('lui.services')
	.service('luisNotify', ['$log', 'notify', function($log, notify){
		var template = 
			"<div class=\"lui callout filled\" ng-click=\"$close()\" " + 
			"style=\"width:25em;z-index:999\"" + 
			"ng-class=\"[$classes, " + 
			"$position === 'center' ? 'cg-notify-message-center' : '', " +
			"$position === 'left' ? 'cg-notify-message-left' : '', " + 
			"$position === 'right' ? 'cg-notify-message-right' : '']\" " +
			"ng-style=\"{'margin-left': $centerMargin}\"> " + 
			"	<h5>{{$classes[0] | uppercase | translate}}</h5>" + 
			"	<div ng-show=\"!$messageTemplate\">" + 
			"	{{$message|translate}}" +
			"	</div>" + 
			"</div>";

		var service = {};
		service.error = function(error, position){
			$log.error(error);
			notify({
				startTop: 40, // to not get above the banner
				duration: 20000,
				template: template,
				position: position || 'center',
				message:'ERR_' + error.cause,
				classes:['error']
			});
		}

		return service;
	}]);
})();
