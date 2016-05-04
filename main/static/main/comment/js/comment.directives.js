'use string';
(function(){
	function reCommentDirective($compile) {
		return {
			restrict: 'E', 
			scope: { comment: '=', assignment: '=', text: '=' },
			transclude: true,
			templateUrl: '/static/main/comment/tmpl/comment.html',
			controller: "CommentCtrl as ctrl"
		}
	}

	angular.module("main.comment")
		.directive("recomment", ['$compile', reCommentDirective]);

})();