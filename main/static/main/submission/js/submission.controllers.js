'use strict';
(function(){

function SubmissionListCtrl($scope, $location, Submission) {
	var vm = this;

	console.log("submissionlistctrl")

	vm.sub = Submission.get({id:'3spu7t'});
}

SubmissionListCtrl.$inject = ['$scope', '$location', 'Submission'];



function SubmissionCtrl($scope, Submission) {
	var vm = this;

	console.log("submissionctrl");
	console.dir($scope);

	//vm.sub = Submission.get({id: '3spu7t'});
}
SubmissionCtrl.$inject = ['$scope', 'Submission'];


angular.module('main.submission')
	.controller('SubmissionListCtrl', SubmissionListCtrl)
	.controller('SubmissionCtrl', SubmissionCtrl);

})();