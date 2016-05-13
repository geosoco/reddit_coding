(function() {
'use strict';


angular.module("coding.coding")
	.factory("CommentCodeInstanceListModel", CommentCodeInstanceListModelFactory)
	.factory("CodeableCommentModel", CodeableCommentModelFactory)
	.factory("AssignmentModel", AssignmentModelFactory)

})();



/*
 * CommentCodeInstanceListModelFactory
 *
 *
 */
CommentCodeInstanceListModelFactory.$inject = [
	"Comment", "CommentCodeInstance"
];

function CommentCodeInstanceListModelFactory(Comment, CommentCodeInstance) {
	return function(params) {
		params = params || {};

		var self = {
			// data
			"instances": params.instances || [],

			// methods
			"setInstances": setInstances,
			"addExistingInstance": addExistingInstance,
			"addInstance": addInstance,
			"getCodeByCodeId": getCodeByCodeId,
			"toggleCode": toggleCode,
			"deleteInstance": deleteInstance
		}

		//////////////

		var nextId = -1;

		///////////////

		function setInstances(instances) {
			self.instances = instances;
		}

		// data members
		function addExistingInstance(code) {
			self.instances.unshift(code);
		}




		function addInstance(comment, code, assignment) {
			var inst = new CommentCodeInstance({
				comment: comment,
				code_id: code,
				assignment: assignment || null
			});

			inst.$save()
				.catch(function(err){
					console.error("failed to add code" + err);

					removeInstanceFromList(inst.data.id);
				});
			inst.data = {};
			inst.data.id = nextId--;


			self.instances.push(inst);

			return inst;
		}

		function getIdxOfCode(id) {
			for(var i=0; i < self.instances.length; i++) {
				if(self.instances[i].id == id ) {
						return i;
				}
			}

			return -1;
		}

		function removeInstanceFromList(id) {
			var idx = getIdxOfCode(id);
			if(idx < 0) {
				console.error("Failed to find code in instance list!");
			} else {
				self.instances.splice(idx,1);
			}			
		}

		function deleteInstance(id) {
			if(id >= 0) {
				var inst = new CommentCodeInstance({id:id})
				inst.$delete(id)
					.then(function(d){
						removeInstanceFromList(d.id);
					})
			} else {
				removeInstanceFromList(id);
			}
		}

		function getCodeByCodeId(codeId) {
			for(var i = 0; i < self.instances.length; i++) {
				var d = self.instances[i];
				if(d.code.id == codeId) {
					return d;
				}				
			}
			return null;
		}

		function toggleCode(commentId, codeId, assignment) {
			var code = getCodeByCodeId(codeId);

			if(code !== null) {
				deleteInstance(code.id);
			} else {
				addInstance(commentId, codeId);
			}
		}

		return self;
	}
}



/*
 * CodeableCommentModelFactory
 *
 *
 */


CodeableCommentModelFactory.$inject = [
	"$q",
	"$http",
	"Comment",
	"CommentCodeInstance", 
	"CommentCodeInstanceListModel",
	"ResourceHelperService"
	];

function CodeableCommentModelFactory(
		$q, $http, Comment, CommentCodeInstance, CommentCodeInstanceListModel, ResourceHelperService) {


	return selfConstructor;

	function selfConstructor(params) {
		params = params || {};

		//return object
		var self = {
			// data
			"data": params.obj || {},
			"codeInstanceList": new CommentCodeInstanceListModel(),
			"children": [],
			"parent": null,
			"nextSibling": null,
			"prevSibling": null,
			"selected": false,
			"expanded": true,

			// methods
			"get": get,
			"getEntireThread": getEntireThread,
			"addChild": addChild,
			"addCodeInstances": addCodeInstances

		}

		return self;

		//////////////////////////////



		function get(id) {
			var obj = Comment.get({id:id});

			obj.$promise
				.then(function(data) { self.data = data; })
				.catch(function(err) { 
					console.error("Error getting comment");
					console.dir(error);
				})
		}

		function getEntireThread(id, offset, limit) {
			var deferred = $q.defer();

			offset = offset || 0;
			limit = limit || 100;

			ResourceHelperService.getAll(
				Comment.query,
				{
					"root_comment": id,
					"offset": offset,
					"limit": limit
				}
			).then(function(result) {
				self.commentsList = result.map(function(d){ return selfConstructor({obj: d})});
				var idList = self.commentsList.map(function(d){ return d.data.id; });
				return getInstances(idList);
			}).then(function(result){
				var rootNodeIdx = buildCodedCommentTree(self.commentsList, result, id),
					root_node = self.commentsList[rootNodeIdx];
				self.data = root_node.data;
				self.codeInstanceList = root_node.codeInstanceList;
				self.children = root_node.children;
				self.commentsList[rootNodeIdx] = self;

				deferred.resolve(root_node);
			})
			.catch(function(error){
				deferred.reject(error);
			});

			return deferred.promise;
		}





		function getInstances(idList) {
			return ResourceHelperService.queryAllInBatched(
					CommentCodeInstance.query, 
					{ "offset": 0, "limit": 100 },
					"comment",
					idList,
					50
				);
		}

		function addChild(child) {
			child.parent = self;

			child.nextSibling = self.children.length > 0 ? self.children[0] : null;
			child.prevSibling = null;

			// link the nextSibling to this 
			if(child.nextSibling) {
				child.nextSibling.prevSibling = child;	
			}
			

			// append to beginning of list
			self.children.unshift(child);
		}


		function loadThreadAndCodes(id) {
			var promise = self.getEntireThread(id)
				.then(function(data){
					var idList = data.map(function(d){ return d.data.id; });
					return self.getInstances(idList)
				})

			return promise;
		}


		function createCommentMap(commentsList) {
			var node_map = {};

			// sort the list first
			commentsList.sort(function(a,b){
				if(a.data.id < b.data.id) { return -1; }
				else if(a.data.id > b.data.id) { return 1; }
				return 0;
			})

			// build up tree map
			commentsList.forEach(function(d,i) {
				node_map[d.data.id] = d;
			});

			return node_map;			
		}


		function addCodeInstances(node_map, instances) {
			if(instances && instances.length > 0) {
				instances.forEach(function(d,i){
					var node = node_map[d.comment];

					node.codeInstanceList.addExistingInstance(d);
				})
			}			
		}


		function buildCodedCommentTree(commentsList, instances, rootCommentId) {
			var rootNodeIdx = -1, 
				node_map = createCommentMap(commentsList);


			for(var i = 0; i < commentsList.length; i++) {
				var c = commentsList[i],
					parentId = c.data.parent_id;

				// add 
				if(parentId !== null && parentId !== undefined && parentId != c.data.article) {
					parent = node_map[parentId];
					if(parent.hasOwnProperty("children") === false) {
						console.error("!!! children undefined");
						console.dir(parent);
					}
					parent.addChild(c);
				}

				// check for root node
				if(c.data.id === rootCommentId) {
					rootNodeIdx = i;
				}
			}

			//
			self.addCodeInstances(node_map, instances);

			return rootNodeIdx;
		}
	}
}




/*
 * AssignmentModelFactory
 *
 *
 */

AssignmentModelFactory.$inject = ['$q', 'Assignment', 'ResourceHelperService'];

function AssignmentModelFactory(
		$q, Assignment, ResourceHelperService) {
	return function(params) {
		params = params || {};

		var self = {
			data: null,
			_assignment: null,

			// methods
			get: get,
			getCommentIndexById: getCommentIndexById,
			getNextComment: getNextComment,
			getPreviousComment: getPreviousComment
		};


		return self;

		//////////////////////////////



		function get(params) {
			self.data = Assignment.get(params);

			self.data.$promise
				.catch(function(err) { 
					console.error("Error getting comment");
					console.dir(error);
				})

			return self.data;
		}

		function getCommentIndexById(id) {
			if(self.data && self.data.assigned_comments) {
				var ac = self.data.assigned_comments;
				for(var i = 0; i < ac.length; i++) {
					if(ac[i].id == id) { return i; }
				}
			}

			return -1;
		}


		function getNextComment(currentCommentId) {
			if(!self.data || !self.data.assigned_comments) return null;

			var idx = getCommentIndexById(currentCommentId) + 1;
			if(idx >= 0 && idx < self.data.assigned_comments.length) {
				return self.data.assigned_comments[idx];
			}

			return null;
		}


		function getPreviousComment(currentCommentId) {
			if(!self.data || !self.data.assigned_comments) return null;

			var idx = getCommentIndexById(currentCommentId) - 1;
			if(idx >= 0) {
				return self.data.assigned_comments[idx];
			}

			return null;
		}


	}
}


