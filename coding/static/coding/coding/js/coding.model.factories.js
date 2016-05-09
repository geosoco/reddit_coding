'use strict';
(function() {

/*
 * CommentCodeInstanceListModelFactory
 *
 *
 */
function CommentCodeInstanceListModelFactory(Comment, CommentCodeInstance) {
	return function(params) {
		var self = this;
		params = params || {};

		self.instances = params.instances || [];

		self.setInstances = function(instances) {
			self.instances = instances;
		}

		// data members
		self.addExistingInstance = function(code) {
			self.instances.unshift(code);
		}


		self.addInstance = function(comment, code) {

		}

		self.getCodeById = function(codeId) {
			self.instances.forEach(function(d,i){
				if(d.data.id == codeId) {
					return d;
				}
			})
			return null;
		}

		self.toggleCode = function(code_id) {

		}

		return self;
	}
}
CommentCodeInstanceListModelFactory.$inject = ["Comment", "CommentCodeInstance"];


/*
 * CodeableCommentModelFactory
 *
 *
 */

function CodeableCommentModelFactory(Comment, CommentCodeInstance, CommentCodeInstanceListModel) {
	return function(params) {
		var self = this;
		params = params || {};

		// data
		self.data = {};
		self.codeInstanceList = new CommentCodeInstanceListModel();
		self.children = [];


		if(params.hasOwnProperty('obj')) {
			self.data = params.obj;
		}


		self.get = function(id) {
			var obj = Comment.get({id:id});

			obj.$promise
				.then(function(data) { self.data = data; })
				.catch(function(err) { 
					console.error("Error getting comment");
					console.dir(error);
				})
		}

		self.getInstances = function(id) {
			return ResourceHelperService.getAll(
				CommentCodeInstance.query,
				{
					id: id,
					offset: 0,
					limit: 100
				}).then(function(result) {
					self.codeInstances = result;
				}).catch(function(error) {

				});
		}

		self.addChild = function(child) {
			self.children.unshift(child);
		}




		return self;
	}
}


CodeableCommentModelFactory.$inject = ['Comment', 'CommentCodeInstance', 'CommentCodeInstanceListModel'];

angular.module('coding.coding')
	.factory('CommentCodeInstanceListModel', CommentCodeInstanceListModelFactory)
	.factory('CodeableCommentModel', CodeableCommentModelFactory);

})();
