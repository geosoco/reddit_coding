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


	/*
	 * basic service
	 */
	var basicService = {
				query: { 
					method: 'GET',
					transformResponse: transformGetResponse,
					isArray: true
				},
				update: { method: 'PATCH'},
				delete: { method: 'DELETE'},
				save: { method: 'POST'},
				get: { method: 'GET'}
			};

	/*
	 *
	 * service methods
	 *
	 */
	function SysUserService($resource) {
		return $resource( "/api/sysusers/:id/", {id: "@id"}, basicService );
	}	 

	function CommentService($resource) {
		return $resource( "/api/comment/:id/", {id: "@id"}, basicService );
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




	var services = angular.module('main.services', ['ngResource']);

	services.factory("SysUser", SysUserService);
	services.factory("Comment", CommentService);
	services.factory("Submission", SubmissionService);
	services.factory("CodeScheme", CodeSchemeService);
	services.factory("CommentCodeInstance", CommentCodeInstanceService);
	services.factory("SubmissionCodeInstance", SubmissionCodeInstanceService);
	services.factory("Assignment", AssignmentService);


})();
