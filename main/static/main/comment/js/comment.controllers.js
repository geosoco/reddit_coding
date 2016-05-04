'use strict';
(function(){

function CommentListCtrl($scope, $location, Comment) {
	var vm = this;

	console.log("commentlistctrl")

	vm.comment = Comment.get({id:'3spu7t'});
}

CommentListCtrl.$inject = ['$scope', '$location', 'Comment'];



function CommentCtrl($scope, Comment) {
	var vm = this;

	console.log("commentctrl");
	console.dir($scope);

}
CommentCtrl.$inject = ['$scope', 'Comment'];


angular.module('main.comment')
	.controller('CommentListCtrl', CommentListCtrl)
	.controller('CommentCtrl', CommentCtrl);

})();