'use strict';
(function(){


angular.module('coding.coding')
	.controller('CodingCodingCtrl', CodingCodingCtrl)
	.controller('CodingSidebarCtrl', CodingSidebarCtrl)
	.controller('CodingMainContentCtrl', CodingMainContentCtrl)
	.controller('CommentCodeInstanceCtrl', CommentCodeInstanceCtrl)
	.controller('SubmissionCodeInstanceCtrl', SubmissionCodeInstanceCtrl)
	.controller('CommentCodeInstanceListCtrl', CommentCodeInstanceListCtrl);



CodingCodingCtrl.$inject = [
	'$stateParams',
	'$scope',
	'$rootScope',
	'$anchorScroll',
	'$location',
	'ResourceHelperService',
	'Comment',
	'Submission',
	'CommentCodeInstance',
	'CodeableCommentModel'
];
function CodingCodingCtrl(
		$stateParams,
		$scope,
		$rootScope,
		$anchorScroll,
		$location,
		ResourceHelperService,
		Comment,
		Submission,
		CommentCodeInstance,
		CodeableCommentModel) {
	var vm = this;


	vm.submission = null;
	vm.rootCommentId = $stateParams.id,
	vm.loading_progress = {
		count: null,
		total: null
	}


	//console.dir(this);
	//console.dir($scope);

	vm.commentsList = [];
	vm.rootComment = new CodeableCommentModel();
	vm.selectedIndex = 0;
	vm.codeInstances = [];


	/*
	*
	*
	*
	*/
	vm.toggleCode = function(code) {
		if(vm.selectedIndex >= 0) {
			var comment = getSelectedComment();

			comment.codeInstanceList.toggleCode(comment.data.id, code)
		} else {
			// submission
		}
	}


	function getSelectedComment() {
		if(vm.selectedIndex >= 0 && 
				vm.selectedIndex < vm.commentsList.length) {
			return vm.commentsList[vm.selectedIndex];
		}
		return null;
	}


	$rootScope.$on("code:toggle", function(event, code){
		console.log("toggleCode");
		vm.toggleCode(code);
	})


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
	* requestSubmission
	*
	* 
	*/
	function requestSubmission(id) {
		vm.submission = Submission.get({id:vm.submission_id});

		return vm.submission.$promise;
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
			return vm.commentsList[idx].data.id;
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
				if(vm.commentsList[i].data.id == id) {
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


	function getNext(node) {
		if(node.children.length > 0) {
			return node.children[0];
		}

		if(node.nextSibling != null) {
			return node.nextSibling;
		}

		// find next parent
		while(node.parent != null) {
			if(node.parent != null && node.parent.nextSibling != null) {
				return node.parent.nextSibling;
			}
			// step up again
			node = node.parent;
		}

		return null;
	}

	function getPrevious(node) {
		if(node.prevSibling != null) {
			// move to previous node
			node = node.prevSibling;

			// if there are children, walk downwards until we find a leaf
			while(node.children.length > 0) {
				node = node.children[node.children.length-1];
			}
			return node;
		}

		// find next parent
		if(node.parent != null) {
			// step up again
			return node.parent;
		}

		// we didn't find one
		return null;
	}

	/*
	* selectNext
	*
	* 
	*/
	vm.selectNext = function() {
		var curNode = vm.commentsList[vm.selectedIndex];
		var nextNode = getNext(curNode);

		if(nextNode) {
			vm.selectId(nextNode.data.id);
		}

	}

	/*
	* selectPrevious
	*
	* 
	*/
	vm.selectPrevious = function() {
		var curNode = vm.commentsList[vm.selectedIndex];
		var prevNode = getPrevious(curNode);

		if(prevNode) {
			vm.selectId(prevNode.data.id);
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
		// start data requests

		vm.rootComment.getEntireThread(vm.rootCommentId)
			.then(function(data) {
				vm.commentsList = vm.rootComment.commentsList;
				if(vm.commentsList && vm.commentsList.length > 0) {
					vm.submission_id = vm.commentsList[0].data.article;
					return requestSubmission();
				}
				return data;
			}).then(function(data){
				vm.changeSelection(0,true);
			})
			.catch(function(error){
				console.error("failed to load items: " + error);
			})

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



CodingSidebarCtrl.$inject = ['$scope'];
function CodingSidebarCtrl($scope) {
	console.log("CodingSidebar!");
}



CodingMainContentCtrl.$inject = ['$scope'];
function CodingMainContentCtrl($scope) {
	console.log("CodingMainContent!");
}



CommentCodeInstanceListCtrl.$inject = ['$scope', 'CommentCodeInstance', 'CodeableCommentModel'];
function CommentCodeInstanceListCtrl($scope, CommentCodeInstance, CodeableCommentModel) {
	//console.log("CodeInstanceListCtrl!!");
	//console.dir($scope);
	//console.dir(this);

	var vm = this;

	vm.data = 0;

	//vm.codeInstances.control = vm;

	vm.test = new CodeableCommentModel({test: 0});

	function findInstanceById(id) {
		vm.codeInstances.forEach(function(d,i){
			if(d.id == id) {
				return d;
			}
		});

		return null;
	}

	function addCommentCodeInstance(comment, code, assignment) {
		var _assignment = assignment || null,
			ci = new CommentCodeInstance({
			comment: comment.data.id,
			code: code,
			assignment: _assignment
		})
		.$save()
		.then(function(data){
			comment.codeInstanceList.addExistingInstance(data);
		}, function(error){
			console.error(error);
		});
	}

	vm.removeCode = function($event, instance) {
		console.log("CCILC removeCode");
		console.dir(instance);

		vm.codeInstances.deleteInstance(instance);
	}
}



CommentCodeInstanceCtrl.$inject = ['$scope', 'CommentCodeInstance'];
function CommentCodeInstanceCtrl($scope, CommentCodeInstance) {
	var vm = this;

	vm.clickTest = function($event, codeid) {
		console.log("clicktest");
		console.dir($event)
		console.dir(codeid);
	}
}



SubmissionCodeInstanceCtrl.$inject = ['$scope', 'SubmissionCodeInstance'];
function SubmissionCodeInstanceCtrl($scope, SubmissionCodeInstance) {

}


})();