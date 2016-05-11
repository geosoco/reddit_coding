(function(){
	'use strict';

	angular
		.module('coding.coding', [
			'ngAnimate',
			'ngResource',
			'ui.router',
			'toastr',
			'angularSpinner',
			'main.services',
			'main.submission',
			'main.comment',
			'coding.home',
			'angularMoment',
			'ng-showdown'
		])
		.config(CodingCodingConfig);



	CodingCodingConfig.$inject = [
		'$stateProvider'
	];
	function CodingCodingConfig($stateProvider) {
		// temporary state provider stuff
		$stateProvider
			.state("coding.coding", {
				url: "/coding/{id}",
				controller: "CodingCodingCtrl as cctrl",
				templateUrl: "/static/coding/coding/tmpl/coding.coding.html",
				abstract: true
			})
			.state("coding.coding.toplevelcomment", {
				url: "",
				views: {
					"sidebar": {
						templateUrl: "/static/coding/coding/tmpl/coding.coding.sidebar.html"
					},
					"main-content": {
						templateUrl: "/static/coding/coding/tmpl/coding.coding.main.html"
					}
				},
			})

	}

})();