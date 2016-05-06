'use string';

(function() {

	/*
	 *
	 * common function for transforming results
	 * 
	 */
	function transformGetResponse(data) {
		var results = angular.fromJson(data);
		return results.results;
	}

	function transformSingleGetResponse(data) {
		var results = angular.fromJson(data);
		if(results.hasOwnProperty('results')) {
			return results.results[0];
		} else {
			return results;
		}
	}

	function decodeDataString(obj, property) {
		if(obj && obj.hasOwnProperty('data') && obj.data.hasOwnProperty(property)) {
			obj.data[property] = he.decode(obj.data[property]);
		}
		return obj;
	}

	function transformSingleComment(data) {
		return decodeDataString(
			transformSingleGetResponse(data),
			"body");
	}

	function transformComments(data) {
		var results = angular.fromJson(data);
		if(results && results.results) {
			results.results.forEach(function(d){
				decodeDataString(d,"body");
			})
		}

		return results;
	}


	/*
	 * basic service
	 */
	var basicService = {
				query: { 
					method: 'GET',
				},
				update: { method: 'PATCH'},
				delete: { method: 'DELETE'},
				save: { method: 'POST'},
				get: { 
					method: 'GET',
					transformResponse: transformSingleGetResponse			
				}
			};

	var commentService = angular.extend(
		{},
		basicService,
		{
			query: { transformResponse: transformComments },
			get: { transformResponse: transformSingleComment }
		});

	/*
	 *
	 * service methods
	 *
	 */
	function SysUserService($resource) {
		return $resource( "/api/sysusers/:id/", {id: "@id"}, basicService );
	}	 

	function CommentService($resource) {
		return $resource( "/api/comment/:id/", {id: "@id"}, commentService );
	}

	function SubmissionService($resource) {
		return $resource( "/api/submission/:id/", {id: "@id"}, basicService );
	}

	function CodeSchemeService($resource) {
		return $resource("/api/codescheme/:id/", {id: "@id"}, basicService );
	}

	function CommentCodeInstanceService($resource) {
		return $resource("/api/commentcodeinstance/:id/", {id: "@id"}, basicService );
	}

	function SubmissionCodeInstanceService($resource) {
		return $resource("/api/submissioncodeinstance/:id/", {id: "@id"}, basicService );
	}

	function AssignmentService($resource) {
		return $resource("/api/assignment/:id/", {id: "@id"}, basicService );
	}

	function CommentThreadService($resource) {
		return $resource("/api/commentthread/:id/", {id: "@id"}, basicService );
	}




	

	angular.module('main.services', ['ngResource'])
		.factory("SysUser", SysUserService)
		.factory("Comment", CommentService)
		.factory("Submission", SubmissionService)
		.factory("CodeScheme", CodeSchemeService)
		.factory("CommentCodeInstance", CommentCodeInstanceService)
		.factory("SubmissionCodeInstance", SubmissionCodeInstanceService)
		.factory("Assignment", AssignmentService)
		.factory("CommentThread", CommentThreadService);

})();
