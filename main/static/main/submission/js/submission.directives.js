'use string';
(function(){
	function reSubmissionDirective($compile) {
		return {
			restrict: 'E', 
			scope: { submission: '=', assignment: '=', text: '=' },
			transclude: true,
			templateUrl: '/static/main/submission/tmpl/submission.html',
			controller: "SubmissionCtrl as ctrl"
		}
	}

	angular.module("main.submission")
		.directive("resubmission", ['$compile', reSubmissionDirective]);

})();