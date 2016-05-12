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
			'coding.assignment',
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
				url: "/coding",
				controller: "CodingCodingCtrl as cctrl",
				templateUrl: "/static/coding/coding/tmpl/coding.coding.html",
				abstract: true
			})
			.state("coding.coding.toplevelcomment", {
				url: "/thread/{id}",
				resolve: {
					aid: null
				},
				views: {
					"sidebar": {
						templateUrl: "/static/coding/coding/tmpl/coding.coding.sidebar.html"
					},
					"main-content": {
						templateUrl: "/static/coding/coding/tmpl/coding.coding.main.html"
					}
				},
			})
			.state("coding.coding.assignment", {
				url: "/assignment/{aid}/{id}",
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