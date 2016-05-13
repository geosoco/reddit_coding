(function(){
	'use strict';

	angular
		.module('coding.assignment', [
			'ngAnimate',
			'ngResource',
			'ui.router',
			'toastr',
			'angularSpinner',
			'main.services',
			'main.submission',
			'main.comment',
			'coding.home',
			'coding.coding',
			'angularMoment',
			'ng-showdown'
		])
		.config(CodingAssignmentConfig);


	CodingAssignmentConfig.$inject = [
		'$stateProvider'
	];
	function CodingAssignmentConfig($stateProvider) {
		// temporary state provider stuff
		$stateProvider
			.state("coding.assignment", {
				url: "/assignment",
				controller: "AssignmentHomeCtrl as ahctrl",
				templateUrl: "/static/coding/assignment/tmpl/coding.assignment.main.html",
				abstract: true
			})
			.state("coding.assignment.create", {
				url: "/create",
				controller: "AssignmentCreateCtrl as acctrl",
				templateUrl: "/static/coding/assignment/tmpl/coding.assignment.create.html"
			})
			.state("coding.assignment.detail", {
				url: "/{id}",
				controller: "AssignmentDetailCtrl as adctrl",
				templateUrl: "/static/coding/assignment/tmpl/coding.assignment.detail.html"
			})

	}

})();