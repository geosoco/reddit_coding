(function() {


	/*
	 *
	 *
	 *
	 */
	function CommentModel(Comment) {
		return function(params) {
			var self = this;

			self.get = function(id) {
				var obj = Comment.get({id:id});

				obj.$promise
					.then(function(data) { self.data = data; })
					.catch(function(err) { 
						console.error("Error getting comment");
						console.dir(error);
					})
			}
		}
	}




	/*
	 * CommentFactory
	 *
	 *
	 */

	function CommentFactory(Comment) {
		var self = {};

		self.get = function(id) {
			var obj = Comment.get({id:id}, null, null, function(error){
				console.error("Couldn't get Comment: " + error);
				console.dir(error);
			});

			return obj;
		}

		self.getByArticle = function(id) {
			var obj = Comment.get({article:id}, null, null, function(error){
				console.error("Couldn't get comments: " + error);
				console.dir(error);
			})
		}

		return self;
	}

	CommentFactory.$inject = ['Comment'];


	/*
	 * SubmissionFactory
	 *
	 *
	 */

	function SubmissionFactory(Submission) {
		var self = this, 
			f = {};

		f.get = function(id) {
			return Submission.get({id:id});
		}


		return f;
	}
	SubmissionFactory.$inject = ['Submission', 'Client'];


	angular.module('endpoint.factories', ['main.services'])
		.factory('CommentFactory', CommentFactory)
		.factory('SubmissionFactory', SubmissionFactory);



})();