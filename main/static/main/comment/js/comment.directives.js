'use string';
(function(){
	function reCommentDirective($compile) {
		return {
			restrict: 'E', 
			scope: { comment: '=', assignment: '=', selectedId: '=', showCodes: '=' },
			transclude: true,
			templateUrl: '/static/main/comment/tmpl/comment.html',
			controller: "CommentCtrl as ctrl",
			bindToController: true,
			compile: function(el, attrs) {
				if(attrs.showCodes) {
					// append code list if necessary
					var parent = angular.element($('.code-container', el)[0]),
						codelist = angular.element(
							'<codelist code-instances="ctrl.comment.codes"></codelist>'
							);

						parent.append(codelist);

				}
			}
		}
	}

	angular.module("main.comment")
		.directive("recomment", ['$compile', reCommentDirective]);

})();