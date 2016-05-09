'use strict';
(function(){



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

			if(comment) {
				if(code in comment.codeInstances) {
					// delete
					//deleteCommentCodeInstance(comment.codeInstances[code]);
				} else {
					//addCommentCodeInstance(comment, code, null);
				}
			}
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
	* requestComments
	*
	* 
	*/
	function requestComments(rootComment, offset, limit) {
		return ResourceHelperService.getAll(
			Comment.query,
			{
				"root_comment": rootComment,
				"offset": offset,
				"limit": limit
			}
		).then(function(result) {
			vm.commentsList = result.map(function(d){ return new CodeableCommentModel({obj: d})});
			if(vm.commentsList && vm.commentsList.length > 0) {
				vm.submission_id = vm.commentsList[0].data.article;
			}
		});
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
	* loadCodeInstances
	*
	* 
	*/
	function loadCodeInstances() {
		var idList = vm.commentsList.map(function(d){ return d.data.id; });

		var req = ResourceHelperService.queryAllInBatched(
				CommentCodeInstance.query, 
				{ "offset": 0, "limit": 100 },
				"comment",
				idList,
				50
			);

		req.then(function(result){
				console.log("loadCodeInstances success");
				console.dir(result);
				vm.codeInstances = result;
			}, function(error) {
				console.error("loadCodeInstances failed");
			});


		return req;
	}

	function addCodeInstances(tree_map) {
		if(vm.codeInstances && vm.codeInstances.length > 0) {
			vm.codeInstances.forEach(function(d,i){
				var node = tree_map[d.comment];

				node.codeInstanceList.addExistingInstance(d);
			})
		}
	}


	/*
	* buildCommentTree
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
			//d.children = [];
			d.selected = false;
			//d.codeInstances = {instances: [], control: null};

			tree_map[d.data.id] = d;
		});


		while(vm.commentsList.length > 0) {
			var c = vm.commentsList.pop(),
				parentId = c.data.parent_id;

			// add 
			if(parentId !== null && parentId !== undefined && parentId != c.data.article) {
				parent = tree_map[parentId];
				if(parent.hasOwnProperty("children") === false) {
					console.error("!!! children undefined");
					console.dir(parent);
				}
				parent.addChild(c);
			}

			// check for root node
			if(c.data.id === vm.root_comment) {
				root_node = c;
			}
		}

		//
		addCodeInstances(tree_map);

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
		// start data requests

		requestComments(vm.root_comment, 0, 100)
			.then(requestSubmission)
			.then(loadCodeInstances)
			.then(loadingFinished)
			.catch(function(error){
				console.error("failed to load items!")
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


function CodingSidebarCtrl($scope) {
	console.log("CodingSidebar!");
}
CodingSidebarCtrl.$inject = ['$scope'];


function CodingMainContentCtrl($scope) {
	console.log("CodingMainContent!");
}
CodingMainContentCtrl.$inject = ['$scope'];


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
			comment: comment.id,
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

		if(instance in vm.codeInstances) {
			delete vm.codeInstances[instance];
		}
		
/*
		CommentCodeInstance.delete({id: vm.instance.id}).$promise.then(function(data){
			console.log("delete successful");
			console.dir("data");
		}, function(error) {
			console.error("Error deleting code");
			console.dir(error);
		});
*/
	}
}
CommentCodeInstanceListCtrl.$inject = ['$scope', 'CommentCodeInstance', 'CodeableCommentModel'];


function CommentCodeInstanceCtrl($scope, CommentCodeInstance) {
	var vm = this;

	vm.clickTest = function($event, codeid) {
		console.log("clicktest");
		console.dir($event)
		console.dir(codeid);
	}

	/*
	vm.removeCode = function($event) {
		console.log("removing :" + vm.instance.id);
		console.dir(this);
		console.dir($scope);

		CommentCodeInstance.delete({id: vm.instance.id}).$promise.then(function(data){
			console.log("delete successful");
			console.dir("data");
		}, function(error) {
			console.error("Error deleting code");
			console.dir(error);
		});
	}*/
}
CommentCodeInstanceCtrl.$inject = ['$scope', 'CommentCodeInstance'];


function SubmissionCodeInstanceCtrl($scope, SubmissionCodeInstance) {

}
SubmissionCodeInstanceCtrl.$inject = ['$scope', 'SubmissionCodeInstance'];


angular.module('coding.coding')
	.controller('CodingCodingCtrl', CodingCodingCtrl)
	.controller('CodingSidebarCtrl', CodingSidebarCtrl)
	.controller('CodingMainContentCtrl', CodingMainContentCtrl)
	.controller('CommentCodeInstanceCtrl', CommentCodeInstanceCtrl)
	.controller('SubmissionCodeInstanceCtrl', SubmissionCodeInstanceCtrl)
	.controller('CommentCodeInstanceListCtrl', CommentCodeInstanceListCtrl)


})();