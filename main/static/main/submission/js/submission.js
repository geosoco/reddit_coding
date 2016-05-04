'use strict';
(function(){

function SubmissionConfig($stateProvider) {
	$stateProvider
		.state("submission", {
			url: "/submission/",
			controller: "SubmissionListCtrl as slc",
			templateUrl: "/static/main/submission/tmpl/submission.home.html"
		});
}

SubmissionConfig.$inject = ['$stateProvider']


angular.module('main.submission', [
	'ui.router',
	'toastr',
	'angularSpinner',
	'main.services'
]).config(SubmissionConfig);


})();