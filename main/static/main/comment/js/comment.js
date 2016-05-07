'use strict';
(function(){

function CommentConfig($stateProvider) {
	$stateProvider
		.state("comment", {
			url: "/comment/",
			controller: "CommentListCtrl as slc",
			templateUrl: "/static/main/comment/tmpl/comment.home.html"
		});
}

CommentConfig.$inject = ['$stateProvider']


angular.module('main.comment', [
	'ui.router',
	'toastr',
	'angularSpinner',
	'main.services',
	'endpoint.factories'
]).config(CommentConfig);


})();