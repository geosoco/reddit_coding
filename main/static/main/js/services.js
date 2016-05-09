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
	SysUserService.$inject = ["$resource"];

	function CommentService($resource) {
		return $resource( "/api/comment/:id/", {id: "@id"}, commentService );
	}
	CommentService.$inject = ["$resource"];

	function SubmissionService($resource) {
		return $resource( "/api/submission/:id/", {id: "@id"}, basicService );
	}
	SubmissionService.$inject = ["$resource"];

	function CodeSchemeService($resource) {
		return $resource("/api/codescheme/:id/", {id: "@id"}, basicService );
	}
	CodeSchemeService.$inject = ["$resource"];

	function CodeService($resource) {
		return $resource("/api/code/:id/", {id: "@id"}, basicService );
	}
	CodeService.$inject = ["$resource"];


	function CommentCodeInstanceService($resource) {
		return $resource("/api/commentcodeinstance/:id/", {id: "@id"}, basicService );
	}
	CommentCodeInstanceService.$inject = ["$resource"];

	function SubmissionCodeInstanceService($resource) {
		return $resource("/api/submissioncodeinstance/:id/", {id: "@id"}, basicService );
	}
	SubmissionCodeInstanceService.$inject = ["$resource"];

	function AssignmentService($resource) {
		return $resource("/api/assignment/:id/", {id: "@id"}, basicService );
	}
	AssignmentService.$inject = ["$resource"];

	function CommentThreadService($resource) {
		return $resource("/api/commentthread/:id/", {id: "@id"}, basicService );
	}
	CommentThreadService.$inject = ["$resource"];

	
	function ResourceHelperService($q) {
		var self = this;

		self.getAll = function(requestMethod, params) {
			var deferred = $q.defer(),
				items = [],
				_params = angular.extend({}, params);

			function onResult(result) {
				// push results onto item list
				Array.prototype.push.apply(items, result.results);

				// compare progress
				if(items.length < result.count) {
					makeRequest(items.length);
				} else {
					deferred.resolve(items);
				}
			}

			function onError(result) {
				console.error("getAll failed: " + result);
				deferred.reject(result);
			}

			function makeRequest(offset) {
				_params.offset = offset;

				var req = requestMethod.call(this, _params);

				req.$promise.then(onResult, onError);
			}

			makeRequest();

			return deferred.promise;
		}


		self.queryAllInBatched = function(requestMethod, params, field, idList, maxBatchSize, limit) {
			var deferred = $q.defer(),
				remaining = idList.slice(0),
				items = [],
				fieldIn = field + "__in",
				_limit = limit || 100;


			function onResult(result) {
				// push results onto item list
				Array.prototype.push.apply(items, result);

				getNextBatch();
			}

			function onError(error) {
				console.error("queryInBatched failed: " + error);
				deferred.reject(error);
			}

			function getNextBatch() {
				// make sure we need a request
				if(remaining.length > 0) {
					var batch_size = Math.min(maxBatchSize, remaining.length),
						shortList = remaining.slice(0,batch_size);

					// update the code list
					params[fieldIn] = shortList.join(",");

					// shorten remaining
					remaining = remaining.slice(batch_size);				

					// requet the items
					self.getAll(requestMethod, params)
						.then(onResult, onError);

				} else {
					deferred.resolve(items);
				}
			}

			// start the series
			getNextBatch();

			return deferred.promise;
		}


		return self;
	}
	ResourceHelperService.$inject = ['$q'];


	angular.module('main.services', ['ngResource'])
		.factory("SysUser", SysUserService)
		.factory("Comment", CommentService)
		.factory("Submission", SubmissionService)
		.factory("CodeScheme", CodeSchemeService)
		.factory("Code", CodeService)
		.factory("CommentCodeInstance", CommentCodeInstanceService)
		.factory("SubmissionCodeInstance", SubmissionCodeInstanceService)
		.factory("Assignment", AssignmentService)
		.factory("CommentThread", CommentThreadService)
		.service("ResourceHelperService", ResourceHelperService)

})();
