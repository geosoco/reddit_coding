'use strict';
(function(){

function CommentListCtrl($scope, $location, Comment) {
	var vm = this;

	console.log("commentlistctrl")

	vm.comment = Comment.get({id:'3spu7t'});
}

CommentListCtrl.$inject = ['$scope', '$location', 'Comment'];



function CommentCtrl($scope, $element, $compile, Comment) {
	var vm = this;

	vm.expanded = true;

	vm.toggleExpand = function() {
		vm.expanded = !vm.expanded;
	}

	vm.onClick = function(ev) {

	}
/*
	if(vm.showCodes) {
		var parent = angular.element($('.code-container', $element)[0]),
			el = $compile(
				'<codelist code-instances="comment.codes"></codelist>'
				)($scope);

			parent.append(el);
	}
*/

	//

}
CommentCtrl.$inject = ['$scope', '$element', '$compile', 'Comment'];


angular.module('main.comment')
	.controller('CommentListCtrl', CommentListCtrl)
	.controller('CommentCtrl', CommentCtrl);

})();