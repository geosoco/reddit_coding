'use strict';
(function(){

function CodingCodingCtrl(
		$stateParams,
		$scope,
		$rootScope,
		$anchorScroll,
		$location,
		Comment,
		Submission) {
	var vm = this;

	vm.test = "Testing!!!!!-";

	vm.submission = null;
	vm.root_comment = $stateParams.id,
	vm.loading_progress = {
		count: null,
		total: null
	}

	console.log("codinghomectrl !");

	//console.dir(this);
	//console.dir($scope);

	vm.commentsList = [];
	vm.rootComment = {};
	vm.selectedIndex = 0;



	/*
	* onKeyDown
	*
	* 
	*/
	vm.onKeyDown = function(event) {
		// handles keydown events
		// must be wrapped in an apply because the way its handled.
		$scope.$apply(function(){
			if($rootScope.block_key_handler !== true) {
				var key = event.key || event.keyCode;

				switch(key) {
					case 221: vm.selectNext(); event.preventDefault(); break;
					case 219: vm.selectPrevious(); event.preventDefault(); break;
					default:
						console.log("keydown: ");
						console.dir(event);
						break;
				}
			}
		})
	}


	/*
	* commentsLoaded
	*
	* 
	*/
	function commentsLoaded(result) {
		//console.log("commentsLoaded");
		//console.dir(result);

		if(result.results && result.results.length > 0) {
			vm.submission = Submission.get({id:result.results[0].article.trim()});
		}

		// push results into array
		Array.prototype.push.apply(vm.commentsList, result.results);

		vm.loading_progress.count = vm.commentsList.length;
		vm.loading_progress.total = result.count;

		if(vm.commentsList.length < result.count) {
			requestComments(vm.root_comment, vm.commentsList.length, 100);
		} else {
			// we're done
			loadingFinished();
		}
	}

	/*
	* onKeyDown
	*
	* 
	*/
	function requestComments(rootComment, offset, limit) {
		Comment.query({
			"root_comment": rootComment,
			"offset": offset,
			"limit": limit
		})
		.$promise.then(commentsLoaded);
	}

	/*
	* onKeyDown
	*
	* 
	*/
	function buildCommentTree() {
		var root_node = {}, 
			tree_map = {};

		// sort the list first
		vm.commentsList.sort(function(a,b){
			if(a.id < b.id) { return -1; }
			else if(a.id > b.id) { return 1; }
			return 0;
		})

		// build up tree map
		vm.commentsList.forEach(function(d,i) {
			d.children = [];
			d.selected = false;

			tree_map[d.id] = d;
		});


		while(vm.commentsList.length > 0) {
			var c = vm.commentsList.pop(),
				parentId = c.parent_id;

			// add 
			if(parentId !== null && parentId !== undefined && parentId != c.article) {
				parent = tree_map[parentId];
				if(parent.hasOwnProperty("children") === false) {
					console.error("!!! children undefined");
					console.dir(parent);
				}
				parent.children.unshift(c);
			}

			// check for root node
			if(c.id === c.root_comment) {
				root_node = c;
			}
		}

		return root_node;
	}

	/*
	* pushTreeNode
	*
	* 
	*/
	function pushTreeNode(node) {
		vm.commentsList.push(node);
		// step through children
		node.children.forEach(function(d){
			pushTreeNode(d);
		})
	}

	/*
	* buildCommentListFromTree
	*
	* 
	*/
	function buildCommentListFromTree() {
		pushTreeNode(vm.rootComment);
	}

	/*
	* setSelection
	*
	* 
	*/
	function setSelection(idx, value) {
		if(idx == -1) {
			vm.submission.selected = value;
			return vm.submission.id;
		} else if(vm.commentsList && vm.commentsList.length > idx) {
			vm.commentsList[idx].selected = value;
			return vm.commentsList[idx].id;
		}
	}

	/*
	* changeSelection
	*
	* 
	*/
	vm.changeSelection = function(idx, force) {
		if(idx != vm.selectedIndex || force) {

			// unselect old item
			setSelection(vm.selectedIndex, false);

			// select new item
			vm.selectedIndex = idx;
			var id = setSelection(vm.selectedIndex, true);
			$location.hash(id);
			$anchorScroll.yOffset = 200;
			$anchorScroll();
		}
	}

	/*
	* selectId
	*
	* 
	*/
	vm.selectId = function(id) {
		var idx = null;
		if(id == vm.submission.id) {
			idx = -1;
		} else {
			// try to find the id
			for(var i = 0; i < vm.commentsList.length; i++) {
				if(vm.commentsList[i].id == id) {
					idx = i;
					break;
				}
			}
		}

		vm.changeSelection(idx);

	}

	/*
	* onClick
	*
	* 
	*/
	vm.onClick = function($event, id) {
		var el = angular.element($event.srcElement);
		while(el.length > 0) {
			var tagName = el[0].tagName.toLowerCase();

			if(tagName == "a" || tagName == "input" || tagName == "button") return;
			if(el.hasClass("comment")) {
				var id = el.attr('id');
				if(id) {
					vm.selectId(id);
					return;
				}
			}
			if(el.parent() === undefined || el.parent() === null || el.parent() == document) {
				return;
			}
			el = angular.element(el.parent());
		}
		//vm.selectId(id);
	}

	/*
	* selectNext
	*
	* 
	*/
	vm.selectNext = function() {
		if(vm.commentsList && vm.commentsList.length) {
			if(vm.selectedIndex +1 < vm.commentsList.length) {
				vm.changeSelection(vm.selectedIndex+1);
			}
		}
	}

	/*
	* selectPrevious
	*
	* 
	*/
	vm.selectPrevious = function() {
		if(vm.commentsList && vm.commentsList.length) {
			if(vm.selectedIndex > -1) {
				vm.changeSelection(vm.selectedIndex-1);
			}
		}
	}

	/*
	* loadingFinished
	*
	* 
	*/
	function loadingFinished() {
		vm.rootComment = buildCommentTree();
		buildCommentListFromTree();
		vm.changeSelection(0, true);
	}
	

	/*
	* init
	*
	* 
	*/
	function init() {
		// make initial request for comments
		requestComments(vm.root_comment, 0, 100);

		var $doc = angular.element(document);
		$doc.on('keydown', vm.onKeyDown);
		$scope.$on("$destroy", function() {
			var $doc = angular.element(document);
			$doc.off('keydown', vm.onKeyDown);
		});
	}


	// start the ball rolling
	init();

}
CodingCodingCtrl.$inject = [
	'$stateParams',
	'$scope',
	'$rootScope',
	'$anchorScroll',
	'$location',
	'Comment',
	'Submission'
];


function CodingSidebarCtrl($scope) {
	console.log("CodingSidebar!");
}
CodingSidebarCtrl.$inject = ['$scope'];


function CodingMainContentCtrl($scope) {
	console.log("CodingMainContent!");
}
CodingMainContentCtrl.$inject = ['$scope'];


function CommentCodeInstanceCtrl($scope, CommentCodeInstance) {

}
CommentCodeInstanceCtrl.$inject = ['$scope', 'CommentCodeInstance'];


function SubmissiomCodeInstanceCtrl($scope, SubmissiomCodeInstance) {

}
SubmissiomCodeInstanceCtrl.$inject = ['$scope', 'SubmissiomCodeInstance'];


angular.module('coding.coding')
	.controller('CodingCodingCtrl', CodingCodingCtrl)
	.controller('CodingSidebarCtrl', CodingSidebarCtrl)
	.controller('CodingMainContentCtrl', CodingMainContentCtrl)
	.controller('CommentCodeInstanceCtrl', CommentCodeInstanceCtrl)
	.controller('SubmissiomCodeInstanceCtrl', SubmissiomCodeInstanceCtrl)


})();